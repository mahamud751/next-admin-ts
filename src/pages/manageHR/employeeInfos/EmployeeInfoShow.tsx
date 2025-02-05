import { FC, useState } from "react";
import {
    Button,
    Confirm,
    FileField,
    FunctionField,
    Record,
    ReferenceField,
    Show,
    ShowProps,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import ColumnShowLayout from "../../../components/ColumnShowLayout";
import { useDocumentTitle, useRequest } from "../../../hooks";

const EmployeeInfoShow: FC<ShowProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Employee Info Show");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState(null);

    const { isLoading, refetch } = useRequest(
        `/v1/employee/employeeInfoApprove/${employeeId}`,
        {
            method: "POST",
        },
        {
            isRefresh: true,
            onSuccess: () => setIsDialogOpen(false),
        }
    );

    return (
        <Show {...rest}>
            <ColumnShowLayout>
                <TextField source="ei_id" label="ID" />
                <ReferenceField
                    source="ei_e_id"
                    label="Employee"
                    reference="v1/employee"
                    link="show"
                    sortBy="ei_e_id"
                >
                    <TextField source="e_name" />
                </ReferenceField>
                <TextField
                    source="ei_residential_address"
                    label="Residential Address"
                />
                <AroggaDateField source="ei_date_of_birth" label="Birth Date" />
                <TextField source="ei_blood_group" label="Blood Group" />
                <TextField
                    source="ei_birth_certificate"
                    label="Birth Certificate Number"
                />
                <FileField
                    source="attachedFiles_ei_birth_certificate_photo"
                    src="src"
                    title="Birth Certificate"
                    target="_blank"
                    label="Birth Certificate Files"
                />
                <TextField source="ei_nid" label="NID" />
                <FileField
                    source="attachedFiles_ei_nid_photo"
                    src="src"
                    title="NID Files"
                    target="_blank"
                    label="NID Files"
                />
                <TextField source="ei_tin" label="TIN" />
                <FileField
                    source="attachedFiles_ei_tin_photo"
                    src="src"
                    title="Tin Files"
                    target="_blank"
                    label="Tin Files"
                />
                <TextField source="ei_license" label="Driving License" />
                <FileField
                    source="attachedFiles_ei_license_photo"
                    src="src"
                    title="License Files"
                    target="_blank"
                    label="License Files"
                />
                <TextField source="ei_passport" label="Passport" />
                <FileField
                    source="attachedFiles_ei_passport_photo"
                    src="src"
                    title="Passport Files"
                    target="_blank"
                    label="Passport Files"
                />

                <FileField
                    source="attachedFiles_ei_cheque_photo"
                    src="src"
                    title="Cheque Files"
                    target="_blank"
                    label="Cheque Files"
                />
                {permissions?.includes("employeeInfoApproved") && (
                    <>
                        <FunctionField
                            addLabel={false}
                            render={({ ei_e_id, ei_approved }: Record) => {
                                if (ei_approved) return;

                                return (
                                    <Button
                                        label="Approve"
                                        variant="outlined"
                                        style={{
                                            color: "white",
                                            backgroundColor: "#008069",
                                        }}
                                        onClick={() => {
                                            setEmployeeId(ei_e_id);
                                            setIsDialogOpen(true);
                                        }}
                                    />
                                );
                            }}
                        />
                        <Confirm
                            isOpen={isDialogOpen}
                            loading={isLoading}
                            title="Are you sure you want to approve this employee info?"
                            content={false}
                            onConfirm={refetch}
                            onClose={() => setIsDialogOpen(false)}
                        />
                    </>
                )}
            </ColumnShowLayout>
        </Show>
    );
};

export default EmployeeInfoShow;
