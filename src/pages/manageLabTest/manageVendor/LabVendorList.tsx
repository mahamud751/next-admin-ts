import { FC } from "react";
import {
  Datagrid,
  DateField,
  FunctionField,
  ImageField,
  List,
  ListProps,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { getColorByStatus } from "@/utils/helpers";
import LabVendorFilter from "./LabVendorFilter";

const LabVendorList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Vendor List");
  const exporter = useExport(rest);
  return (
    <List
      {...rest}
      title="List of Lab Vendors"
      filters={<LabVendorFilter children={""} />}
      perPage={25}
      exporter={exporter}
      //   bulkActionButtons={false}
    >
      <Datagrid rowClick="edit" style={{ height: 50 }}>
        <TextField
          source="name.en"
          label="Name EN"
          style={{ textTransform: "capitalize" }}
        />
        <TextField
          source="name.bn"
          label="Name BN"
          style={{ textTransform: "capitalize" }}
        />
        <ImageField
          source="image.app"
          label="Image"
          src="src"
          title="title"
          className="small__img"
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
        <DateField source="createdAt" label="Created" showTime={true} />
      </Datagrid>
    </List>
  );
};

export default LabVendorList;
