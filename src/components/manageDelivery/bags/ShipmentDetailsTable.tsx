import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ClearIcon from "@mui/icons-material/Clear";
import localforage from "localforage";
import { FC, useEffect, useMemo, useRef } from "react";
import {
  AutocompleteInput,
  FunctionField,
  RaRecord as Record,
  ReferenceField,
  ReferenceInput,
  TextInput,
  useNotify,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

// import AudioFile from "../../../../src/assets/mp3/alarm.mp3"; // Import the MP3 file
import { useRequest } from "@/hooks";
import { isEmpty, isJSONParsable } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

var store = localforage.createInstance({
  name: "shipmentDB",
});

type ShipmentDetailsTableProps = {
  shipmentBagDetails: any;
  setShipmentBagDetails: any;
};

const ShipmentDetailsTable: FC<ShipmentDetailsTableProps> = ({
  shipmentBagDetails,
  setShipmentBagDetails,
}) => {
  const { setValue } = useFormContext();
  const notify = useNotify();
  const classes = useAroggaStyles();
  const values = useWatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const queryParams = useMemo(() => {
    return [
      values?.sb_shift_type ? `_delivery_option=${values?.sb_shift_type}` : "",
      values.sb_shift_schedule_id
        ? `_shift_schedule_id=${values.sb_shift_schedule_id}`
        : "",
      values?.sb_zone_id ? `_s_zone_id=${values?.sb_zone_id?.join(",")}` : "",
    ]
      .filter(Boolean)
      .join("&");
  }, [values?.sb_shift_type, values?.sb_shift_schedule_id, values?.sb_zone_id]);

  const { data: shipmentBagItemsData, refetch: shipmentBagItemsDataRefetch } =
    useRequest(`/v1/onlyShipmentList?${queryParams}`, {}, {});

  useEffect(() => {
    if (shipmentBagItemsData) {
      const setNewItems = async () => {
        try {
          // First, clear all previous data from the store
          await store.clear();

          // Now, set the new shipment data
          shipmentBagItemsData.forEach((value) => {
            store.setItem(value.s_id.toString(), value);
          });
        } catch (error) {
          console.error("Error setting items:", error);
        }
      };

      setNewItems();
    }
  }, [shipmentBagItemsData]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const scannShipmentItem = () => {
    const { qrDetails } = values;
    if (!isJSONParsable(qrDetails)) return;

    let scanParsedData = JSON.parse(qrDetails);
    if (checkIfAlreadyAdded(scanParsedData?.s, scanParsedData, true)) return;

    findShipmentItem(undefined, true, scanParsedData);

    setValue("shipmentId", undefined);
    setValue("qrDetails", undefined);

    setTimeout(() => inputRef.current?.focus(), 100); // Add a small delay
    // setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleOnSelect = (selectShipmentItem) => {
    if (selectShipmentItem) {
      findShipmentItem(selectShipmentItem);
    }
  };

  const handleRemove = (shipmentId) => {
    setShipmentBagDetails((prev) =>
      prev.filter((item) => item.shipmentId !== shipmentId)
    );
  };

  const checkIfAlreadyAdded = (shipmentId, shipmentDetails, isBarcode) => {
    const existingShipment = shipmentBagDetails?.find(
      (item) => item.shipmentId === shipmentId
    );
    if (!isEmpty(existingShipment)) {
      if (isBarcode) setValue("qrDetails", undefined);
      playAudio();
      notify(
        `Shipment ${shipmentDetails.s_order_id || shipmentDetails.o}${
          shipmentDetails.s_sequence || shipmentDetails.seq
        } already added!`,
        { type: "warning" }
      );
      return true;
    }
    return false;
  };

  const addShipmentToState = (shipmentData) => {
    // Use a functional update to avoid race conditions
    setShipmentBagDetails((prevProducts) => {
      // Check again in case the state has been updated between scans
      const isAlreadyAdded = prevProducts.find(
        (item) =>
          item.shipmentId === shipmentData.s_id ||
          (shipmentData.s && item.zoneId === shipmentData.s_zone_id)
      );

      if (isAlreadyAdded) return prevProducts;

      return [
        {
          shipmentId: shipmentData.s_id || shipmentData.s,
          shipmentStatus: shipmentData.s_status || shipmentData.s_status,
          orderId: shipmentData.s_order_id || shipmentData.o,
          deliveryType: shipmentData.s_type || shipmentData.s_type,
          sequence: shipmentData.s_sequence || shipmentData.seq,
          zone: shipmentData.s_zone_name || shipmentData.z,
          isCold: shipmentData.s_m_cold || shipmentData.c,
          address: shipmentData.s_address || shipmentData.a,
          zoneId: shipmentData.s_zone_id || shipmentData.z_id,
        },
        ...prevProducts,
      ];
    });
  };

  const findShipmentItem = async (
    selectShipmentItem = undefined,
    isBarcode = false,
    scanShipmentItem = undefined
  ) => {
    /* This code use for indexdb */
    const shipmentId = selectShipmentItem?.s_id || scanShipmentItem?.s;
    let selectedShipment;

    if (isBarcode) {
      let jsonData = await store.getItem(shipmentId.toString());
      selectedShipment = jsonData || scanShipmentItem;

      if (selectedShipment.s_status !== "sorted") playAudio();
      if (!values?.sb_zone_id.includes(selectedShipment.s_zone_id)) playAudio();
    } else {
      selectedShipment = selectShipmentItem;
      if (checkIfAlreadyAdded(shipmentId, selectedShipment, isBarcode)) return;
    }

    if (selectedShipment) {
      // Check again to avoid duplicate items
      if (
        !isBarcode &&
        checkIfAlreadyAdded(shipmentId, selectedShipment, isBarcode)
      )
        return;

      if (selectedShipment.s_status !== "sorted") playAudio();
      if (!values?.sb_zone_id.includes(selectedShipment.s_zone_id)) playAudio();

      addShipmentToState(selectedShipment);
    } else {
      playAudio();
      notify("Shipment item not found!", { type: "warning" });
    }
  };

  useEffect(() => {
    shipmentBagItemsDataRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.sb_shift_type, values?.sb_shift_schedule_id, values?.sb_zone_id]);

  return (
    <>
      <Grid container spacing={1}>
        {/* <audio ref={audioRef} src={AudioFile} /> */}
        <Grid item sm={2}>
          <ReferenceInput
            source="shipmentId"
            label="Shipment"
            variant="outlined"
            helperText={false}
            reference="v1/shipment"
            filterToQuery={(searchText) => ({
              _order_sequence: searchText,
            })}
            enableGetChoices={({ _order_sequence }) =>
              !!_order_sequence && _order_sequence?.trim()?.length > 0
            }
            fullWidth
          >
            <AutocompleteInput
              optionText={(item) => `${item?.s_order_id}${item?.s_sequence}`}
              matchSuggestion={() => true}
              onSelect={(data) => {
                handleOnSelect(data);
              }}
            />
          </ReferenceInput>
        </Grid>
        <Grid item sm={5}>
          <TextInput
            source="qrDetails"
            label="QR Details"
            variant="outlined"
            helperText={false}
            inputRef={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                scannShipmentItem(); // Call the function when Enter is pressed
              }
            }}
            // options={{ autoComplete: "off" }}
            fullWidth
            resettable
          />
        </Grid>
      </Grid>

      {!!shipmentBagDetails.length && (
        <TableContainer>
          <Table size="small" style={{ width: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.whitespaceNowrap}>
                  Sl No
                </TableCell>
                <TableCell className={classes.whitespaceNowrap}>
                  Shipment ID
                </TableCell>
                <TableCell className={classes.whitespaceNowrap}>
                  Order ID
                </TableCell>
                <TableCell className={classes.whitespaceNowrap}>
                  Delivery Type
                </TableCell>
                <TableCell className={classes.whitespaceNowrap}>
                  Shipment Status
                </TableCell>
                <TableCell className={classes.whitespaceNowrap}>Zone</TableCell>
                <TableCell>Cold</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipmentBagDetails.map((item, i) => (
                <TableRow
                  key={`${i}-${item.zone}-${item.shipmentId}`}
                  style={{
                    background: !values?.sb_zone_id.includes(item.zoneId)
                      ? "#ffc107" // Shipment ids wise doesn't match
                      : item.shipmentStatus !== "sorted"
                      ? "rgb(232, 59, 70)" // Red if shipmentStatus is not "sorted"
                      : undefined, // No color if none of the conditions are met
                  }}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {item.orderId}
                    {item.sequence}
                  </TableCell>
                  <TableCell>{item.orderId}</TableCell>
                  <TableCell>{item?.deliveryType}</TableCell>
                  <TableCell
                    className={`${classes.whitespaceNowrap} ${classes.capitalize}`}
                  >
                    {!!item.shipmentStatus ? (
                      item?.shipmentStatus
                    ) : (
                      <ReferenceField
                        source="shipmentId"
                        reference="v1/shipment"
                        record={item}
                        link={false}
                        className={classes.capitalize}
                      >
                        <FunctionField
                          onClick={(e) => e.stopPropagation()}
                          render={(record: Record) => {
                            const existingShipment = shipmentBagDetails.find(
                              (shipmentItem) =>
                                shipmentItem.shipmentId === record.s_id
                            );

                            const needsUpdate =
                              existingShipment && !existingShipment.address;

                            if (!existingShipment || needsUpdate) {
                              // Simulate async operation such as an API response
                              setShipmentBagDetails((prevDetails) =>
                                prevDetails.map((item) =>
                                  item.shipmentId === record.s_id
                                    ? {
                                        ...item,
                                        shipmentId: record?.s_id,
                                        orderId: record?.s_order_id,
                                        shipmentStatus: record?.s_status,
                                        deliveryType: record?.s_type,
                                        address:
                                          record?.s_address ?? item?.address, // Only update if undefined
                                        zoneId:
                                          record?.s_zone_id ?? item?.zoneId, // Only update if undefined
                                        zone: record?.s_zone_name ?? item?.zone, // Only update if undefined
                                        sequence:
                                          record?.s_sequence ?? item?.sequence, // Only update if undefined
                                        isCold:
                                          record?.s_m_cold ?? item?.isCold, // Only update if undefined
                                      }
                                    : item
                                )
                              );
                            }

                            return <span>{record?.s_status}</span>;
                          }}
                        />
                      </ReferenceField>
                    )}
                  </TableCell>

                  <TableCell className={`${classes.whitespaceNowrap}`}>
                    {item.zone}
                  </TableCell>
                  <TableCell>{!!item.isCold && <AcUnitIcon />}</TableCell>
                  <TableCell>{item?.address}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleRemove(item.shipmentId)}>
                      <ClearIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default ShipmentDetailsTable;
