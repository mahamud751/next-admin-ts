import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import LocationCreateEdit from "@/components/manageUser/locations/LocationCreateEdit";

const LocationCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Address Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <LocationCreateEdit page="create" />
      </SimpleForm>
    </Create>
  );
};

export default LocationCreate;
