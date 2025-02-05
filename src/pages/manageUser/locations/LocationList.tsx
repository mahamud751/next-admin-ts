import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  List,
  ListProps,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import LocatiopnFilter from "./LocationFilter";

const LocationList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Location List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList("locationView", "locationEdit");

  return (
    <List
      {...rest}
      title="List of Location"
      perPage={25}
      sort={{ field: "l_id", order: "DESC" }}
      filters={<LocatiopnFilter children={""} />}
      exporter={exporter}
    >
      <Datagrid
        rowClick={navigateFromList}
        bulkActionButtons={permissions?.includes("locationDelete")}
      >
        <TextField source="l_id" label="ID" />
        <TextField source="l_division" label="Division" />
        <TextField source="l_district" label="District" />
        <TextField source="l_area" label="Area" />
        <TextField source="l_postcode" label="Postcode" />
        {/* <TextField source="l_zone" label="Zone" /> */}
        <ReferenceField
          source="l_zone_id"
          label="Zone"
          reference="v1/zone"
          link="show"
        >
          <TextField source="z_name" />
        </ReferenceField>
        <TextField source="l_courier" label="Courier" />
        <FunctionField
          source="l_status"
          label="Status"
          render={(record) => `${record.l_status ? "Active" : "Inactive"}`}
        />
      </Datagrid>
    </List>
  );
};

export default LocationList;
