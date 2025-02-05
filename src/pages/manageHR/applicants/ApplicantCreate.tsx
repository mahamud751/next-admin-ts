import { FC, useState } from "react";
import {
  AutocompleteInput,
  Create,
  CreateProps,
  FileField,
  FileInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  email,
  maxLength,
  required,
} from "react-admin";

import ApplicantStatusInput from "@/components/manageHR/hiring/ApplicantStatusInput";
import { useDocumentTitle } from "@/hooks";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const ApplicantCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Applicants Create");

  const [selectedItems, setSelectedItems] = useState<any>({});

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <ReferenceInput
          source="j_id"
          label="Job List"
          variant="outlined"
          helperText={false}
          reference="v1/job"
          isRequired
          resettable
        >
          <AutocompleteInput optionValue="j_id" optionText="j_title" />
        </ReferenceInput>
        <ReferenceInput
          source="a_u_id"
          label="User"
          variant="outlined"
          helperText={false}
          reference="v1/users"
          isRequired
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionValue="u_id"
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
            onSelect={(item) => setSelectedItems(item)}
          />
        </ReferenceInput>
        <TextInput
          source="a_name"
          label="Name"
          variant="outlined"
          helperText={false}
          defaultValue={selectedItems?.u_name}
          validate={[required()]}
        />
        <TextInput
          source="a_email"
          label="Email"
          variant="outlined"
          helperText={false}
          defaultValue={selectedItems?.u_email}
          validate={[required(), email("Invalid email address")]}
        />
        <TextInput
          source="a_phone"
          label="Phone No"
          variant="outlined"
          helperText={false}
          defaultValue={selectedItems?.u_mobile}
          disabled={!!selectedItems?.u_mobile}
          validate={[required()]}
        />
        <TextInput
          source="a_cover_letter"
          label="Cover Letter"
          variant="outlined"
          helperText={false}
          validate={[maxLength(1000)]}
          minRows={2}
          multiline
        />
        <ApplicantStatusInput
          source="a_status"
          variant="outlined"
          helperText={false}
        />
        <TextInput
          source="a_note"
          label="Internal Notes"
          variant="outlined"
          helperText={false}
        />
        <FileInput
          source="attachedFiles"
          label="Upload CV"
          helperText={false}
          accept={{
            "application/pdf": [".pdf"],
          }}
          multiple
        >
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};

export default ApplicantCreate;
