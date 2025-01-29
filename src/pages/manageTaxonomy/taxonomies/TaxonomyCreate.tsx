import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import TaxonomyForm from "./TaxonomyForm";

const TaxonomyCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Taxonomy Term Create");

  const vocabularyId = +props?.location?.search?.split("=")[1]?.split("/")[0];

  return (
    <Create {...props}>
      <SimpleForm
        // redirect="list"
        initialValues={{
          t_v_id: vocabularyId,
        }}
      >
        <TaxonomyForm />
      </SimpleForm>
    </Create>
  );
};

export default TaxonomyCreate;
