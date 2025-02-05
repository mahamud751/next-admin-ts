import { FC } from "react";
import { Edit, EditProps, SaveButton, SimpleForm, Toolbar } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import LocationCreateEdit from "@/components/manageUser/locations/LocationCreateEdit";

const LocationEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Location Edit");
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton alwaysEnable />
    </Toolbar>
  );
  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
      submitOnEnter={false}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <LocationCreateEdit page="edit" />
      </SimpleForm>
    </Edit>
  );
};

export default LocationEdit;
