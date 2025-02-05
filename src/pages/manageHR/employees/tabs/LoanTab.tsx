import AroggaDateField from "@/components/common/AroggaDateField";
import {
  Datagrid,
  NumberField,
  Pagination,
  ReferenceManyField,
  TextField,
} from "react-admin";

const LoanTab = () => (
  <ReferenceManyField
    reference="v1/employeeLoan"
    target="_employee_id"
    pagination={<Pagination />}
    sort={{ field: "el_id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="el_id" label="ID" />
      <NumberField source="el_amount" label="Amount" />
      <NumberField source="el_due" label="Due" />
      <TextField source="el_installment" label="Installment" />
      <TextField source="el_reason" label="Reason" />
      <TextField source="el_adjustment_type" label="Adjustment Type" />
      <AroggaDateField source="el_created_at" label="Created At" />
    </Datagrid>
  </ReferenceManyField>
);

export default LoanTab;
