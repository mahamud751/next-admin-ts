import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  ImageField,
  List,
  ListProps,
  NumberField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "../../../hooks";
import LabBannerFilter from "./LabBannerFilter";
import { getColorByStatus } from "../../../utils/helpers";

const LabBannerList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Banner List");
  const exporter = useExport(rest);
  return (
    <List
      {...rest}
      title="List of Lab Banners"
      filters={<LabBannerFilter children={""} />}
      perPage={25}
      exporter={exporter}
    >
      <Datagrid rowClick="edit" style={{ height: 50 }}>
        <TextField source="id" label="ID" />
        <NumberField source="sortOrder" label="Sort Order" />
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

export default LabBannerList;
