import { FC } from "react";
import {
    DateInput,
    Edit,
    EditProps,
    SimpleForm,
    TextInput,
    minLength,
    required,
} from "react-admin";

import SaveDeleteToolbar from "../../../components/SaveDeleteToolbar";
import TaxonomiesByVocabularyInput from "../../../components/TaxonomiesByVocabularyInput";
import { useDocumentTitle } from "../../../hooks";

const HolidayEdit: FC<EditProps> = (props) => {
    useDocumentTitle("Arogga | Holiday Edit");

    return (
        <Edit
            mutationMode={
                process.env.REACT_APP_NODE_ENV === "development"
                    ? "pessimistic"
                    : "optimistic"
            }
            {...props}
        >
            <SimpleForm toolbar={<SaveDeleteToolbar isSave />} redirect="list">
                <TextInput
                    source="h_id"
                    label="ID"
                    variant="outlined"
                    helperText={false}
                    disabled
                />
                <TaxonomiesByVocabularyInput
                    fetchKey="holiday_type"
                    source="h_type"
                    label="Type"
                    validate={[required()]}
                />
                <DateInput
                    source="h_date"
                    label="Date"
                    variant="outlined"
                    helperText={false}
                />
                <TextInput
                    source="h_title"
                    label="Title"
                    variant="outlined"
                    helperText={false}
                    validate={[
                        required(),
                        minLength(
                            5,
                            "Title must be at least 5 characters long"
                        ),
                    ]}
                />
            </SimpleForm>
        </Edit>
    );
};

export default HolidayEdit;
