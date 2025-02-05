import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";

import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import SubAreaCreateEdit from "@/components/manageUser/subArea/SubAreaCreateEdit";

const SubAreaEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Sub-Area Edit");

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
      <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
        <SubAreaCreateEdit page="edit" />
      </SimpleForm>
    </Edit>
  );
};

export default SubAreaEdit;
