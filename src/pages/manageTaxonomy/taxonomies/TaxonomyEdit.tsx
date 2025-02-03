import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import TaxonomyForm from "./TaxonomyForm";

const TaxonomyEdit: FC<EditProps> = (props) => {
  useDocumentTitle("Arogga | Taxonomy Term Edit");

  return (
    <Edit
      mutationMode={
        process.env.NEXT_PUBLIC_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...props}
    >
      <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
        <TaxonomyForm />
      </SimpleForm>
    </Edit>
  );
};

export default TaxonomyEdit;
