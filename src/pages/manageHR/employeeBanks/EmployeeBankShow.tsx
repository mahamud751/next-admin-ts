import { FC } from "react";
import {
  FunctionField,
  ReferenceField,
  Show,
  ShowProps,
  TextField,
} from "react-admin";

import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import { useDocumentTitle } from "@/hooks";

const EmployeeBankShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Employee Bank Show");

  return (
    <Show {...rest}>
      <ColumnShowLayout>
        <TextField source="eb_id" label="ID" />
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
          <TextField source="b_name" />
        </ReferenceField>
        <ReferenceField
          source="eb_bank_id"
          label="Branch"
          reference="v1/bank"
          link="show"
        >
          <TextField source="b_branch" />
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
      </ColumnShowLayout>
    </Show>
  );
};

export default EmployeeBankShow;
