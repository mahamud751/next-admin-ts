import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import PolicyForm from "@/components/manageHR/policies/PolicyForm";
import { useDocumentTitle } from "@/hooks";

const PolicyCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Policy Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <PolicyForm />
      </SimpleForm>
    </Create>
  );
};

export default PolicyCreate;
