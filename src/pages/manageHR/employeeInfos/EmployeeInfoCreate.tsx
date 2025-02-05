import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import EmployeeInfoCreateEdit from "@/components/manageHR/employeeInfo/EmployeeInfoCreateEdit";
import { useDocumentTitle } from "@/hooks";

const EmployeeInfoCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Employee Info Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <EmployeeInfoCreateEdit page="create" />
      </SimpleForm>
    </Create>
  );
};

export default EmployeeInfoCreate;
