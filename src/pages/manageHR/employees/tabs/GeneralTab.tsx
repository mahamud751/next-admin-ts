import { useState } from "react";
import {
    BooleanField,
    Button,
    EmailField,
    FunctionField,
    NumberField,
    Record,
    ReferenceField,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    usePermissions,
} from "react-admin";

import AroggaAccordion from "../../../../components/AroggaAccordion";
import AroggaDateField from "../../../../components/AroggaDateField";
import TerminateDialog from "../../../../components/manageHR/employees/TerminateDialog";
import { useGetCurrentUser } from "../../../../hooks";

const GeneralTab = () => {
    const currentUser = useGetCurrentUser();
    const { permissions } = usePermissions();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState(null);
    const [employeeRetirementAction, setEmployeeRetirementAction] =
        useState("");

    const employeeConfirmationCheck = (confirmationDate) => {
        const today = new Date();
        const day = today.toISOString().split("T")[0];
        return confirmationDate <= day;
    };

    return (
        <>
            <SimpleShowLayout>
                <AroggaAccordion title="Employee Primary Data">
                    <TextField source="e_id" label="ID" />
                    <ReferenceField
                        source="e_user_id"
                        label="User"
                        reference="v1/users"
                        link="show"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                    <TextField source="e_name" label="Name" />
                    <EmailField source="user.u_email" label="Email" />
                    <TextField source="e_mobile" label="Mobile" />
                    <TextField source="e_type" label="Employee Type" />
                    <TextField source="user.u_role" label="User Role" />
                    <TextField source="e_department" label="Department" />
                    <ReferenceField
                        source="e_rank_id"
                        label="Designation"
                        reference="v1/rank"
                        link={({ e_rank_id }) =>
                            `/designation-permission/${e_rank_id}`
                        }
                    >
                        <TextField source="r_title" />
                    </ReferenceField>
                    <TextField source="user.u_sex" label="Gender" />
                </AroggaAccordion>
                <AroggaAccordion title="Employee Other Data">
                    <ReferenceField
                        source="e_warehouse_id"
                        label="Warehouse"
                        reference="v1/warehouse"
                        link="show"
                    >
                        <TextField source="w_title" />
                    </ReferenceField>
                    <AroggaDateField
                        source="e_date_of_joining"
                        label="Date of Joining"
                    />
                    <AroggaDateField
                        source="e_confirmation_date"
                        label="Date of Confirmation"
                    />
                    <FunctionField
                        label="Employee Status"
                        render={(record) =>
                            employeeConfirmationCheck(
                                record.e_confirmation_date
                            )
                                ? "Permanent"
                                : "Probation"
                        }
                    />
                    <AroggaDateField
                        source="e_date_of_leaving"
                        label="Date of Leaving"
                    />
                    <AroggaDateField
                        source="e_date_of_release"
                        label="Date of Releasing"
                    />
                    <FunctionField
                        label="Shift Type"
                        render={({ shifts }: Record) =>
                            shifts?.[0]?.s_shift_type
                        }
                    />
                    <FunctionField
                        label="Shift Slots"
                        render={({ shifts }: Record) => {
                            if (!shifts?.length) return;

                            return shifts.map(({ s_id, s_title }) => (
                                <ul style={{ margin: 0 }} key={s_id}>
                                    <li>{s_title}</li>
                                </ul>
                            ));
                        }}
                    />
                </AroggaAccordion>
                <AroggaAccordion title="Holidays">
                    <BooleanField
                        source="e_dynamic_leave_mode"
                        label="Dynamic Leave Mode?"
                        looseValue
                    />
                    <FunctionField
                        label="Holidays"
                        render={({ holidays }: Record) => {
                            if (!holidays?.length) return;

                            return holidays.map(
                                ({ eh_id, eh_holiday_type }) => (
                                    <ul style={{ margin: 0 }} key={eh_id}>
                                        <li>{eh_holiday_type}</li>
                                    </ul>
                                )
                            );
                        }}
                    />
                    <TextField source="e_sick_leaves" label="Sick Leaves" />
                    <TextField source="e_casual_leaves" label="Casual Leaves" />
                    <TextField source="e_annual_leaves" label="Annual Leaves" />
                    <TextField
                        source="e_compensatory_leaves"
                        label="Compensatory Leaves"
                    />
                    <TextField
                        source="e_maternity_leaves"
                        label="Maternity Leaves"
                    />
                    <FunctionField
                        label="Weekend Leaves"
                        render={({ e_weekend_leaves }: Record) => {
                            if (e_weekend_leaves === 0) return "All Fridays";
                            return e_weekend_leaves;
                        }}
                    />
                </AroggaAccordion>
                <AroggaAccordion title="Salary">
                    <NumberField source="e_salary" label="Salary" />
                    <NumberField source="e_salary_tax" label="Salary Tax" />
                    <NumberField source="e_payment_mode" label="Payment Mode" />
                    <ReferenceField
                        source="e_eb_id"
                        label="Bank"
                        reference="v1/employeeBank"
                    >
                        <FunctionField
                            label="Bank"
                            render={(record: Record) =>
                                `${record?.eb_account_title} (${record?.eb_account_no} ${record?.eb_card_no})`
                            }
                        />
                    </ReferenceField>
                    <BooleanField
                        source="e_salary_addition_mode"
                        label="Auto Salary Addition Mode?"
                        looseValue
                    />
                    <BooleanField
                        source="e_salary_deduction_mode"
                        label="Auto Salary Deduction Mode?"
                        looseValue
                    />
                    <BooleanField
                        source="e_delay_salary_deduction_mode"
                        label="Auto Delay Salary Deduction Mode?"
                        looseValue
                    />
                    <NumberField
                        source="e_deduction_delay_count"
                        label="Deduction Delay Count"
                    />
                </AroggaAccordion>
                {permissions?.includes("employeeRetirement") && (
                    <FunctionField
                        addLabel={false}
                        render={({
                            e_id,
                            e_user_id,
                            e_date_of_leaving,
                            e_date_of_release,
                        }: Record) => {
                            if (currentUser.u_id === e_user_id) return;

                            return (
                                <div style={{ marginTop: 8 }}>
                                    {e_date_of_leaving === "0000-00-00" && (
                                        <Button
                                            label="Terminate"
                                            variant="outlined"
                                            style={{
                                                color: "white",
                                                backgroundColor: "#dc3545",
                                                marginRight: "5px",
                                                border: "1px solid white",
                                            }}
                                            onClick={() => {
                                                setEmployeeId(e_id);
                                                setEmployeeRetirementAction(
                                                    "terminate"
                                                );
                                                setIsDialogOpen(true);
                                            }}
                                        />
                                    )}
                                    {e_date_of_leaving !== "0000-00-00" &&
                                        e_date_of_release === "0000-00-00" && (
                                            <Button
                                                label="Release"
                                                variant="outlined"
                                                style={{
                                                    color: "white",
                                                    backgroundColor: "#dc3545",
                                                    border: "1px solid white",
                                                }}
                                                onClick={() => {
                                                    setEmployeeId(e_id);
                                                    setEmployeeRetirementAction(
                                                        "release"
                                                    );
                                                    setIsDialogOpen(true);
                                                }}
                                            />
                                        )}
                                </div>
                            );
                        }}
                    />
                )}
            </SimpleShowLayout>
            <SimpleForm toolbar={false}>
                <TerminateDialog
                    open={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    employeeId={employeeId}
                    employeeRetirementAction={employeeRetirementAction}
                />
            </SimpleForm>
        </>
    );
};

export default GeneralTab;
