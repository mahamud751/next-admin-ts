import {
    Datagrid,
    NumberField,
    Pagination,
    ReferenceManyField,
    TextField,
} from "react-admin";

const SalaryTab = () => (
    <ReferenceManyField
        reference="v1/salary"
        target="_employee_id"
        pagination={<Pagination />}
        sort={{ field: "s_id", order: "DESC" }}
    >
        <Datagrid rowClick="show">
            <TextField source="s_id" label="ID" />
            <TextField source="s_year" label="Year" />
            <TextField source="s_month" label="Month" />
            <TextField source="s_working_days" label="Total Working Day" />
            <TextField source="s_employee_shift_count" label="Employee Shift" />
            <TextField source="s_available_leave" label="Payable Leave" />
            <TextField source="s_leave_taken" label="Spent Leave" />
            <TextField source="s_absent" label="Absent" />
            <NumberField source="s_per_shift_salary" label="Per Shift Salary" />
            <NumberField source="s_gross_salary" label="Salary" />
            <NumberField source="s_gross_payable" label="Gross Payable" />
            <NumberField source="s_gross_addition" label="Gross Addition" />
            <NumberField source="s_gross_deduction" label="Gross Deduction" />
            <NumberField source="s_tax" label="Tax" />
            <NumberField source="s_net_payable" label="Net Payable" />
            <TextField source="s_payment_mode" label="Payment Mode" />
            <TextField source="s_status" label="Status" />
        </Datagrid>
    </ReferenceManyField>
);

export default SalaryTab;
