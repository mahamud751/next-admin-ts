import { FC } from "react";
import { useLocation } from "react-router-dom";
import { Create, CreateProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import TaxonomyForm from "./TaxonomyForm";

const TaxonomyCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Taxonomy Term Create");
  const location = useLocation();
  const vocabularyId = +location.search?.split("=")[1]?.split("/")[0];

  return (
    <Create
      {...props}
      redirect="list"
      defaultValue={{
        t_v_id: vocabularyId,
      }}
    >
      <SimpleForm>
        <TaxonomyForm />
      </SimpleForm>
    </Create>
  );
};

export default TaxonomyCreate;
