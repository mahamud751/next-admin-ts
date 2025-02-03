import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import DiscountForm from "@/components/manageDatabase/discounts/DiscountForm";
import { useDocumentTitle } from "@/hooks";
import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

const DiscountEdit: FC<EditProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Discount Edit");

  return (
    <Edit
      mutationMode={
        process.env.NEXT_PUBLIC_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      //   redirect="list"
      {...rest}
    >
      <SimpleForm
        toolbar={
          <SaveDeleteToolbar
            isSave
            isDelete={rest.permissions?.includes("productDiscountDelete")}
          />
        }
      >
        <DiscountForm />
      </SimpleForm>
    </Edit>
  );
};

export default DiscountEdit;
