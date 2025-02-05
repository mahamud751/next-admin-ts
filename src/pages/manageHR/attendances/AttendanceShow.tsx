import { FC } from "react";
import { ReferenceField, Show, ShowProps, TextField } from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import ColumnShowLayout from "../../../components/ColumnShowLayout";
import { useDocumentTitle } from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";

const AttendanceShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Attendance Show");

    const classes = useAroggaStyles();

    return (
        <Show {...props}>
            <ColumnShowLayout md={6}>
                <TextField source="ea_id" label="ID" />
                <ReferenceField
                    source="ea_employee_id"
                    label="Employee"
                    reference="v1/employee"
                    link="show"
                >
                    <TextField source="e_name" />
                </ReferenceField>
                <ReferenceField
                    source="ea_warehouse_id"
                    label="Warehouse"
                    reference="v1/warehouse"
                    link="show"
                >
                    <TextField source="w_title" />
                </ReferenceField>
                <AroggaDateField
                    source="ea_attendance_in"
                    label="Attendance In"
                />
                <AroggaDateField
                    source="ea_attendance_out"
                    label="Attendance Out"
                />
                <TextField
                    source="ea_shift_schedule_id"
                    label="Shift Schedule ID"
                />
                <TextField
                    source="ea_assigned_bag_id"
                    label="Assigned Bag ID"
                />
                <TextField
                    source="ea_status"
                    label="Status"
                    className={classes.capitalize}
                />
            </ColumnShowLayout>
        </Show>
    );
};

export default AttendanceShow;
