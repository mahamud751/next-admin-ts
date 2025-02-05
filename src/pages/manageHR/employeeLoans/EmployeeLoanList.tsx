import { FC } from "react";
import {
  List,
  ListProps,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

import AroggaDateField from "@/components/common/AroggaDateField";
import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import EmployeeLoanFilter from "./EmployeeLoanFilter";

const EmployeeLoanList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Employee Loan List");

  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList(
    "employeeLoanView",
    "employeeLoanEdit"
  );

  return (
    <List
      {...rest}
      title="List of Loan"
      perPage={25}
      filters={<EmployeeLoanFilter children={""} />}
      sort={{ field: "el_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={["el_created_at", "el_created_by"]}
        bulkActionButtons={false}
      >
        <TextField source="el_id" label="ID" />
        <ReferenceField
          source="el_employee_id"
          label="Employee"
          reference="v1/employee"
          link="show"
          sortBy="el_employee_id"
        >
          <TextField source="e_name" />
        </ReferenceField>
        <NumberField source="el_amount" label="Amount" />
        <NumberField source="el_due" label="Due" />
        <TextField source="el_installment" label="Installment" />
        <TextField source="el_reason" label="Reason" />
        <TextField source="el_adjustment_type" label="Adjustment Type" />
        <AroggaDateField source="el_created_at" label="Created At" />
        <ReferenceField
          source="el_created_by"
          label="Created By"
          reference="v1/users"
          link="show"
          sortBy="el_created_by"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default EmployeeLoanList;
