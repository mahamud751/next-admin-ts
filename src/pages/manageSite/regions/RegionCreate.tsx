import { FC } from "react";
import { Create, CreateProps, SimpleForm, TransformData } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import RegionForm from "@/components/manageSite/regions/RegionForm";

const RegionCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Region Create");

  const transform: TransformData = ({ regionType, ...rest }) => ({
    ...rest,
    rt: regionType?.map((rt_name) => ({ rt_name })),
  });

  return (
    <Create {...props} transform={transform} redirect="list">
      <SimpleForm>
        <RegionForm />
      </SimpleForm>
    </Create>
  );
};

export default RegionCreate;
