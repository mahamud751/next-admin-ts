import {
  Datagrid,
  FunctionField,
  Link,
  RaRecord as Record,
  ReferenceField,
  TextField,
  useListContext,
} from "react-admin";

import { useAroggaStyles } from "@/utils/useAroggaStyles";

import DurationField from "./DurationField";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Tracking from "@/components/common/Tracking";

const ShipmentDetailsDatagrid = ({
  isChecked = false,
  page = 0,
  perPage = 0,
}) => {
  const classes = useAroggaStyles();
  const { data, isLoading } = useListContext();

  const renderIndex = (record) => {
    if (isLoading) return null;
    // Find the index of the current record in the current page
    const currentIndex = data.findIndex((item) => item.id === record.id);
    // Calculate the global index using the current page and perPage
    const globalIndex = (page - 1) * perPage + currentIndex + 1;
    return globalIndex;
  };

  return (
    // <Datagrid hasBulkActions={isChecked}>
    <Datagrid>
      <FunctionField label="Serial No" render={renderIndex} />
      <FunctionField
        label="Shipment ID"
        onClick={(e) => e.stopPropagation()}
        sortBy="s_id"
        render={({ s_id, s_order_id, s_sequence }: Record) => (
          <Link to={`/v1/shipment/${s_id}/show`}>
            {s_order_id}
            {s_sequence}
          </Link>
        )}
      />
      <FunctionField
        label="Order ID"
        onClick={(e) => e.stopPropagation()}
        sortBy="s_order_id"
        render={({ s_order_id }: Record) => (
          <Link to={`/v1/productOrder/${s_order_id}/show`}>{s_order_id}</Link>
        )}
      />
      <TextField source="s_item_count" label="Item Count" />
      <DurationField />
      <TextField
        source="s_status"
        label="Shipment Status"
        className={classes.capitalize}
      />
      <FunctionField
        label="Shipment Type"
        sortBy="s_type"
        render={(record: Record) => (
          <span
            className={`${classes.capitalize} ${
              record.s_type === "issue" && classes.textRed
            }`}
          >
            {record?.s_type}
          </span>
        )}
      />
      <ReferenceField
        source="s_issue_id"
        label="Issue Status"
        reference="v1/issue"
        className={classes.capitalize}
        link="show"
      >
        <TextField source="i_status" />
      </ReferenceField>
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
      <FunctionField
        label="Cold"
        sortBy="s_m_cold"
        render={(record: Record) => {
          if (!record.s_m_cold) return;
          return <AcUnitIcon />;
        }}
      />
      <TextField source="s_address" label="Address" />
      <TextField source="s_internal_notes" label="Internal Note" />
      <FunctionField
        label="Tracking"
        render={({ tracking }: Record) => <Tracking data={tracking} />}
      />
    </Datagrid>
  );
};

export default ShipmentDetailsDatagrid;
