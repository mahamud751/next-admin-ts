import { FC } from "react";
import {
  DateTimeInput,
  Edit,
  EditProps,
  SimpleForm,
  TextInput,
  TransformData,
} from "react-admin";

import StatusInput from "@/components/manageHR/attendances/StatusInput";
import { useDocumentTitle } from "@/hooks";
import { toFormattedDateTime } from "@/utils/helpers";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";

const AttendanceEdit: FC<EditProps> = (props) => {
  useDocumentTitle("Arogga | Attendance Edit");

  const transform: TransformData = (data) => ({
    ...data,
    ea_attendance_in: toFormattedDateTime({
      dateString: data.ea_attendance_in,
    }),
    ea_attendance_out: toFormattedDateTime({
      dateString: data.ea_attendance_out,
    }),
    ea_shift_time_start: toFormattedDateTime({
      dateString: data.ea_shift_time_start,
    }),
    ea_shift_time_end: toFormattedDateTime({
      dateString: data.ea_shift_time_end,
    }),
  });

  return (
    <Edit
      {...props}
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      transform={transform}
      redirect="list"
      toolbar={<SaveDeleteToolbar isSave />}
    >
      <SimpleForm>
        <TextInput
          source="ea_id"
          label="ID"
          variant="outlined"
          helperText={false}
          disabled
        />
        <DateTimeInput
          source="ea_attendance_in"
          label="Attendance In"
          variant="outlined"
          helperText={false}
        />
        <DateTimeInput
          source="ea_attendance_out"
          label="Attendance Out"
          variant="outlined"
          helperText={false}
        />
        <DateTimeInput
          source="ea_shift_time_start"
          label="Shift Start"
          variant="outlined"
          helperText={false}
        />
        <DateTimeInput
          source="ea_shift_time_end"
          label="Shift End"
          variant="outlined"
          helperText={false}
        />
        <StatusInput source="ea_status" variant="outlined" />
      </SimpleForm>
    </Edit>
  );
};

export default AttendanceEdit;
