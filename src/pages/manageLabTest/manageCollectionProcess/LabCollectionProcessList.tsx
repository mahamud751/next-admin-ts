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
import LabCollectionProcessFilter from "./LabCollectionProcessFilter";

const LabCollectionProcessList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Collection Process");
  const exporter = useExport(rest);
  return (
    <List
      {...rest}
      title="Lis of Lab Collection Processes"
      filters={<LabCollectionProcessFilter children={""} />}
      perPage={25}
      exporter={exporter}
      //   bulkActionButtons={false}
    >
      <Datagrid rowClick="edit" style={{ height: 50 }}>
        <TextField source="title[en]" label="Title" />
        <TextField source="subTitle[en]" label="Sub Title" />
        <FunctionField
          render={(record) => {
            return <div>{record.description.en.slice(0, 60)}...</div>;
          }}
          label="Description"
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
          source="bannerUrl"
          label="Banner"
          src="src"
          title="title"
          className="small__img"
        />
      </Datagrid>
    </List>
  );
};

export default LabCollectionProcessList;
