import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import SubAreaCreateEdit from "@/components/manageUser/subArea/SubAreaCreateEdit";

const SubAreaCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Sub-Area Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <SubAreaCreateEdit page="create" />
      </SimpleForm>
    </Create>
  );
};

export default SubAreaCreate;
