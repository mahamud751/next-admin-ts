import { FC } from "react";
import {
  Create,
  CreateProps,
  FileField,
  FileInput,
  maxLength,
  minLength,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { FILE_MAX_SIZE } from "@/utils/constants";

const CircularCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Circular Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <TextInput
          source="c_title"
          label="Circular Title"
          variant="outlined"
          validate={[
            required(),
            minLength(2, "Title must be at least 2 characters long"),
            maxLength(255, "Title cannot be longer than 255 characters"),
          ]}
          helperText={false}
          multiline
        />
        <FileInput
          source="attachedFiles_c_attachment"
          label="Attach Circular File"
          placeholder="Click to upload or drag and drop. PDF (Max size: 10MB)"
          helperText={false}
          accept={{
            "application/pdf": [".pdf"],
          }}
          maxSize={FILE_MAX_SIZE}
          validate={[required()]}
        >
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};

export default CircularCreate;
