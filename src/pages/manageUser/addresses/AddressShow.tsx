import { FC } from "react";
import {
  BooleanField,
  ReferenceField,
  Show,
  ShowProps,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const AddressShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Address Show");

  return (
    <Show {...props}>
      <ColumnShowLayout>
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
        <BooleanField source="ul_default" label="Default?" looseValue />
        <TextField source="ul_lat" label="Latitude" />
        <TextField source="ul_long" label="Longitude" />
        <TextField source="ul_location" label="Location" />
      </ColumnShowLayout>
    </Show>
  );
};

export default AddressShow;
