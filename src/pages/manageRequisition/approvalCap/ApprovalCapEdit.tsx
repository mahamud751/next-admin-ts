import { FC } from "react";
import { Edit, EditProps, SaveButton, SimpleForm, Toolbar } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ApprovalCapForm from "./ApprovalCapForm";

const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);
const ApprovalCapEdit: FC<EditProps> = ({ hasEdit, ...rest }) => {
  useDocumentTitle("Arogga | Approval Cap |  Edit");
  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
    >
      <SimpleForm
        // redirect="list"
        // submitOnEnter={false}
        toolbar={<CustomToolbar />}
      >
        <ApprovalCapForm />
      </SimpleForm>
    </Edit>
  );
};

export default ApprovalCapEdit;
