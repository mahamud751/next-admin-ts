import { FC } from "react";
import {
    Edit,
    EditProps,
    FileField,
    FileInput,
    maxLength,
    minLength,
    required,
    SimpleForm,
    TextInput,
} from "react-admin";

import { useDocumentTitle } from "../../../hooks";
import { FILE_MAX_SIZE } from "../../../utils/constants";

const CircularEdit: FC<EditProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Circular Edit");

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
                    source="c_id"
                    label="ID"
                    variant="outlined"
                    helperText={false}
                    disabled
                />
                <TextInput
                    source="c_title"
                    label="Circular Title"
                    variant="outlined"
                    validate={[
                        required(),
                        minLength(
                            2,
                            "Title must be at least 2 characters long"
                        ),
                        maxLength(
                            255,
                            "Title cannot be longer than 255 characters"
                        ),
                    ]}
                    helperText={false}
                    multiline
                />
                <FileInput
                    source="attachedFiles_c_attachment"
                    label="Attach Circular File"
                    placeholder="Click to upload or drag and drop. PDF (Max size: 10MB)"
                    helperText={false}
                    accept="application/pdf"
                    maxSize={FILE_MAX_SIZE}
                    validate={[required()]}
                >
                    <FileField source="src" title="title" />
                </FileInput>
            </SimpleForm>
        </Edit>
    );
};

export default CircularEdit;
