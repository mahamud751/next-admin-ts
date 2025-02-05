import { Box } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { FC, useState } from "react";
import {
  ArrayField,
  BooleanField,
  Button,
  Datagrid,
  FunctionField,
  Labeled,
  Link,
  Pagination,
  RaRecord as Record,
  ReferenceField,
  ReferenceManyField,
  Show,
  ShowProps,
  SimpleForm,
  Tab,
  TabbedShowLayout,
  TextField,
  useNotify,
  usePermissions,
  useShowController,
} from "react-admin";

import { useClipboard, useDocumentTitle } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getQuantityLabel,
  getReadableSKU,
} from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ChangeBatchDialog from "./ChangeBatchDialog";
import Timeline from "./Timeline";
import AroggaDateField from "@/components/common/AroggaDateField";
import Tracking from "@/components/common/Tracking";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const ShipmentShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Shipment Show");
  const { permissions } = usePermissions();
  const classes = useAroggaStyles();
  const notify = useNotify();
  const clipboard = useClipboard();
  const { record } = useShowController(rest);

  const copyToClipboard = (orderId) => {
    if (!orderId) return;

    clipboard.copy(orderId);
    notify(`Copied to clipboard Order ID#${orderId}!`, { type: "success" });
  };

  return (
    <Show {...rest}>
      <TabbedShowLayout>
        <Tab label="Shipment">
          <ColumnShowLayout md={2} simpleShowLayout={false}>
            <FunctionField
              label="ID"
              render={({ s_order_id, s_sequence }: Record) => (
                <>
                  {s_order_id}
                  {s_sequence}
                </>
              )}
            />
            <FunctionField
              label="Order ID"
              onClick={(e) => e.stopPropagation()}
              sortBy="s_order_id"
              render={({ s_order_id }: Record) => (
                <Box display="flex" gap={5}>
                  <Link to={`/v1/productOrder/${s_order_id}`}>
                    {s_order_id}
                  </Link>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => copyToClipboard(s_order_id)}
                  >
                    <FileCopyOutlinedIcon fontSize="small" />
                  </div>
                </Box>
              )}
            />
            <FunctionField
              label="Status"
              render={({ s_status }: Record) =>
                capitalizeFirstLetterOfEachWord(s_status)
              }
            />
            <TextField
              source="s_qc_status"
              label="QC Status"
              className={classes.capitalize}
            />
            <TextField
              source="s_type"
              label="Type"
              className={classes.capitalize}
            />
            <FunctionField
              label="Issue Type"
              onClick={(e) => e.stopPropagation()}
              className={classes.capitalize}
              render={({ i_type, s_issue_id }: Record) => {
                if (!s_issue_id) return;

                return (
                  <Link to={`/v1/issue/${s_issue_id}/show`}>{i_type}</Link>
                );
              }}
            />
            <TextField source="s_item_count" label="Item Count" />
            <ReferenceField
              source="s_zone_id"
              label="Zone"
              reference="v1/zone"
              link="true"
            >
              <TextField source="z_name" />
            </ReferenceField>
            <TextField source="s_courier" label="Courier" />
            <TextField source="s_tracking_id" label="Tracking ID" />
            <FunctionField
              label="Cold"
              render={(record: Record) => {
                if (!record.s_m_cold) return;
                return <AcUnitIcon />;
              }}
            />
            <BooleanField source="s_is_b2b" label="B2B?" looseValue />
            <TextField source="s_reschedule_count" label="Reschedule Count" />
            <BooleanField
              source="s_is_outside_dhaka"
              label="Outside Dhaka?"
              looseValue
            />
            <TextField source="s_refund_qty" label="Refund Qty" />
            <TextField source="s_damage_qty" label="Damage Qty" />
            <TextField source="s_packed_wrong" label="Packed Wrong" />
            <TextField source="s_packed_wrong_note" label="Packed Wrong Note" />
            <TextField source="s_internal_notes" label="Internal Note" />
            <TextField source="s_address" label="Address" />
            <TextField
              source="s_delivery_option"
              label="Delivery Option"
              className={classes.capitalize}
            />
            <ReferenceField
              source="s_shift_schedule_id"
              label="Shift Schedule"
              reference="v1/shiftSchedule"
              link="show"
            >
              <FunctionField
                render={({ s_title, ss_date }: Record) =>
                  `${s_title} (${ss_date})`
                }
              />
            </ReferenceField>
            <AroggaDateField
              source="s_wrong_checked_at"
              label="Wrong Checked At"
            />
            <ReferenceField
              source="s_wrong_checked_by"
              label="Wrong Checked By"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
            <ReferenceField
              source="s_scheduled_by"
              label="Scheduled By"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
            <ReferenceField
              source="s_re_scheduled_shift_schedule_id"
              label="Re Scheduled Shift Schedule"
              reference="v1/shiftSchedule"
              link="show"
            >
              <FunctionField
                render={({ s_title, ss_date }: Record) =>
                  `${s_title} (${ss_date})`
                }
              />
            </ReferenceField>
            <TextField
              source="s_re_scheduled_reason"
              label="Re Scheduled Reason"
            />
            <TextField
              source="s_re_schedule_approval_status"
              label="Re Schedule Approval Status"
              className={classes.capitalize}
            />
            <ReferenceField
              source="s_deposited_by"
              label="Deposited By"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
            <TextField
              source="s_cancel_request_reason"
              label="Cancel Request Reason"
            />
            <TextField
              source="s_cancel_requested_approval_status"
              label="Cancel Req Approval Status"
              className={classes.capitalize}
            />
          </ColumnShowLayout>
          <FunctionField
            label="Tracking"
            render={({ tracking }: Record) => <Tracking data={tracking} />}
          />
          <Labeled label="Timeline">
            <Timeline />
          </Labeled>
          <ArrayField source="si" label="Shipment Items">
            <Datagrid
              expand={<ItemsExpand shipmentStatus={record?.s_status} />}
              isRowExpandable={(row) => !!row?.si_stock_mapping?.length}
              //   classes={{ expandedPanel: classes.expandedPanel }}
            >
              <TextField source="si_id" label="ID" />
              <TextField source="si_product_id" label="Product ID" />
              <TextField source="si_variant_id" label="Variant ID" />
              <FunctionField
                label="Product"
                onClick={(e) => e.stopPropagation()}
                render={({ si_product_id, p_name }: Record) => (
                  <Link to={`/v1/product/${si_product_id}`}>{p_name}</Link>
                )}
              />
              <FunctionField
                label="Variant"
                render={({ pv_attribute }: Record) =>
                  getReadableSKU(pv_attribute)
                }
              />
              <TextField
                source="p_form"
                label="Form"
                className={classes.capitalize}
              />
              <TextField source="p_strength" label="Strength" />
              <FunctionField
                label="Cold"
                render={(record: Record) => {
                  if (!record.p_cold) return;
                  return <AcUnitIcon />;
                }}
              />
              <FunctionField
                source="poi_product_qty"
                label="Qty"
                render={({
                  poi_product_qty,
                  si_in_count,
                  si_out_count,
                  p_unit_label,
                  replacement_unit_label,
                  product_base_unit,
                  product_replacement_base_unit,
                  pu_multiplier,
                  replacement_unit_multiplier,
                }: Record) => {
                  const salesUnit =
                    record?.i_type === "replacement" && si_in_count
                      ? replacement_unit_label
                      : p_unit_label;
                  const baseUnit =
                    record?.i_type === "replacement" && si_in_count
                      ? product_replacement_base_unit
                      : product_base_unit;
                  const salesUnitMultiplier =
                    record?.i_type === "replacement" && si_in_count
                      ? replacement_unit_multiplier
                      : pu_multiplier;

                  return (
                    <span className={classes.whitespaceNowrap}>
                      {getQuantityLabel({
                        qty: poi_product_qty || si_in_count || si_out_count,
                        salesUnit,
                        baseUnit,
                        salesUnitMultiplier,
                      })}
                    </span>
                  );
                }}
              />
              <ReferenceField
                source="si_picked_by"
                label="Picked By"
                reference="v1/users"
                link="show"
              >
                <TextField source="u_name" />
              </ReferenceField>
              <TextField source="si_in_count" label="In Count" />
              <TextField source="si_out_count" label="Out Count" />
              <BooleanField source="si_is_picked" label="Picked?" looseValue />
              <BooleanField
                source="si_is_wrong_picked"
                label="Wrong Picked?"
                looseValue
              />
              <BooleanField
                source="si_is_delivery_picked"
                label="Delivery Picked?"
                looseValue
              />
              <BooleanField
                source="si_is_return_picked"
                label="Return Picked?"
                looseValue
              />
            </Datagrid>
          </ArrayField>
        </Tab>
        {permissions?.includes("orderActivityLogView") && (
          <Tab label="History">
            <ReferenceManyField
              reference="v1/orderActivityLog"
              target="_shipment_id"
              pagination={<Pagination />}
              //   addLabel={false}
              sort={{ field: "oal_created_at", order: "DESC" }}
            >
              <Datagrid>
                <ReferenceField
                  source="oal_created_by"
                  label="Name"
                  reference="v1/users"
                  link="show"
                >
                  <TextField source="u_name" />
                </ReferenceField>
                <AroggaDateField source="oal_created_at" label="Date" />
                <FunctionField
                  label="Issue ID"
                  sortBy="oal_issue_id"
                  render={({ oal_issue_id }: Record) => {
                    if (!oal_issue_id) return;

                    return (
                      <Link to={`/v1/issue/${oal_issue_id}/show`}>
                        {oal_issue_id}
                      </Link>
                    );
                  }}
                />
                <TextField source="oal_title" label="Title" />
                <TextField source="oal_description" label="Description" />
              </Datagrid>
            </ReferenceManyField>
          </Tab>
        )}
      </TabbedShowLayout>
    </Show>
  );
};

export default ShipmentShow;

const ItemsExpand = ({ shipmentStatus }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Labeled label="Stock Mapping">
        <ArrayField source="si_stock_mapping">
          <Datagrid>
            <TextField source="sd_id" label="SDID" />
            <TextField source="sd_batch_no" label="Batch No" />
            <TextField source="sd_rack_no" label="Rack No" />
            <TextField source="sd_qty" label="Qty" />
            <TextField source="sd_qty_reserved" label="Reserved Qty" />
            <TextField source="used_in_order" label="Used" />
            <AroggaDateField
              source="sd_expiry_date"
              label="Expiry"
              addLabel={false}
            />
            {shipmentStatus === "picker_assigned" && (
              <FunctionField
                label="Action"
                render={() => (
                  <Button
                    label="Change Batch NO"
                    variant="contained"
                    onClick={() => setIsDialogOpen(true)}
                  />
                )}
              />
            )}
          </Datagrid>
        </ArrayField>
      </Labeled>
      <SimpleForm toolbar={null}>
        <ChangeBatchDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </SimpleForm>
    </>
  );
};
