import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  Link,
  List,
  ListProps,
  ReferenceField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import EmployeeBankInfoFilter from "./EmployeeBankInfoFilter";

const EmployeeBankList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Employee Bank List");

  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList(
    "employeeBankView",
    "employeeBankEdit"
  );

  return (
    <List
      {...rest}
      title="List of Employee Bank"
      perPage={25}
      filters={<EmployeeBankInfoFilter children={""} />}
      sort={{ field: "eb_id", order: "ASC" }}
      exporter={exporter}
    >
      <Datagrid rowClick={navigateFromList} bulkActionButtons={false}>
        <TextField source="eb_emp_id" label="Employee ID" />
        <TextField source="eb_bank_id" label="Bank ID" />
        <ReferenceField
          source="eb_emp_id"
          label="Employee Name"
          reference="v1/employee"
          link="show"
          sortBy="eb_emp_id"
        >
          <TextField source="e_name" />
        </ReferenceField>
        <ReferenceField
          source="eb_bank_id"
          label="Bank"
          reference="v1/bank"
          link="show"
        >
          <FunctionField
            label="Name"
            // @ts-ignore
            onClick={(e: MouseEvent) => e.stopPropagation()}
            render={(record) => {
              return (
                <Link
                  to={{
                    pathname: "/v1/bank",
                    search: `filter=${JSON.stringify({
                      b_id: record.b_id,
                    })}`,
                  }}
                >
                  {record.b_name}
                </Link>
              );
            }}
          />
        </ReferenceField>
        <ReferenceField
          source="eb_bank_id"
          label="Branch"
          reference="v1/bank"
          link="show"
        >
          <FunctionField
            label="Branch"
            // @ts-ignore
            onClick={(e: MouseEvent) => e.stopPropagation()}
            render={(record) => {
              return (
                <Link
                  to={{
                    pathname: "/v1/bank",
                    search: `filter=${JSON.stringify({
                      b_id: record.b_id,
                    })}`,
                  }}
                >
                  {record.b_branch}
                </Link>
              );
            }}
          />
        </ReferenceField>
        <TextField source="eb_account_title" label="Account Name" />
        <TextField source="eb_payment_type" label="Payment Type" />
        <FunctionField
          label="Account No"
          render={(record) => {
            if (record.eb_payment_type === "card") {
              return record.eb_card_no;
            } else {
              return record.eb_account_no;
            }
          }}
        />
        <TextField source="eb_client_id" label="Client ID" />
        <TextField source="eb_status" label="Status" />
      </Datagrid>
    </List>
  );
};

export default EmployeeBankList;
