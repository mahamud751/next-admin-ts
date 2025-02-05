import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import { FC } from "react";
import {
    Datagrid,
    FunctionField,
    Link,
    List,
    Pagination,
    Record,
    ReferenceField,
    TextField,
    usePermissions,
} from "react-admin";
import Tooltip from "../../../components/Tooltip";
type EmployeeListProps = {
    filter: any;
};

const EmployeeList: FC<EmployeeListProps> = ({ filter }) => {
    const { permissions } = usePermissions();
    return (
        <>
            <List
                title=" "
                resource="v1/employeeAttendance"
                basePath="/employeeDashboard"
                bulkActionButtons={false}
                pagination={<Pagination />}
                filter={{
                    _attendance_status: filter.status,
                    _attendance_status_type: filter.status_type,
                    _attendance_date: filter.fromDate,
                    _attendance_date_end: filter.toDate,
                    _department: filter.department,
                    _include_child_department: filter.include_child_department,
                    _employee_id: filter.employee,
                    _shift_type: filter.shiftType,
                    _s_id: filter.shift,
                }}
                sort={{ field: "ea_id", order: "DESC" }}
                perPage={10}
                actions={null}
            >
                <Datagrid>
                    <TextField source="ea_employee_id" label="ID" />
                    <ReferenceField
                        source="ea_employee_id"
                        label="Employee"
                        reference="v1/employee"
                        link={false}
                    >
                        <TextField source="e_name" />
                    </ReferenceField>
                    <ReferenceField
                        source="ea_employee_id"
                        label="Phone"
                        reference="v1/employee"
                        link={false}
                    >
                        <TextField source="e_mobile" />
                    </ReferenceField>
                    {filter.status_type === "leave,holiday" && (
                        <TextField source="ea_status" label="Status" />
                    )}
                    {(filter.status === "present,delayed" ||
                        filter.status === "delayed") && (
                        <TextField
                            source="ea_attendance_in"
                            label="Attendance In"
                        />
                    )}
                    <FunctionField
                        label="Action"
                        render={(record: Record) => {
                            return (
                                <span style={{ display: "inline-flex" }}>
                                    {permissions?.includes("userView") &&
                                        record.e_user_id && (
                                            <Link
                                                to={`/v1/users/${record.e_user_id}/show`}
                                                style={{ display: "flex" }}
                                            >
                                                <Tooltip title="View User">
                                                    <PeopleAltOutlinedIcon />
                                                </Tooltip>
                                            </Link>
                                        )}
                                    {permissions?.includes("employeeView") &&
                                        record.ea_employee_id && (
                                            <Link
                                                to={`/v1/employee/${record.ea_employee_id}/show`}
                                                style={{
                                                    display: "flex",
                                                    marginLeft: "4px",
                                                }}
                                            >
                                                <Tooltip title="View Employee">
                                                    <PersonOutlineIcon />
                                                </Tooltip>
                                            </Link>
                                        )}
                                </span>
                            );
                        }}
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default EmployeeList;
