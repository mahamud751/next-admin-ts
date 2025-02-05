import { Editor } from "@tinymce/tinymce-react";
import { FC, useState } from "react";
import {
  Create,
  CreateProps,
  FileField,
  FileInput,
  FormDataConsumer,
  Labeled,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";
import JobStatusInput from "@/components/manageHR/hiring/JobStatusInput";
import { useDocumentTitle } from "@/hooks";
import { FILE_MAX_SIZE, TINY_MCE_EDITOR_INIT } from "@/utils/constants";

const JobCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Job Create");

  const [description, setDescription] = useState("");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <TextInput
          source="j_title"
          label="Title"
          variant="outlined"
          helperText={false}
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
          disabledChoice
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
          defaultValue="Arogga Limited, 6th floor (Lift-5) Plot D/15-1, Road-36, Block-D, Section-10, Mirpur, Dhaka-1216"
          validate={[required()]}
          minRows={2}
          multiline
        />
        <TaxonomiesByVocabularyInput
          fetchKey="employee_type"
          source="j_type"
          label="Type"
          helperText={false}
          defaultValue="full_time"
          validate={[required()]}
        />
        <FormDataConsumer>
          {({ formData }) => {
            formData.j_description = description;

            return (
              <Labeled label="Description" fullWidth>
                <Editor
                  tinymceScriptSrc={
                    process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
                  }
                  init={TINY_MCE_EDITOR_INIT as any}
                  value={description}
                  onEditorChange={(newValue) => setDescription(newValue)}
                />
              </Labeled>
            );
          }}
        </FormDataConsumer>
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
    </Create>
  );
};

export default JobCreate;
