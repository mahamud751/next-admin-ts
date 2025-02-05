import { FC } from "react";
import {
    Create,
    CreateProps,
    SimpleForm,
    TextInput,
    maxLength,
    minLength,
    required,
} from "react-admin";

import FormatedBooleanInput from "../../../components/FormatedBooleanInput";
import { useDocumentTitle } from "../../../hooks";

const MenuCreate: FC<CreateProps> = (props) => {
    useDocumentTitle("Arogga | Menu Create");

    return (
        <Create {...props}>
            <SimpleForm redirect="list">
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
        </Create>
    );
};

export default MenuCreate;
