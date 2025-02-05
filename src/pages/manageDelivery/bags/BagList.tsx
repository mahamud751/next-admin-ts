import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import { FC } from "react";
import {
  BooleanField,
  EditButton,
  FileField,
  FunctionField,
  Link,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  ShowButton,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import BagFilter from "./BagFilter";
import AroggaDateField from "@/components/common/AroggaDateField";
import Tracking from "@/components/common/Tracking";

const BagList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Bag List");
  const exporter = useExport(rest);
  const { permissions } = usePermissions();
  const classes = useAroggaStyles();

  return (
    <List
      {...rest}
      title="List of Bag"
      filters={<BagFilter children={""} />}
      perPage={25}
      sort={{ field: "sb_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        hideableColumns={["sb_created_at", "sb_created_by"]}
        bulkActionButtons={permissions?.includes("shipmentBagDelete")}
      >
        <TextField source="sb_id" label="ID" />
        <ReferenceField
          source="sb_zone_id"
          label="Zone"
          reference="v1/zone"
          link="show"
        >
          <TextField source="z_name" />
        </ReferenceField>
        <TextField
          source="sb_status"
          label="Status"
          className={classes.capitalize}
        />
        <TextField
          source="sb_shift_type"
          label="Shift Type"
          className={classes.capitalize}
        />
        <ReferenceField
          source="sb_shift_schedule_id"
          label="Shift Schedule"
          reference="v1/shiftSchedule"
          className={classes.whitespaceNowrap}
          link="show"
        >
          <FunctionField
            render={({ s_title, ss_date }: Record) => `${s_title} (${ss_date})`}
          />
        </ReferenceField>
        <TextField source="sb_total_shipments" label="Total Shipment" />
        <TextField
          source="sb_shipment_cancel_count"
          label="Shipment Cancel Count"
        />
        <TextField
          source="sb_shipment_reschedule_count"
          label="Shipment Reschedule Count"
        />
        <FunctionField
          label="Assign"
          render={(record: Record) => {
            if (!record?.sb_deliveryman_name && !record?.sb_total_shipments)
              return;

            if (record?.sb_deliveryman_name) {
              return (
                <Link to={`users/${record?.sb_deliveryman_id}/show`}>
                  {record?.sb_deliveryman_name}
                </Link>
              );
            }

            return (
              <EditButton
                record={record}
                label="Assign"
                icon={<DirectionsBikeIcon />}
              />
            );
          }}
        />
        <BooleanField
          source="sb_received"
          label="Received?"
          FalseIcon={null}
          looseValue
        />
        <AroggaDateField source="sb_received_at" label="Received At" />
        <FunctionField
          label="Tracking"
          render={({ tracking }: Record) => <Tracking data={tracking} />}
        />
        <FunctionField
          label="Action"
          render={(record: Record) => {
            if (!record?.sb_total_shipments) return null;

            return (
              <>
                {permissions?.includes("shipmentBagView") && (
                  <ShowButton label="View" record={record} />
                )}
                {permissions?.includes("shipmentBagEdit") && (
                  <EditButton label="Edit" record={record} />
                )}
                {/* TODO: */}
                <FileField
                  source="invoiceUrl"
                  label="Invoice"
                  title="Invoice"
                  // @ts-ignore
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: 10 }}
                />
              </>
            );
          }}
        />
        <AroggaDateField source="sb_created_at" label="Created At" />
        <ReferenceField
          source="sb_created_by"
          label="Created By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default BagList;
