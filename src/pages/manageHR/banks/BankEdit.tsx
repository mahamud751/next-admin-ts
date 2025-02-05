import { FC } from "react";
import {
    Edit,
    EditProps,
    NumberInput,
    SimpleForm,
    TextInput,
    minLength,
    required,
} from "react-admin";

import FormatedBooleanInput from "../../../components/FormatedBooleanInput";
import SaveDeleteToolbar from "../../../components/SaveDeleteToolbar";
import { useDocumentTitle } from "../../../hooks";

const BankEdit: FC<EditProps> = (props) => {
    useDocumentTitle("Arogga | Bank Edit");

    return (
        <Edit
            mutationMode={
                process.env.REACT_APP_NODE_ENV === "development"
                    ? "pessimistic"
                    : "optimistic"
            }
            {...props}
        >
            <SimpleForm redirect="list" toolbar={<SaveDeleteToolbar isSave />}>
                <NumberInput
                    source="b_id"
                    label="ID"
                    variant="outlined"
                    helperText={false}
                    disabled
                />
                <TextInput
                    source="b_name"
                    label="Name"
                    variant="outlined"
                    helperText={false}
                    validate={[
                        required(),
                        minLength(5, "Name must be at least 5 characters long"),
                    ]}
                />
                <TextInput
                    source="b_branch"
                    label="Branch"
                    variant="outlined"
                    helperText={false}
                    validate={[required()]}
                />
                <TextInput
                    source="b_routing_number"
                    label="Routing Number"
                    variant="outlined"
                    helperText={false}
                    validate={[
                        required(),
                        minLength(
                            5,
                            "Routing number must be at least 5 characters long"
                        ),
                    ]}
                />
                <TextInput
                    source="b_short_code"
                    label="Short Code"
                    variant="outlined"
                    helperText={false}
                />
                <FormatedBooleanInput source="b_active" label="Active" />
            </SimpleForm>
        </Edit>
    );
};

export default BankEdit;
