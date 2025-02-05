import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

import ThreePlConfigCreateEdit from "@/components/manageDelivery/3plList/ThreePlListCreateEdit";
import { useDocumentTitle } from "@/hooks";

const ThreePlEdit: FC<EditProps> = (props) => {
  useDocumentTitle("Arogga | 3PL Config Edit");
  return (
    <>
      <Edit
        mutationMode={
          process.env.REACT_APP_NODE_ENV === "development"
            ? "pessimistic"
            : "optimistic"
        }
        {...props}
        redirect="list"
      >
        <SimpleForm>
          <ThreePlConfigCreateEdit page="edit" />
        </SimpleForm>
      </Edit>
    </>
  );
};

export default ThreePlEdit;
