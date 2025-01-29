import { FC } from "react";
import {
    Create,
    CreateProps,
    SimpleForm,
    TextInput,
    minLength,
    required,
} from "react-admin";

import { useDocumentTitle } from "../../../hooks";

const VocabularyCreate: FC<CreateProps> = (props) => {
    useDocumentTitle("Arogga | Vocabulary Create");

    return (
        <Create {...props}>
            <SimpleForm redirect="list">
                <TextInput
                    source="v_title"
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
                    multiline
                />
                <TextInput
                    source="v_description"
                    label="Description"
                    variant="outlined"
                    helperText={false}
                    minRows={2}
                    multiline
                />
            </SimpleForm>
        </Create>
    );
};

export default VocabularyCreate;
