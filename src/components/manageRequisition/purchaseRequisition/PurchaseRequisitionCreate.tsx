import { useDocumentTitle } from "@/hooks";
import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";
import PurchaseRequisitionForm from "./PurchaseRequisitionForm";

const PurchaseRequisitionCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Purchase Requisition Create");

  return (
    <Create {...rest}>
      <SimpleForm>
        <PurchaseRequisitionForm />
      </SimpleForm>
    </Create>
  );
};

export default PurchaseRequisitionCreate;
