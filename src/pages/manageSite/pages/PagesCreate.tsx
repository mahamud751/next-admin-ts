import { Editor } from "@tinymce/tinymce-react";
import { FC, useState } from "react";
import {
  Create,
  CreateProps,
  FormDataConsumer,
  Labeled,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { TINY_MCE_EDITOR_INIT } from "@/utils/constants";

const PagesCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Page Create");

  const [content, setContent] = useState("");

  const transform = (data) => ({
    ...data,
    p_content: content,
  });
  return (
    <Create {...props} transform={transform} redirect="list">
      <SimpleForm>
        <TextInput
          source="p_title"
          label="Title"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          multiline
        />
        <TextInput
          source="p_slug"
          label="Slug"
          variant="outlined"
          helperText={false}
          multiline
        />
        <FormDataConsumer>
          {({ formData }) => {
            formData.p_content = content;
            return (
              <Labeled label="Content" fullWidth>
                <Editor
                  tinymceScriptSrc={
                    "https://cdn.tiny.cloud/1/9i9siri6weyxjml0qbccbm35m7o5r42axcf3lv0mbr0k3pkl/tinymce/7/tinymce.min.js"
                  }
                  init={TINY_MCE_EDITOR_INIT as any}
                  value={content}
                  onEditorChange={(newValue) => setContent(newValue)}
                />
              </Labeled>
            );
          }}
        </FormDataConsumer>
        <SelectInput
          source="p_status"
          label="Status"
          variant="outlined"
          helperText={false}
          defaultValue="pending"
          choices={[
            { id: "pending", name: "Pending" },
            { id: "published", name: "Published" },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};

export default PagesCreate;
