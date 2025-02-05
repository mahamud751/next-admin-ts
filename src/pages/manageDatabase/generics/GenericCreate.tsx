import { FC } from "react";
import { Create, CreateProps, SimpleForm, TextInput } from "react-admin";

import { useDocumentTitle } from "@/hooks";

const GenericCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Generic Create");

  return (
    <Create {...rest} redirect="list">
      <SimpleForm>
        <TextInput
          source="g_name"
          label="Generic"
          variant="outlined"
          helperText={false}
        />
      </SimpleForm>
    </Create>
  );
};

export default GenericCreate;
