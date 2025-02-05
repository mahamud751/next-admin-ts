import {
  Datagrid,
  FunctionField,
  Link,
  NumberField,
  Pagination,
  RaRecord as Record,
  ReferenceManyField,
  TextField,
} from "react-admin";

import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";
import DurationField from "@/components/manageDelivery/bags/DurationField";

const Orders = () => {
  const classes = useAroggaStyles();

  return (
    <ReferenceManyField
      label="Orders"
      reference="v1/productOrder"
      target="_po_user_id"
      pagination={<Pagination />}
      sort={{ field: "po_id", order: "DESC" }}
    >
      <Datagrid>
        <FunctionField
          label="ID"
          sortBy="po_id"
          render={(record: Record) => (
            <Link to={`/v1/productOrder/${record.po_id}`}>{record.po_id}</Link>
          )}
        />
        <AroggaDateField source="po_created_at" label="Created At" />
        <DurationField />
        <NumberField source="po_payable_total" label="Payable Total" />
        <FunctionField
          label="Status"
          sortBy="po_status"
          render={(record: Record) => (
            <span
              className={`${classes.capitalize} ${
                record.po_status === "cancelled" && classes.textRed
              }`}
            >
              {record?.po_status}
            </span>
          )}
        />
        <TextField source="po_address" label="Address" />
      </Datagrid>
    </ReferenceManyField>
  );
};

export default Orders;
