import { FC } from "react";
import { Create, CreateProps, SimpleForm, usePermissions } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import AddressCreateEdit from "@/components/manageUser/addresses/AddressCreateEdit";

const AddressCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Address Create");
  const { permissions } = usePermissions();
  return (
    <Create {...rest} redirect="list">
      <SimpleForm>
        <AddressCreateEdit permissions={permissions} />
      </SimpleForm>
    </Create>
  );
};

export default AddressCreate;
