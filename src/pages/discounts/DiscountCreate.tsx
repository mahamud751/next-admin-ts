import DiscountForm from "@/components/manageDatabase/discounts/DiscountForm";
import { useDocumentTitle } from "@/hooks";
import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

const DiscountCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Discount Create");

  return (
    <Create {...rest} redirect="list">
      <SimpleForm>
        <DiscountForm />
      </SimpleForm>
    </Create>
  );
};

export default DiscountCreate;
