import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import VariantForm from "@/components/manageDatabase/variants/VariantForm";
import { useDocumentTitle } from "@/hooks";

const VariantCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Variant Create");

  return (
    <Create
      {...rest}
      redirect="list"
      defaultValue={{
        //@ts-ignore
        vt_config: [
          {
            name: "",
            weight: "",
            status: 0,
          },
        ],
      }}
    >
      <SimpleForm>
        <VariantForm />
      </SimpleForm>
    </Create>
  );
};

export default VariantCreate;
