import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  ImageField,
  List,
  ListProps,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { getColorByStatus } from "@/utils/helpers";
import LabPatientFilter from "./LabPatientFilter";

const LabPatientList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Patients List");
  const exporter = useExport(rest);
  return (
    <List
      {...rest}
      title="List of Lab Patients"
      filters={<LabPatientFilter children={""} />}
      perPage={25}
      exporter={exporter}
      // bulkActionButtons={false}
    >
      <Datagrid rowClick="show" style={{ height: 50 }}>
        <TextField source="userId" label="User ID" />
        <TextField
          source="name"
          label="Name"
          style={{ textTransform: "capitalize" }}
        />
        <TextField source="mobileNumber" label="Mobile" />
        <TextField source="email" label="Email" />
        <TextField
          source="gender"
          label="Gender"
          style={{ textTransform: "capitalize" }}
        />
        <TextField source="dob" label="Date Of Birth" />
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
        <ImageField
          source="profilePic"
          className="small__img"
          title="profilePic"
          label="Profile Pic"
        />
      </Datagrid>
    </List>
  );
};

export default LabPatientList;
