import { FC } from "react";
import {
  AutocompleteInput,
  Create,
  CreateProps,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  maxValue,
  minValue,
  required,
} from "react-admin";

import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import { useDocumentTitle } from "@/hooks";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";

const EmployeeLoanCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Employee Loan Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <ReferenceInput
          source="el_employee_id"
          label="Employee"
          variant="outlined"
          helperText={false}
          reference="v1/employee"
          sort={{ field: "e_id", order: "DESC" }}
          isRequired
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionValue="e_id"
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
          />
        </ReferenceInput>
        <NumberInput
          source="el_amount"
          label="Amount"
          variant="outlined"
          helperText={false}
          validate={[required()]}
        />
        <NumberInput
          source="el_installment"
          label="Installment"
          variant="outlined"
          helperText={false}
          defaultValue={1}
          validate={[required(), minValue(1), maxValue(6)]}
          min={1}
          max={6}
        />
        <TextInput
          source="el_reason"
          label="Reason"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          minRows={2}
          multiline
        />
        <ReferenceInput
          source="el_account_head_id"
          label="Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

export default EmployeeLoanCreate;
