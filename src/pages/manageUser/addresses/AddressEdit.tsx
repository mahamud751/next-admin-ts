import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import AddressCreateEdit from "@/components/manageUser/addresses/AddressCreateEdit";

const AddressEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Address Edit");

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
      <SimpleForm>
        <AddressCreateEdit permissions={permissions} />
      </SimpleForm>
    </Edit>
  );
};

export default AddressEdit;
