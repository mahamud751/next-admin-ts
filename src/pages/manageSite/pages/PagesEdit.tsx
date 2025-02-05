import { Editor } from "@tinymce/tinymce-react";
import { FC, useEffect, useState } from "react";
import {
  Edit,
  EditProps,
  Labeled,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import { useWatch, useFormContext } from "react-hook-form";

import { useDocumentTitle } from "@/hooks";
import { TINY_MCE_EDITOR_INIT } from "@/utils/constants";

const PagesEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Page Edit");

  const Content = () => {
    const values = useWatch();
    const { setValue } = useFormContext();
    const [content, setContent] = useState(values?.p_content);

    values.p_content = content;

    useEffect(() => {
      setValue("p_content", content);
    }, [content, setValue]);

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
  };
  const EditToolbar = () => (
    <Toolbar>
      <SaveButton alwaysEnable />
    </Toolbar>
  );
  return (
    <Edit
      mutationMode={
        process.env.NEXT_PUBLIC_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
      submitOnEnter={false}
    >
      <SimpleForm toolbar={<EditToolbar />}>
        <TextInput
          source="p_id"
          label="ID"
          variant="outlined"
          helperText={false}
          readOnly
        />
        <TextInput
          source="p_title"
          label="Title"
          variant="outlined"
          helperText={false}
          multiline
        />
        <TextInput
          source="p_slug"
          label="Slug"
          variant="outlined"
          helperText={false}
          readOnly={!permissions?.includes("superAdmin")}
          multiline
        />
        <Content />
        <SelectInput
          source="p_status"
          label="Status"
          variant="outlined"
          helperText={false}
          choices={[
            { id: "pending", name: "Pending" },
            { id: "published", name: "Published" },
          ]}
        />
      </SimpleForm>
    </Edit>
  );
};

export default PagesEdit;
