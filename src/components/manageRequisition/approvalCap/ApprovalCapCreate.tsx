import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ApprovalCapForm from "./ApprovalCapForm";

const ApprovalCapCreate: FC<CreateProps> = (rest) => {
  useDocumentTitle("Arogga |Approval Cap Create");

  return (
    <Create {...rest}>
      <SimpleForm>
        <ApprovalCapForm />
      </SimpleForm>
    </Create>
  );
};

export default ApprovalCapCreate;
