import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import VariantForm from "@/components/manageDatabase/variants/VariantForm";

const VariantEdit: FC<EditProps> = ({ hasEdit, ...rest }) => {
  useDocumentTitle("Arogga | Variant Edit");

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
      redirect="list"
    >
      <SimpleForm
        toolbar={
          <SaveDeleteToolbar
            isSave
            isDelete={rest.permissions?.includes("variantTypeDelete")}
          />
        }
      >
        <VariantForm />
      </SimpleForm>
    </Edit>
  );
};

export default VariantEdit;
