import { Editor } from "@tinymce/tinymce-react";
import { FC, useState } from "react";
import {
  Edit,
  EditProps,
  FileField,
  FileInput,
  Labeled,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import { useFormState } from "react-final-form";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";
import JobStatusInput from "@/components/manageHR/hiring/JobStatusInput";
import { useDocumentTitle } from "@/hooks";
import { FILE_MAX_SIZE, TINY_MCE_EDITOR_INIT } from "@/utils/constants";
import { required } from "@/utils/helpers";

const JobEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Job Edit");

  const Description = () => {
    const { values } = useFormState();

    const [description, setDescription] = useState(values.j_description);

    values.j_description = description;

    return (
      <Labeled label="Description" fullWidth>
        <Editor
          tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
          init={TINY_MCE_EDITOR_INIT as any}
          value={description}
          onEditorChange={(newValue) => setDescription(newValue)}
        />
      </Labeled>
    );
  };
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton alwaysEnable />
    </Toolbar>
  );
  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
      submitOnEnter={false}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput
          source="j_id"
          label="ID"
          variant="outlined"
          helperText={false}
          disabled
        />
        <TextInput
          source="j_title"
          label="Title"
          variant="outlined"
          helperText={false}
        />
        <TreeDropdownInput
          reference="/v1/rank"
          filter={{ _page: 1, _perPage: 5000 }}
          source="j_designation"
          label="Designation"
          variant="outlined"
          keyId="r_id"
          keyParent="r_parent"
          keyWeight="r_weight"
          optionTextValue="r_title"
          validate={[required()]}
          disabledChoice
        />
        <TreeDropdownInput
          reference="/v1/taxonomiesByVocabulary/department"
          source="j_department"
          label="Department"
          variant="outlined"
          keyId="t_id"
          keyParent="t_parent_id"
          optionValue="t_machine_name"
          optionTextValue="t_title"
          validate={[required()]}
        />
        <JobStatusInput
          source="j_status"
          variant="outlined"
          helperText={false}
        />
        <TextInput
          source="j_location"
          label="Location"
          variant="outlined"
          helperText={false}
          minRows={2}
          multiline
        />
        <TaxonomiesByVocabularyInput
          fetchKey="employee_type"
          source="j_type"
          label="Type"
        />
        <Description />
        <FileInput
          source="attachedFiles_j_banner"
          label="Files"
          accept={{
            "application/pdf": [".pdf"],
            "image/*": [".jpg", ".jpeg", ".png", ".gif"],
          }}
          maxSize={FILE_MAX_SIZE}
          helperText={false}
          multiple
        >
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  );
};

export default JobEdit;
