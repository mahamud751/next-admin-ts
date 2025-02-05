import { FC } from "react";
import { Edit, EditProps, SimpleForm, TransformData } from "react-admin";

import PolicyForm from "@/components/manageHR/policies/PolicyForm";
import { useDocumentTitle } from "@/hooks";

const transform: TransformData = ({ p_effective_date, ...rest }) => ({
  ...rest,
  p_effective_date: p_effective_date || "0000-00-00",
});

const PolicyEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Policy Edit");

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      transform={transform}
      {...rest}
      submitOnEnter={false}
    >
      <SimpleForm>
        <PolicyForm />
      </SimpleForm>
    </Edit>
  );
};

export default PolicyEdit;
