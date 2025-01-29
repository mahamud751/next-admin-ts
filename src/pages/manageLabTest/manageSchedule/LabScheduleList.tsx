import { FC } from "react";
import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  ListProps,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { getColorByStatus } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

const LabScheduleList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Schedule List");
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  return (
    <List
      {...rest}
      title="List of Lab Schedules"
      perPage={25}
      exporter={exporter}
      //   bulkActionButtons={false}
    >
      <Datagrid rowClick="edit" style={{ height: 50 }}>
        <DateField
          source="scheduleDate"
          label="Schedule Date"
          showTime={true}
        />
        <TextField
          source="dateType"
          label="Date Type"
          className={classes.capitalize}
        />
        <TextField source="remarks" label="Holiday" />
        <TextField source="createdBy.name" label="Created By" />
        <TextField
          source="createdBy.mobileNumber"
          label="CreatedBy User Number"
        />
        <TextField source="updatedBy.name" label="Updated By" />
        <TextField
          source="updatedBy.mobileNumber"
          label="Updated User Number"
        />
        <TextField
          source="updatedBy.role"
          label="Update Role"
          className={classes.capitalize}
        />
        <FunctionField
          render={(record) => {
            const color = getColorByStatus(record.status);
            return (
              <div
                style={{
                  width: 93,
                  backgroundColor: color + "10",
                  color: color,
                  borderRadius: 42,
                  textAlign: "center",
                  paddingTop: 5,
                  paddingBottom: 5,
                  textTransform: "capitalize",
                }}
              >
                {record.status}
              </div>
            );
          }}
          label="Status"
        />
      </Datagrid>
    </List>
  );
};

export default LabScheduleList;
