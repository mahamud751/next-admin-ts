import { FC } from "react";
import {
    AutocompleteInput,
    Edit,
    EditProps,
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

const ApplicantEdit: FC<EditProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Applicants Edit");

    return (
        <Edit
            mutationMode={
                process.env.REACT_APP_NODE_ENV === "development"
                    ? "pessimistic"
                    : "optimistic"
            }
            {...rest}
        >
            <SimpleForm submitOnEnter={false}>
                <TextInput
                    source="a_id"
                    label="ID"
                    variant="outlined"
                    helperText={false}
                    disabled
                />
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
                        resettable
                    />
                </ReferenceInput>
                <TextInput
                    source="a_name"
                    label="Name"
                    variant="outlined"
                    helperText={false}
                    validate={[required()]}
                />
                <TextInput
                    source="a_email"
                    label="Email"
                    variant="outlined"
                    helperText={false}
                    validate={[required(), email("Invalid email address")]}
                />
                <TextInput
                    source="a_phone"
                    label="Phone No"
                    variant="outlined"
                    helperText={false}
                    disabled
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
        </Edit>
    );
};

export default ApplicantEdit;
