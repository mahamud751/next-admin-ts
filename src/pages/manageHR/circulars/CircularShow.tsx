import { FC } from "react";
import {
    FileField,
    ReferenceField,
    Show,
    ShowProps,
    SimpleShowLayout,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import ColumnShowLayout from "../../../components/ColumnShowLayout";
import { useDocumentTitle } from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";

const CircularShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Circular Show");

    const classes = useAroggaStyles();

    return (
        <Show {...props}>
            <SimpleShowLayout>
                <ColumnShowLayout simpleShowLayout={false}>
                    <TextField source="c_id" label="ID" />
                    <TextField source="c_title" label="Title" />
                    <TextField
                        source="c_status"
                        label="Status"
                        className={classes.capitalize}
                    />
                    <AroggaDateField
                        source="c_uploaded_at"
                        label="Uploaded Date"
                    />
                    <AroggaDateField
                        source="c_created_at"
                        label="Created Date"
                    />
                    <ReferenceField
                        source="c_created_by"
                        label="Created By"
                        reference="v1/users"
                        link="show"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                    <AroggaDateField
                        source="c_modified_at"
                        label="Modified Date"
                    />
                    <ReferenceField
                        source="c_modified_by"
                        label="Modified By"
                        reference="v1/users"
                        link="show"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                    <FileField
                        source="attachedFiles_c_attachment"
                        label="Document"
                        src="src"
                        title="title"
                        target="_blank"
                        // @ts-ignore
                        onClick={(e) => e.stopPropagation()}
                    />
                </ColumnShowLayout>
            </SimpleShowLayout>
        </Show>
    );
};

export default CircularShow;
