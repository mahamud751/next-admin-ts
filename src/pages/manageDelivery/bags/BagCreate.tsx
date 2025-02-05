import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import queryString from "query-string";
import { FC, useEffect, useMemo, useState } from "react";
import {
  AutocompleteInput,
  Create,
  CreateProps,
  DateInput,
  Link,
  ReferenceInput,
  SimpleForm,
  useCreate,
  useNotify,
  useRedirect,
} from "react-admin";
import { FormSpy } from "react-final-form";

import { useDocumentTitle, useRequest } from "@/hooks";
import { logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import Form from "@/components/common/Form";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import WarehouseInput from "@/components/common/WarehouseInput";
import ShiftScheduleInput from "@/components/manageDelivery/bags/ShiftScheduleInput";
import ZoneInput from "@/components/manageDelivery/bags/ZoneInput";
import ShiftTypeInput from "@/components/manageDelivery/bags/ShiftTypeInput";
import ShipmentDetailsTable from "@/components/manageDelivery/bags/ShipmentDetailsTable";

const BagCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Bag Create");

  const redirect = useRedirect();
  const notify = useNotify();
  const classes = useAroggaStyles();
  const [create] = useCreate();
  const [formValues, setFormValues] = useState(null);
  const [shipmentBagDetails, setShipmentBagDetails] = useState<any>([]);

  const COUNT_SHIPMENT_BY_STATUS_QUERY_PARAMS = {
    _delivery_option: formValues?.sb_shift_type,
    _shift_schedule_id: formValues?.sb_shift_schedule_id,
    ...(formValues?.sb_zone_id?.length && {
      _zones: formValues?.sb_zone_id?.map((zone) => zone)?.join(","),
    }),
  };

  const SHIPMENT_ZONE_QUERY_PARAMS = {
    _order: "ASC",
    _perPage: 500,
    // _type: formValues?.sb_shift_type,
  };

  const { data: countShipmentData, refetch: fetchCountShipmentByStatus } =
    useRequest(
      `/v1/countShipmentByStatus?${queryString.stringify(
        COUNT_SHIPMENT_BY_STATUS_QUERY_PARAMS
      )}`,
      {},
      {
        isWarningNotify: false,
      }
    );

  const shipmentIds = useMemo(() => {
    return (
      shipmentBagDetails
        ?.map((item) => item?.shipmentId)
        .filter(Boolean)
        .join(",") || ""
    );
  }, [shipmentBagDetails]);

  const updateShipmentBagDetails = (newData) => {
    setShipmentBagDetails((prevDetails) =>
      prevDetails.map((existingItem) => {
        // Find the corresponding new item by shipmentId
        const updatedItem = newData.find(
          (item) => item.shipmentId === existingItem.shipmentId
        );

        // If there's an updated item, merge it with the existing item
        return updatedItem ? { ...existingItem, ...updatedItem } : existingItem;
      })
    );
  };

  const getFetchBagWiseShipmentData = async () => {
    try {
      const res: any = await httpClient(`/v1/shipment?ids=${shipmentIds}`, {
        method: "GET",
      });
      const bagWiseShipmentData = res?.json?.data;
      if (bagWiseShipmentData) {
        const formattedData = bagWiseShipmentData.map((data) => ({
          shipmentId: data?.s_id,
          shipmentStatus: data?.s_status,
          orderId: data?.s_order_id,
          deliveryType: data?.s_type,
          sequence: data?.s_sequence,
          zone: data?.s_zone_name,
          isCold: data?.s_m_cold,
          address: data?.s_address,
          zoneId: data?.s_zone_id,
        }));

        // Set the formatted data, replacing the previous state (not appending)
        updateShipmentBagDetails(formattedData);
      }
    } catch (err: any) {
      logger(err);
      return notify(err?.message || "Something went wrong, Please try again!", {
        type: "error",
      });
    }
  };

  const { data, isLoading, refetch } = useRequest(
    `/v1/zone?${queryString.stringify(SHIPMENT_ZONE_QUERY_PARAMS)}`
  );

  useEffect(() => {
    if (
      (formValues?.sb_shift_type && formValues?.sb_shift_schedule_id) ||
      (formValues?.sb_shift_type &&
        formValues?.sb_shift_schedule_id &&
        formValues?.sb_zone_id)
    )
      fetchCountShipmentByStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formValues?.sb_shift_type,
    formValues?.sb_shift_schedule_id,
    formValues?.sb_zone_id,
  ]);

  useEffect(() => {
    if (formValues?.sb_warehouse_id && formValues?.sb_shift_type) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.sb_shift_type]);

  const onSave = async ({
    sb_warehouse_id,
    sb_zone_id,
    sb_shift_type,
    sb_shift_schedule_id,
    sb_deliveryman_id,
  }) => {
    try {
      if (shipmentIds !== "") {
        getFetchBagWiseShipmentData();
      }

      // Filter items to find any with status other than "sorted"
      const invalidItems = shipmentBagDetails.filter(
        (item) => item.shipmentStatus !== "sorted"
      );

      if (invalidItems.length > 0) {
        // Notify if there are items with status other than "sorted"
        notify(
          "Only items with status 'sorted' are allowed. Please remove items with other statuses.",
          { type: "warning" }
        );
        return; // Stop further processing
      }

      //   const transform = (data) => ({
      //     ...data,
      //     p_content: content,
      //   });

      // Prepare payload
      const payload = {
        sb_warehouse_id,
        sb_zone_id: sb_zone_id?.map((zone) => zone)?.join(","),
        sb_shift_type,
        sb_shift_schedule_id,
        sb_deliveryman_id,
        sbd: JSON.stringify(
          shipmentBagDetails?.map((item) => ({
            ...(item && {
              sbd_shipment_id: item?.shipmentId,
            }),
          }))
        ),
      };
      await create("v1/shipmentBag", { data: payload });
      notify("Shipment Bag created successfully", { type: "success" });
      redirect("list", "/v1/shipmentBag");
    } catch (err: any) {
      logger(err);
      notify(err?.message || "Something went wrong, Please try again!", {
        type: "error",
      });
    }
  };
  return (
    <Create {...props}>
      <SimpleForm onSubmit={onSave}>
        {!!countShipmentData?.length && (
          <Table
            size="small"
            style={{
              position: "absolute",
              right: 40,
              width: 400,
              zIndex: 9999,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {countShipmentData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className={classes.capitalize}>
                    <Link
                      to={{
                        pathname: "/v1/shipment",
                        search: `filter=${JSON.stringify({
                          _status: item.s_status,
                        })}`,
                      }}
                    >
                      {item.s_status}
                    </Link>
                  </TableCell>
                  <TableCell>{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <WarehouseInput
          source="sb_warehouse_id"
          variant="outlined"
          style={{ display: "none" }}
        />
        <ShiftTypeInput variant="outlined" />
        <Grid container spacing={1} style={{ width: "100%" }}>
          {formValues?.sb_shift_type && (
            <Form>
              {({ form }) => (
                <Grid item xs={12} md={2}>
                  <DateInput
                    source="filterByDate"
                    label="Filter by date"
                    variant="outlined"
                    helperText={false}
                    onChange={() => form.change("sb_shift_schedule_id", null)}
                    fullWidth
                  />
                </Grid>
              )}
            </Form>
          )}
          {formValues?.sb_shift_type && (
            <Grid item xs={12} md={2}>
              <ShiftScheduleInput variant="outlined" fullWidth />
            </Grid>
          )}
        </Grid>
        {formValues?.sb_warehouse_id && formValues?.sb_shift_type && (
          <ZoneInput
            inputType="autocompleteArrayInput"
            variant="outlined"
            choices={
              !!data?.length
                ? data.map((zone) => ({
                    id: zone.z_id,
                    name: zone.z_name,
                  }))
                : []
            }
            loading={isLoading}
          />
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gridGap: 8,
            width: 346,
          }}
        >
          <ReferenceInput
            source="sb_deliveryman_id"
            label="Delivery Man"
            variant="outlined"
            helperText={false}
            reference="v1/users/delivery-man"
            filter={{
              shift_type: formValues?.isAllShiftType
                ? "all"
                : formValues?.shiftType,
              ...(!formValues?.isAllShiftType && {
                _shift_schedule_id: formValues?.sb_shift_schedule_id,
                _zone_ids: formValues?.sb_zone_id?.toString(),
              }),
            }}
            fullWidth
          >
            <AutocompleteInput
              matchSuggestion={() => true}
              optionText={(value) =>
                !!value?.bag_assigned
                  ? `${value?.u_name} (Assigned)`
                  : value?.u_name
              }
              //   options={{
              //     InputProps: {
              //       multiline: true,
              //     },
              //   }}
              //   resettable
            />
          </ReferenceInput>
          <FormatedBooleanInput source="isAllShiftType" label="All" />
        </div>
        {!!formValues?.sb_zone_id && (
          <ShipmentDetailsTable
            shipmentBagDetails={shipmentBagDetails}
            setShipmentBagDetails={setShipmentBagDetails}
          />
        )}
        <FormSpy
          subscription={{ values: true }}
          onChange={
            ({ values }) =>
              // Fix bad setState() call inside `FormSpy` error using setTimeout
              setFormValues(values)
            // setTimeout(() => {
            //     setFormValues(values);
            // }, 0)
          }
        />
        {countShipmentData?.length > 8 && <Box mt={25} />}
      </SimpleForm>
    </Create>
  );
};

export default BagCreate;
