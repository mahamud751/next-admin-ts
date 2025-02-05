import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import EmployeeInfoCreateEdit from "@/components/manageHR/employeeInfo/EmployeeInfoCreateEdit";
import { useDocumentTitle } from "@/hooks";

const EmployeeInfoEdit: FC<EditProps> = (props) => {
  useDocumentTitle("Arogga | Employee Info Edit");

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...props}
    >
      <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
        <EmployeeInfoCreateEdit page="edit" />
      </SimpleForm>
    </Edit>
  );
};

export default EmployeeInfoEdit;
