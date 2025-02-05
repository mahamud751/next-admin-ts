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

import UserEmployeeOptionTextRenderer from "../../../components/UserEmployeeOptionTextRenderer";
import ApplicantStatusInput from "../../../components/manageHR/hiring/ApplicantStatusInput";
import { useDocumentTitle } from "../../../hooks";
import { userEmployeeInputTextRenderer } from "../../../utils/helpers";

const ApplicantCreate: FC<CreateProps> = (props) => {
    useDocumentTitle("Arogga | Applicants Create");

    const [selectedItems, setSelectedItems] = useState<any>({});

    return (
        <Create {...props}>
            <SimpleForm redirect="list">
                <ReferenceInput
                    source="j_id"
                    label="Job List"
                    variant="outlined"
                    helperText={false}
                    reference="v1/job"
                    validate={[required()]}
                    resettable
                >
                    <AutocompleteInput
                        optionValue="j_id"
                        optionText="j_title"
                        resettable
                    />
                </ReferenceInput>
                <ReferenceInput
                    source="a_u_id"
                    label="User"
                    variant="outlined"
                    helperText={false}
                    reference="v1/users"
                    validate={[required()]}
                >
                    <AutocompleteInput
                        matchSuggestion={() => true}
                        optionValue="u_id"
                        optionText={<UserEmployeeOptionTextRenderer />}
                        inputText={userEmployeeInputTextRenderer}
                        onSelect={(item) => setSelectedItems(item)}
                        resettable
                    />
                </ReferenceInput>
                <TextInput
                    source="a_name"
                    label="Name"
                    variant="outlined"
                    helperText={false}
                    initialValue={selectedItems?.u_name}
                    validate={[required()]}
                />
                <TextInput
                    source="a_email"
                    label="Email"
                    variant="outlined"
                    helperText={false}
                    initialValue={selectedItems?.u_email}
                    validate={[required(), email("Invalid email address")]}
                />
                <TextInput
                    source="a_phone"
                    label="Phone No"
                    variant="outlined"
                    helperText={false}
                    initialValue={selectedItems?.u_mobile}
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
                    accept="application/pdf"
                    multiple
                >
                    <FileField source="src" title="title" />
                </FileInput>
            </SimpleForm>
        </Create>
    );
};

export default ApplicantCreate;
