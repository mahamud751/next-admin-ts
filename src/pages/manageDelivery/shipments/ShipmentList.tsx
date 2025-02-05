import AcUnitIcon from "@mui/icons-material/AcUnit";
import { FC } from "react";
import {
  BooleanField,
  Datagrid,
  FunctionField,
  Link,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ShipmentFilter from "./ShipmentFilter";
import Tracking from "@/components/common/Tracking";

const ShipmentList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Shipment List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();

  return (
    <List
      {...rest}
      title="List of Shipment"
      filters={<ShipmentFilter children={""} />}
      perPage={25}
      sort={{ field: "s_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid
        rowClick={permissions?.includes("shipmentView") ? "show" : null}
        bulkActionButtons={permissions?.includes("shipmentDelete")}
      >
        <FunctionField
          label="ID"
          sortBy="s_id"
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
            <Link to={`/v1/productOrder/${s_order_id}`}>{s_order_id}</Link>
          )}
        />
        <FunctionField
          label="Status"
          render={({ s_status }: Record) =>
            capitalizeFirstLetterOfEachWord(s_status)
          }
        />
        <TextField
          source="s_type"
          label="Type"
          className={classes.capitalize}
        />
        <ReferenceField
          source="s_zone_id"
          label="Zone"
          reference="v1/zone"
          link="true"
        >
          <TextField source="z_name" />
        </ReferenceField>
        <FunctionField
          label="Cold"
          sortBy="s_m_cold"
          render={(record: Record) => {
            if (!record.s_m_cold) return;
            return <AcUnitIcon />;
          }}
        />
        <BooleanField
          source="s_is_b2b"
          label="B2B?"
          FalseIcon={null}
          looseValue
        />
        <BooleanField
          source="s_is_outside_dhaka"
          label="Outside Dhaka?"
          FalseIcon={null}
          looseValue
        />
        <BooleanField
          source="s_is_soft_shipment_cancelled"
          label="Shipment Soft Cancelled?"
          FalseIcon={null}
          looseValue
        />
        <FunctionField
          label="Issue Type"
          onClick={(e) => e.stopPropagation()}
          className={classes.capitalize}
          render={({ i_type, s_issue_id }: Record) => {
            if (!s_issue_id) return;

            return <Link to={`/v1/issue/${s_issue_id}/show`}>{i_type}</Link>;
          }}
        />
        <TextField
          source="s_qc_status"
          label="QC Status"
          className={classes.capitalize}
        />
        <TextField source="s_refund_qty" label="Refund Qty" />
        <TextField source="s_damage_qty" label="Damage Qty" />
        <TextField source="s_item_count" label="Item Count" />
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
            render={({ s_title, ss_date }: Record) => `${s_title} (${ss_date})`}
          />
        </ReferenceField>
        <ReferenceField
          source="s_delivery_man_id"
          label="Delivery Man"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <FunctionField
          label="Tracking"
          render={({ tracking }: Record) => <Tracking data={tracking} />}
        />
      </Datagrid>
    </List>
  );
};

export default ShipmentList;
