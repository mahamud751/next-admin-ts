import { FC } from "react";
import { Create, CreateProps, SimpleForm, TransformData } from "react-admin";

import VendorForm from "../../../components/manageDatabase/vendors/VendorForm";
import { useDocumentTitle } from "../../../hooks";

const transform: TransformData = ({ v_email, ...rest }) => ({
  ...rest,
  v_email: v_email?.filter((item) => item?.value)?.map((item) => item?.value),
});

const VendorCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Vendor Create");

  return (
    <Create {...props} transform={transform} redirect="list">
      <SimpleForm
        initialValues={{
          v_email: [
            {
              value: "",
            },
          ],
        }}
      >
        <VendorForm />
      </SimpleForm>
    </Create>
  );
};

export default VendorCreate;
