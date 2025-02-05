import { FC } from "react";
import {
    Edit,
    EditProps,
    NumberInput,
    SimpleForm,
    TextInput,
    maxLength,
    minLength,
    required,
} from "react-admin";

import FormatedBooleanInput from "../../../components/FormatedBooleanInput";
import SaveDeleteToolbar from "../../../components/SaveDeleteToolbar";
import { useDocumentTitle } from "../../../hooks";

const MenuEdit: FC<EditProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Menu Edit");

    return (
        <Edit
            mutationMode={
                process.env.REACT_APP_NODE_ENV === "development"
                    ? "pessimistic"
                    : "optimistic"
            }
            {...rest}
        >
            <SimpleForm
                redirect="list"
                toolbar={
                    <SaveDeleteToolbar
                        isSave
                        isDelete={permissions?.includes("menuDelete")}
                    />
                }
            >
                <NumberInput
                    source="m_id"
                    label="ID"
                    variant="outlined"
                    helperText={false}
                    disabled
                />
                <TextInput
                    source="m_name"
                    label="Name"
                    variant="outlined"
                    helperText={false}
                    validate={[
                        required(),
                        minLength(2, "Name must be at least 2 characters long"),
                        maxLength(
                            255,
                            "Name cannot be longer than 255 characters"
                        ),
                    ]}
                />
                <TextInput
                    source="m_description"
                    label="Description"
                    variant="outlined"
                    helperText={false}
                    validate={[
                        maxLength(
                            500,
                            "Description cannot be longer than 500 characters"
                        ),
                    ]}
                    multiline
                />
                <FormatedBooleanInput source="m_status" label="Active?" />
            </SimpleForm>
        </Edit>
    );
};

export default MenuEdit;
