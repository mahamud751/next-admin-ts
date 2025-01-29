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
import LabGeneralFilter from "./LabGeneralFilter";

const LabGeneralIconList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Icon List");
  const exporter = useExport(rest);
  return (
    <List
      {...rest}
      title="List of General Icons"
      filters={<LabGeneralFilter children={""} />}
      perPage={25}
      exporter={exporter}
      // bulkActionButtons={false}
    >
      <Datagrid rowClick="edit" style={{ height: 50 }}>
        <TextField source="sortOrder" label="Sort Order" />
        <TextField
          source="iconType"
          label="Icon Type"
          style={{ textTransform: "capitalize" }}
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
        <ImageField
          source="active"
          label="Active Icon"
          src="src"
          title="title"
          className="small__img"
        />
        <ImageField
          source="default"
          label="Default Icon"
          src="src"
          title="title"
          className="small__img"
        />
      </Datagrid>
    </List>
  );
};

export default LabGeneralIconList;
