import { FC } from "react";
import {
    Datagrid,
    EmailField,
    FileField,
    List,
    ListProps,
    ReferenceField,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import {
    useDocumentTitle,
    useExport,
    useNavigateFromList,
} from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import ApplicantFilter from "./ApplicantFilter";

const ApplicantList: FC<ListProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Applicants List");

    const exporter = useExport(rest);
    const classes = useAroggaStyles();
    const navigateFromList = useNavigateFromList(
        "jobApplicationView",
        "jobApplicationEdit"
    );

    return (
        <List
            {...rest}
            title="List of Application"
            perPage={25}
            exporter={exporter}
            filters={<ApplicantFilter children={""} />}
            sort={{ field: "a_id", order: "DESC" }}
            bulkActionButtons={permissions?.includes("jobApplicationDelete")}
        >
            <Datagrid rowClick={navigateFromList}>
                <TextField source="a_id" label="ID" />
                <AroggaDateField source="a_created" label="Created At" />
                <ReferenceField
                    source="j_id"
                    label="Job Title"
                    reference="v1/job"
                    link="show"
                    sortBy="j_title"
                >
                    <TextField source="j_title" />
                </ReferenceField>
                <TextField source="a_name" label="Name" />
                <EmailField source="a_email" label="Email" />
                <TextField source="a_phone" label="Mobile" />
                <TextField
                    source="a_status"
                    label="Status"
                    className={classes.capitalize}
                />
                <TextField source="a_note" label="Internal Note" />
                <FileField
                    source="attachedFiles"
                    label="Related Files"
                    src="src"
                    title="title"
                    target="_blank"
                    // @ts-ignore
                    onClick={(e) => e.stopPropagation()}
                />
            </Datagrid>
        </List>
    );
};

export default ApplicantList;
