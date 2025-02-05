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
import CustomChipField from "../../../components/CustomChipField";
import { useDocumentTitle } from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";

const PolicyShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Policy Show");

    const classes = useAroggaStyles();

    return (
        <Show {...props}>
            <SimpleShowLayout>
                <ColumnShowLayout simpleShowLayout={false}>
                    <TextField source="p_id" label="ID" />
                    <TextField source="p_title" label="Title" />
                    <TextField source="p_policy_no" label="Policy No" />
                    <TextField source="p_issue_no" label="Issue No" />
                    <CustomChipField source="p_department" label="Department" />
                    <TextField
                        source="p_status"
                        label="Status"
                        className={classes.capitalize}
                    />
                    <ReferenceField
                        source="p_approved_by"
                        label="Approved By"
                        reference="v1/users"
                        link="show"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                    <AroggaDateField
                        source="p_uploaded_at"
                        label="Uploaded Date"
                    />
                    <AroggaDateField
                        source="p_effective_date"
                        label="Effective Date"
                    />
                    <AroggaDateField
                        source="p_approved_at"
                        label="Approved Date"
                    />
                    <AroggaDateField
                        source="p_revised_at"
                        label="Revised Date"
                    />
                    <AroggaDateField
                        source="p_created_at"
                        label="Created Date"
                    />
                    <ReferenceField
                        source="p_created_by"
                        label="Created By"
                        reference="v1/users"
                        link="show"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                    <AroggaDateField
                        source="p_modified_at"
                        label="Modified Date"
                    />
                    <ReferenceField
                        source="p_modified_by"
                        label="Modified By"
                        reference="v1/users"
                        link="show"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                    <FileField
                        source="attachedFiles_p_attachment"
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

export default PolicyShow;
