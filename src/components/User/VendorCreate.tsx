import {
  Create,
  SimpleForm,
  TextInput,
  required,
  DateInput,
  NumberInput,
  FileInput,
  FileField,
} from "react-admin";

export const VendorCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="pr_name" validate={[required()]} />
      <TextInput source="pr_description" validate={[required()]} />
      <TextInput source="pr_unit" validate={[required()]} />

      <NumberInput source="pr_quantity" label="Short description" />

      <FileInput source="attachedFiles_pr_attachment">
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);
