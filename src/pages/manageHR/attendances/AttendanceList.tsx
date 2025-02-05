import { Box } from "@mui/material";
import { DateTime } from "luxon";
import { FC, useState } from "react";
import {
  Button,
  Confirm,
  Datagrid,
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import {
  useDocumentTitle,
  useExport,
  useNavigateFromList,
  useRequest,
} from "@/hooks";
import { toFormattedDateTime } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AttendanceFilter from "./AttendanceFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const AttendanceList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Attendance List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList(
    "employeeAttendanceView",
    "employeeAttendanceEdit"
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState("");
  const [pastIn, setPastIn] = useState("");
  const [functions, setFunctions] = useState(void 0);
  const [employeeAttendanceId, setEmployeeAttendanceId] = useState(null);

  const dt = DateTime.now();

  const { isLoading, refetch } = useRequest(
    `/v1/employeeAttendance/${employeeAttendanceId}`,
    {
      method: "POST",
      body: {
        ea_status: "present",
        [action]: `${dt.toISODate()} ${dt.toISOTime().split(".")[0]}`,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );
  const { isLoading: isPastInLoading, refetch: pastInRefetch } = useRequest(
    `/v1/tinyUpdate/employeeAttendance/${employeeAttendanceId}`,
    {
      method: "POST",
      body: {
        ea_status: "present",
        ea_attendance_in: pastIn,
      },
    },
    {
      successNotify: "Attendance Updated Successfully",
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );

  const isToday = (date: string) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };
  const isPastAllowed = (date: string) => {
    const today = new Date();
    const filterDate = new Date(date);

    return (
      filterDate.getTime() < today.getTime() &&
      filterDate.getMonth() === today.getMonth() &&
      filterDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <>
      <List
        {...rest}
        title="List of Attendance"
        filters={<AttendanceFilter children={""} />}
        filterDefaultValues={{
          _attendance_date: toFormattedDateTime({
            isDate: true,
            dateString: new Date().toString(),
          }),
        }}
        perPage={25}
        sort={{ field: "ea_id", order: "DESC" }}
        exporter={exporter}
      >
        <Datagrid rowClick={navigateFromList} bulkActionButtons={false}>
          <TextField source="ea_id" label="ID" />
          <ReferenceField
            source="ea_employee_id"
            label="Employee"
            reference="v1/employee"
            link="show"
            sortBy="ea_employee_id"
          >
            <TextField source="e_name" />
          </ReferenceField>
          <AroggaDateField source="ss_date" label="Date" />
          <AroggaDateField source="ea_shift_time_start" label="Shift Start" />
          <AroggaDateField source="ea_attendance_in" label="Attendance In" />
          <AroggaDateField source="ea_shift_time_end" label="Shift End" />
          <AroggaDateField source="ea_attendance_out" label="Attendance Out" />
          <TextField
            source="s_shift_type"
            label="Type"
            className={classes.capitalize}
          />
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
                    : ea_status === "delay"
                    ? { color: "orange" }
                    : {}
                }
              >
                {ea_status}
              </span>
            )}
          />
          {permissions?.includes("employeeAttendanceEdit") && (
            <FunctionField
              label="Action"
              onClick={(e) => e.stopPropagation()}
              render={({
                ea_id,
                ea_status,
                ea_attendance_in,
                ea_attendance_out,
                ea_shift_time_start,
                ss_date,
              }: Record) => (
                <>
                  <Box display="flex">
                    {ea_status === "active" &&
                      ea_attendance_in === "0000-00-00 00:00:00" &&
                      ea_attendance_out === "0000-00-00 00:00:00" &&
                      isToday(ss_date) && (
                        <Box mr={1}>
                          <Button
                            label="In"
                            variant="contained"
                            onClick={() => {
                              setAction("ea_attendance_in");
                              setEmployeeAttendanceId(ea_id);
                              setFunctions("refetch");
                              setIsDialogOpen(true);
                            }}
                          />
                        </Box>
                      )}
                    {(ea_status === "present" || ea_status === "delay") &&
                      ea_attendance_in !== "0000-00-00 00:00:00" &&
                      ea_attendance_out === "0000-00-00 00:00:00" &&
                      isToday(ss_date) && (
                        <Button
                          label="Out"
                          variant="outlined"
                          style={{
                            color: "white",
                            border: "none",
                            backgroundColor: "#dc3545",
                          }}
                          onClick={() => {
                            setAction("ea_attendance_out");
                            setEmployeeAttendanceId(ea_id);
                            setFunctions("refetch");
                            setIsDialogOpen(true);
                          }}
                        />
                      )}
                    {permissions.includes("elevatedAttendanceInput")
                      ? ["active", "absent"].includes(ea_status) &&
                        ea_attendance_in === "0000-00-00 00:00:00" &&
                        ea_attendance_out === "0000-00-00 00:00:00" &&
                        !isToday(ss_date) &&
                        isPastAllowed(ss_date) && (
                          <Box mr={1}>
                            <Button
                              label="Past In"
                              style={{
                                width: "80px",
                              }}
                              variant="contained"
                              onClick={() => {
                                setPastIn(ea_shift_time_start);
                                setFunctions("pastInRefetch");
                                setEmployeeAttendanceId(ea_id);
                                setIsDialogOpen(true);
                              }}
                            />
                          </Box>
                        )
                      : null}
                  </Box>
                </>
              )}
            />
          )}
        </Datagrid>
      </List>
      <Confirm
        isOpen={isDialogOpen}
        loading={isLoading || isPastInLoading}
        title={`Are you sure you want to attendance ${
          action.split("_")[2] || "Past In"
        }?`}
        content={false}
        onConfirm={() => {
          switch (functions) {
            case "pastInRefetch":
              pastInRefetch();
              break;
            case "refetch":
              refetch();
              break;
          }
        }}
        onClose={() => {
          setIsDialogOpen(false);
          setAction("");
          setFunctions("");
        }}
      />
    </>
  );
};

export default AttendanceList;
