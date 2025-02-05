import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { FC, useState } from "react";
import {
  AutocompleteInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  minValue,
  required,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { useRequest } from "../../../hooks";
import {
  convertAttachmentsToBase64,
  getQuantityLabel,
  getReadableSKU,
} from "../../../utils/helpers";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";
import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";
import CustomField from "@/components/common/CustomField";
import InlineArrayInput from "@/components/common/InlineArrayInput";

type QCDialogProps = {
  isQCDialogOpen: boolean;
  setIsQCDialogOpen: (isQCDialogOpen: boolean) => void;
  shipmentId: string;
  beforeInBag?: number;
};

const QCDialog: FC<QCDialogProps> = ({
  isQCDialogOpen,
  setIsQCDialogOpen,
  shipmentId,
  beforeInBag,
}) => {
  const classes = useAroggaStyles();
  const form = useForm();
  const { values, hasValidationErrors } = useFormState();

  const [selectedSearchBatchIds, setSelectedSearchBatchIds] = useState({});

  const { isLoading: isShipmentLoading, data } = useRequest(
    `/v1/shipment/${shipmentId}`,
    {},
    {
      isPreFetching: true,
      refreshDeps: [shipmentId],
      onSuccess: ({ data }) => handleShipmentSuccess(data),
    }
  );

  const { isLoading: isQCLoading, refetch: createQC } = useRequest(
    "",
    {},
    {
      isRefresh: true,
      onSuccess: () => onDialogClose(),
    }
  );

  let totalLostCount = 0;
  let totalDamagedCount = 0;

  const getMultipliedCount = (count = 0, multiplier = 1) => {
    return count * multiplier;
  };

  const getStockMappingData = (shipmentItem) => {
    return shipmentItem?.si_stock_mapping?.map((stockMapItem) => {
      totalLostCount += stockMapItem?.sd_lost_count || 0;
      totalDamagedCount += stockMapItem?.sd_damage_count || 0;

      let okCount = 0;

      if (shipmentItem?.si_stock_mapping?.length === 1) {
        const qty = shipmentItem?.si_in_count || shipmentItem?.si_out_count;

        okCount = getMultipliedCount(
          qty -
            ((+stockMapItem?.sd_lost_count || 0) +
              (+stockMapItem?.sd_damage_count || 0)),
          data?.i_type === "replacement"
            ? shipmentItem?.replacement_unit_multiplier
            : shipmentItem?.pu_multiplier
        );
      } else {
        okCount = getMultipliedCount(
          stockMapItem?.sd_ok_count,
          data?.i_type === "replacement"
            ? shipmentItem?.replacement_unit_multiplier
            : shipmentItem?.pu_multiplier
        );
      }

      return {
        sd_id:
          data?.i_type === "replacement" && shipmentItem?.si_in_count
            ? stockMapItem?.searchedBatchId
            : stockMapItem?.sd_id,
        sd_batch_no:
          data?.i_type === "replacement" && shipmentItem?.si_in_count
            ? selectedSearchBatchIds?.[stockMapItem?.searchedBatchId]
            : stockMapItem?.sd_batch_no,
        sd_lost_count: getMultipliedCount(
          stockMapItem?.sd_lost_count,
          data?.i_type === "replacement"
            ? shipmentItem?.replacement_unit_multiplier
            : shipmentItem?.pu_multiplier
        ),
        sd_damage_count: getMultipliedCount(
          stockMapItem?.sd_damage_count,
          data?.i_type === "replacement"
            ? shipmentItem?.replacement_unit_multiplier
            : shipmentItem?.pu_multiplier
        ),
        sd_ok_count: okCount,
      };
    });
  };

  const qcItems = values.si?.map((item) => ({
    qci_entity_name: "shipment",
    qci_master_id: shipmentId,
    qci_detail_id: item?.si_id,
    qci_damaged_data: getStockMappingData(item),
    // qci_batch_not_found: item?.qci_batch_not_found,
    qci_stock_mapping: getStockMappingData(item),
    attachedFiles_qci_damage_picture: item?.si_stock_mapping?.some(
      (stockMapItem) => !!stockMapItem?.sd_damage_count
    )
      ? item.attachedFiles_qci_damage_picture
      : [],
  }));

  const getTotalCount = (scopedFormData) => {
    return (scopedFormData?.si_stock_mapping || []).reduce(
      (
        prevValue,
        { sd_lost_count = 0, sd_damage_count = 0, sd_ok_count = 0 }
      ) => prevValue + (+sd_lost_count + +sd_damage_count + +sd_ok_count),
      0
    );
  };

  const resetStockMappingCounts = (item) => ({
    ...item,
    searchedBatchId: undefined,
    sd_lost_count: 0,
    sd_damage_count: 0,
    sd_ok_count: 0,
  });

  const resetShipmentItem = ({ si_stock_mapping, ...rest }) => ({
    ...rest,
    // qci_batch_not_found: "",
    si_stock_mapping: si_stock_mapping?.map(resetStockMappingCounts) || [],
    attachedFiles_qci_damage_picture: [],
  });

  const onDialogClose = () => {
    // TODO: Remove this in future
    // values.attachedFiles_qc_damage_picture = [];
    values.qc_damage_responsible = undefined;
    values.si = values?.si?.map(resetShipmentItem) || [];
    setSelectedSearchBatchIds({});
    setIsQCDialogOpen(false);
  };

  const onConfirm = async () => {
    createQC({
      endpoint: "/v1/qualityControl",
      method: "POST",
      body: {
        qc_entity: "shipment",
        qc_entity_id: shipmentId,
        ...(values?.sb_id && { qc_bag_id: values?.sb_id }),
        qc_issue_type: data?.i_type,
        ...(!totalLostCount &&
          !totalDamagedCount &&
          data?.i_type === "return" && {
            qc_approve_full_refund: 1,
          }),
        ...((totalLostCount || totalDamagedCount) && {
          qc_damage_responsible:
            !!beforeInBag && !data?.s_is_outside_dhaka
              ? "company"
              : values.qc_damage_responsible,
        }),
        // TODO: Remove this in future
        // attachedFiles_qc_damage_picture:
        //     await convertAttachmentsToBase64(
        //         "attachedFiles_qc_damage_picture",
        //         [
        //             {
        //                 attachedFiles_qc_damage_picture:
        //                     values.attachedFiles_qc_damage_picture,
        //             },
        //         ]
        //     ),
        qci: await convertAttachmentsToBase64(
          "attachedFiles_qci_damage_picture",
          qcItems
        ),
      },
    });
  };

  const handleShipmentSuccess = (data) => {
    const filteredData = data?.si
      ?.filter((item) =>
        !!data?.s_issue_id &&
        !["rescheduled", "cancelled"].includes(data?.s_status)
          ? !!item?.si_in_count
          : true
      )
      ?.map(({ pv_attribute, si_stock_mapping, ...rest }) => ({
        ...rest,
        pvAttribute: getReadableSKU(pv_attribute),
        si_stock_mapping: si_stock_mapping?.map(resetStockMappingCounts) || [],
      }));

    form.change("si", filteredData);
  };

  const getCountValidation = (scopedFormData, shipmentItems) => {
    const isSingleBatch = scopedFormData?.si_stock_mapping?.length === 1;
    const qty = scopedFormData?.si_in_count || scopedFormData?.si_out_count;
    const foundScopedFormData = shipmentItems?.find(
      (item) => item?.si_id === scopedFormData?.si_id
    );
    const totalCount = getTotalCount(foundScopedFormData);

    if (isSingleBatch) {
      return totalCount > qty
        ? `Summation of all count can't be greater than ${qty}!`
        : undefined;
    } else {
      return totalCount !== qty
        ? `Summation of all count must be equal to ${qty}!`
        : undefined;
    }
  };

  const handleOnFocus = (e) => e.target.select();

  const formattedShipmentId =
    data?.s_order_id &&
    data?.s_sequence &&
    `${data?.s_order_id}${data?.s_sequence}`;

  const isShowDamagedImagesInput = (items) => {
    return items?.some((item) => !!item?.sd_damage_count);
  };

  return (
    <Dialog open={isQCDialogOpen} onClose={onDialogClose} maxWidth="xl">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          {!!formattedShipmentId && `QC - Shipment ID #${formattedShipmentId}`}
        </Box>
      </DialogTitle>
      {isShipmentLoading && (
        <DialogContent>
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        </DialogContent>
      )}
      {!isShipmentLoading && (
        <DialogContent>
          <Box display="flex" gap={30}>
            <CustomField label="QC Type" value="Shipment" />
            {data?.i_type && (
              <CustomField
                label="Issue Type"
                value={data?.i_type}
                className={classes.capitalize}
              />
            )}
            <CustomField
              label="Shipment Status"
              value={data?.s_status}
              className={classes.capitalize}
            />
          </Box>
          {/* TODO: Remove this in future */}
          {/* <AroggaMovableImageInput
                        source="attachedFiles_qc_damage_picture"
                        label="Damaged Images"
                    /> */}
          {!!values?.si?.length && (
            <InlineArrayInput
              source="si"
              label="Shipment Items"
              disableAdd
              disableRemove
              disableReordering
              enableRenderProps
            >
              {({ scopedFormData }) => {
                const getLabel = (qty) => {
                  return getQuantityLabel({
                    qty,
                    salesUnit:
                      data?.i_type === "replacement"
                        ? scopedFormData?.replacement_unit_label
                        : scopedFormData?.p_unit_label,
                    baseUnit:
                      data?.i_type === "replacement"
                        ? scopedFormData?.product_replacement_base_unit
                        : scopedFormData?.product_base_unit,
                    salesUnitMultiplier:
                      data?.i_type === "replacement"
                        ? scopedFormData?.replacement_unit_multiplier
                        : scopedFormData?.pu_multiplier,
                  });
                };

                const isShowSearchBatchNoInput =
                  data?.i_type === "replacement" && scopedFormData?.si_in_count;

                return (
                  <div
                    style={{
                      border: "1px solid #AAAAAA",
                      marginTop: 20,
                      padding: "8px 80px 0 8px",
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item sm={4}>
                        <TextInput
                          source={"p_name"}
                          //   record={scopedFormData}
                          label="Product"
                          variant="outlined"
                          helperText={false}
                          multiline
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <TextInput
                          source={"pvAttribute"}
                          //   record={scopedFormData}
                          label="Variant"
                          variant="outlined"
                          helperText={false}
                          multiline
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item sm={2}>
                        <TextInput
                          source={
                            !!scopedFormData?.si_in_count
                              ? "si_in_count"
                              : "si_out_count"
                          }
                          //   record={scopedFormData}
                          label="Qty"
                          variant="outlined"
                          helperText={false}
                          fullWidth
                          disabled
                        />
                        <span className={classes.whitespaceNowrap}>
                          {getLabel(
                            scopedFormData?.si_in_count ||
                              scopedFormData?.si_out_count
                          )}
                        </span>
                      </Grid>
                      {/* {!!isShowSearchBatchNoInput &&
                                            scopedFormData?.si_stock_mapping?.some(
                                                (item) => !item?.searchedBatchId
                                            ) && (
                                                <Grid item sm={2}>
                                                    <TextInput
                                                        source={getSource(
                                                            "qci_batch_not_found"
                                                        )}
                                                          //   record={scopedFormData}
                                                        label="Not Found Batch"
                                                        variant="outlined"
                                                        helperText={false}
                                                        validate={[required()]}
                                                        multiline
                                                        fullWidth
                                                    />
                                                </Grid>
                                            )} */}
                    </Grid>
                    <span className={classes.labeled}>Lost / Dam Count</span>
                    <InlineArrayInput
                      source={"si_stock_mapping"}
                      //   record={scopedFormData}
                      label=""
                      disableAdd
                      disableRemove
                      disableItemLabel
                      disableReordering
                      enableRenderProps
                    >
                      {({
                        getSource,
                        scopedFormData: stockMappingScopedFormData,
                      }) => (
                        <Grid container spacing={1}>
                          {!!isShowSearchBatchNoInput && (
                            <Grid item sm={4}>
                              <ReferenceInput
                                source={getSource("searchedBatchId")}
                                label="Search Batch No"
                                variant="outlined"
                                reference="v1/stockDetail"
                                filterToQuery={(searchText) => ({
                                  _product_variant_id:
                                    scopedFormData?.si_variant_id,
                                  _batch_no: searchText,
                                })}
                                onSelect={(selectedItem) =>
                                  setSelectedSearchBatchIds((prev) => ({
                                    ...prev,
                                    [selectedItem?.sd_id]:
                                      selectedItem?.sd_batch_no,
                                  }))
                                }
                                helperText={false}
                                // validate={[required()]}
                                fullWidth
                              >
                                <AutocompleteInput
                                  optionText="sd_batch_no"
                                  //   resettable
                                />
                              </ReferenceInput>
                            </Grid>
                          )}
                          {!isShowSearchBatchNoInput && (
                            <Grid item sm={2}>
                              <TextInput
                                source={"sd_id"}
                                // record={stockMappingScopedFormData}
                                label="SDID"
                                variant="outlined"
                                helperText={false}
                                fullWidth
                                disabled
                              />
                            </Grid>
                          )}
                          {!isShowSearchBatchNoInput && (
                            <Grid item sm={2}>
                              <TextInput
                                source={"sd_batch_no"}
                                // record={stockMappingScopedFormData}
                                label="Batch No"
                                variant="outlined"
                                helperText={false}
                                disabled
                                fullWidth
                              />
                            </Grid>
                          )}
                          <Grid item sm={3}>
                            <NumberInput
                              source={"sd_lost_count"}
                              // record={stockMappingScopedFormData}
                              label="Lost Count"
                              variant="outlined"
                              helperText={false}
                              validate={[
                                minValue(0, "Lost count can't be negative"),
                                (_, allValues) =>
                                  getCountValidation(
                                    scopedFormData,
                                    allValues?.si
                                  ),
                              ]}
                              min={0}
                              onFocus={handleOnFocus}
                              fullWidth
                            />
                            <div className={classes.whitespaceNowrap}>
                              {getLabel(
                                stockMappingScopedFormData?.sd_lost_count
                              )}
                            </div>
                          </Grid>
                          <Grid item sm={3}>
                            <NumberInput
                              source={"sd_damage_count"}
                              // record={stockMappingScopedFormData}
                              label="Dam Count"
                              variant="outlined"
                              helperText={false}
                              validate={[
                                minValue(0, "Dam count can't be negative"),
                                (_, allValues) =>
                                  getCountValidation(
                                    scopedFormData,
                                    allValues?.si
                                  ),
                              ]}
                              min={0}
                              onFocus={handleOnFocus}
                              fullWidth
                            />
                            <div className={classes.whitespaceNowrap}>
                              {getLabel(
                                stockMappingScopedFormData?.sd_damage_count
                              )}
                            </div>
                          </Grid>
                          {scopedFormData?.si_stock_mapping?.length > 1 && (
                            <Grid item sm={2}>
                              <NumberInput
                                source={"sd_ok_count"}
                                // record={stockMappingScopedFormData}
                                label="Ok Count"
                                variant="outlined"
                                helperText={false}
                                validate={[
                                  minValue(0, "Ok count can't be negative"),
                                  (_, allValues) =>
                                    getCountValidation(
                                      scopedFormData,
                                      allValues?.si
                                    ),
                                ]}
                                min={0}
                                onFocus={handleOnFocus}
                                fullWidth
                              />
                              <div
                                className={classes.whitespaceNowrap}
                                style={{
                                  display: "block",
                                }}
                              >
                                {getLabel(
                                  stockMappingScopedFormData?.sd_ok_count
                                )}
                              </div>
                            </Grid>
                          )}
                        </Grid>
                      )}
                    </InlineArrayInput>
                    {!!isShowDamagedImagesInput(
                      scopedFormData?.si_stock_mapping
                    ) && (
                      <div>
                        <AroggaMovableImageInput
                          source={"attachedFiles_qci_damage_picture"}
                          //   record={scopedFormData}
                          label="Damaged Images *"
                        />
                      </div>
                    )}
                  </div>
                );
              }}
            </InlineArrayInput>
          )}
          {(!beforeInBag || !!data?.s_is_outside_dhaka) &&
            (!!totalLostCount || !!totalDamagedCount) && (
              <div>
                <SelectInput
                  source="qc_damage_responsible"
                  label="Responsible"
                  variant="outlined"
                  helperText={false}
                  choices={[
                    ...(["rescheduled"].includes(data?.s_status)
                      ? []
                      : [
                          {
                            id: "customer",
                            name: "Customer",
                          },
                        ]),
                    {
                      id: "delivery_man",
                      name: "Delivery Man",
                    },
                    { id: "company", name: "Company" },
                  ]}
                />
              </div>
            )}
        </DialogContent>
      )}
      <AroggaDialogActions
        isLoading={isQCLoading}
        onDialogClose={onDialogClose}
        onConfirm={onConfirm}
        disabled={
          isShipmentLoading ||
          (!beforeInBag &&
            (!!totalLostCount || !!totalDamagedCount) &&
            !values.qc_damage_responsible) ||
          hasValidationErrors
        }
      />
    </Dialog>
  );
};

export default QCDialog;
