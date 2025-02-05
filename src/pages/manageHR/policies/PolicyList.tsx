import { FC, useState } from "react";
import {
    Button,
    Confirm,
    FileField,
    FunctionField,
    List,
    ListProps,
    Record,
    ReferenceField,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import {
    useDocumentTitle,
    useExport,
    useNavigateFromList,
    useRequest,
} from "../../../hooks";
import { CustomizableDatagrid } from "../../../lib";
import PolicyFilter from "./PolicyFilter";

const PolicyList: FC<ListProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Policy List");

    const exporter = useExport(rest);
    const navigateFromList = useNavigateFromList("policyView", "policyEdit");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState("");
    const [status, setStatus] = useState("");

    const { isLoading, refetch } = useRequest(
        `/v1/policy/${selectedPolicyId}`,
        {
            method: "POST",
            body: {
                p_status: status,
            },
        },
        {
            isRefresh: true,
            onSuccess: () => setIsDialogOpen(false),
        }
    );

    return (
        <>
            <List
                {...rest}
                title="List of Policy"
                perPage={25}
                exporter={exporter}
                filters={<PolicyFilter children={""} />}
                sort={{ field: "p_id", order: "DESC" }}
                bulkActionButtons={permissions?.includes("policyDelete")}
            >
                <CustomizableDatagrid
                    rowClick={navigateFromList}
                    hideableColumns={[
                        "p_department",
                        "p_created_by",
                        "p_modified_at",
                        "p_modified_by",
                    ]}
                >
                    <TextField source="p_id" label="ID" />
                    <TextField source="p_title" label="Title" />
                    <TextField source="p_policy_no" label="Policy No" />
                    <TextField source="p_issue_no" label="Issue No" />
                    <ReferenceField
                        source="p_approved_by"
                        label="Approved By"
                        reference="v1/users"
                        link="show"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                    <AroggaDateField
                        source="p_created_at"
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
                    <FunctionField
                        label="Action"
                        onClick={(e) => e.stopPropagation()}
                        render={({ p_id, p_status }: Record) => (
                            <Button
                                label={
                                    p_status === "published"
                                        ? "Unpublish"
                                        : "Publish"
                                }
                                variant="contained"
                                onClick={() => {
                                    setSelectedPolicyId(p_id);
                                    setStatus(
                                        p_status === "published"
                                            ? "unpublished"
                                            : "published"
                                    );
                                    setIsDialogOpen(true);
                                }}
                            />
                        )}
                    />
                </CustomizableDatagrid>
            </List>
            <Confirm
                title={`Confirmation #${selectedPolicyId}`}
                content={`Are you sure you want to ${
                    status === "published" ? "publish" : "unpublish"
                } this policy?`}
                isOpen={isDialogOpen}
                loading={isLoading}
                onConfirm={refetch}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    );
};

export default PolicyList;
