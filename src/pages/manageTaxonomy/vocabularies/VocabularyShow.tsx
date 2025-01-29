import { FC } from "react";
import { ReferenceField, Show, ShowProps, TextField } from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import ColumnShowLayout from "../../../components/ColumnShowLayout";
import { useDocumentTitle } from "../../../hooks";

const VocabularyShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Vocabulary Show");

    return (
        <Show {...props}>
            <ColumnShowLayout>
                <TextField source="v_id" label="ID" />
                <TextField source="v_title" label="Title" />
                <TextField source="v_description" label="Description" />
                <TextField source="v_machine_name" label="Machine Name" />
                <AroggaDateField source="v_created_at" label="Created At" />
                <ReferenceField
                    source="v_created_by"
                    label="Created By"
                    reference="v1/users"
                    sortBy="v_created_by"
                >
                    <TextField source="u_name" />
                </ReferenceField>
                <AroggaDateField source="v_modified_at" label="Modified At" />
                <ReferenceField
                    source="v_modified_by"
                    label="Modified By"
                    reference="v1/users"
                    sortBy="v_modified_by"
                >
                    <TextField source="u_name" />
                </ReferenceField>
            </ColumnShowLayout>
        </Show>
    );
};

export default VocabularyShow;
