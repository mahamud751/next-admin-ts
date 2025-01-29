import { FC } from "react";
import { Datagrid, List, ListProps, TextField } from "react-admin";

import { useDocumentTitle, useExport } from "../../../hooks";
import LabCollectorFilter from "./LabCollectionFilter";

const LabCollectorList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Collectors List");
  const exporter = useExport(rest);

  return (
    <List
      {...rest}
      title="List of Lab Collectors"
      filters={<LabCollectorFilter children={""} />}
      perPage={25}
      exporter={exporter}
      // bulkActionButtons={false}
    >
      <Datagrid rowClick="edit" style={{ height: 50 }}>
        <TextField source="userId" label="User ID" />
        <TextField source="name" label="Name" />
        <TextField source="mobileNumber" label="Mobile" />
        <TextField source="email" label="Email" />
      </Datagrid>
    </List>
  );
};

export default LabCollectorList;
