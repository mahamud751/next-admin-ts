import { FC } from "react";
import {
  BooleanField,
  Datagrid,
  List,
  ListProps,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import AddressFilter from "./AddressFilter";

const AddressList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Address List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList(
    "userLocationView",
    "userLocationEdit"
  );

  return (
    <List
      {...rest}
      title="List of Address"
      perPage={25}
      sort={{ field: "ul_id", order: "DESC" }}
      filters={<AddressFilter children={""} />}
      exporter={exporter}
    >
      <Datagrid
        rowClick={navigateFromList}
        bulkActionButtons={permissions?.includes("userLocationDelete")}
      >
        <TextField source="ul_id" label="ID" />
        <ReferenceField
          source="u_id"
          label="User"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <TextField source="ul_name" label="Name" />
        <TextField source="ul_mobile" label="Mobile" />
        <TextField source="ul_type" label="Type" />
        <TextField source="ul_address" label="Address" />
        <BooleanField
          source="ul_default"
          label="Default?"
          FalseIcon={null}
          looseValue
        />
        <TextField source="ul_lat" label="Latitude" />
        <TextField source="ul_long" label="Longitude" />
        <TextField source="ul_location" label="Location" />
      </Datagrid>
    </List>
  );
};

export default AddressList;
