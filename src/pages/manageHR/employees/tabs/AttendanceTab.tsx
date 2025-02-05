import AroggaDateField from "@/components/common/AroggaDateField";
import {
  Datagrid,
  FunctionField,
  Pagination,
  RaRecord as Record,
  ReferenceManyField,
  TextField,
} from "react-admin";

const AttendanceTab = () => (
  <ReferenceManyField
    reference="v1/employeeAttendance"
    target="_employee_id"
    pagination={<Pagination />}
    sort={{ field: "ea_id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="ea_id" label="ID" />
      <AroggaDateField source="ss_date" label="Date" />
      <AroggaDateField source="ea_shift_time_start" label="Shift Start" />
      <AroggaDateField source="ea_attendance_in" label="Attendance In" />
      <AroggaDateField source="ea_shift_time_end" label="Shift End" />
      <AroggaDateField source="ea_attendance_out" label="Attendance Out" />
      <TextField source="s_shift_type" label="Type" />
      <FunctionField
        label="Status"
        sortBy="ea_status"
        render={({ ea_status }: Record) => (
          <span
            style={
              ea_status === "present"
                ? { color: "#008069" }
                : ea_status === "absent"
                ? { color: "#dc3545" }
                : ea_status === "delayed"
                ? { color: "orange" }
                : {}
            }
          >
            {ea_status}
          </span>
        )}
      />
    </Datagrid>
  </ReferenceManyField>
);

export default AttendanceTab;
