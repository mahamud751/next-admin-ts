import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";
import ThreePlConfigCreateEdit from "@/components/manageDelivery/3plList/ThreePlListCreateEdit";
import { useDocumentTitle } from "@/hooks";

const ThreePlListCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | 3PL Config Create");
  return (
    <>
      <Create {...props} redirect="list">
        <SimpleForm>
          <ThreePlConfigCreateEdit page="create" />
        </SimpleForm>
      </Create>
    </>
  );
};

export default ThreePlListCreate;
