import { FC } from "react";
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  minLength,
  required,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

const BankCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Bank Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <TextInput
          source="b_name"
          label="Name"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(5, "Name must be at least 5 characters long"),
          ]}
        />
        <TextInput
          source="b_branch"
          label="Branch"
          variant="outlined"
          helperText={false}
          validate={[required()]}
        />
        <TextInput
          source="b_routing_number"
          label="Routing Number"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(5, "Routing number must be at least 5 characters long"),
          ]}
        />
        <TextInput
          source="b_short_code"
          label="Short Code"
          variant="outlined"
          helperText={false}
        />
        <FormatedBooleanInput source="b_active" label="Active" />
      </SimpleForm>
    </Create>
  );
};

export default BankCreate;
