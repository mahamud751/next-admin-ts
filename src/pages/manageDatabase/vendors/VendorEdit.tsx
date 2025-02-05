import { FC } from "react";
import { Edit, EditProps, SimpleForm, TransformData } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import VendorForm from "@/components/manageDatabase/vendors/VendorForm";

const transform: TransformData = ({ v_email, ...rest }) => ({
  ...rest,
  v_email: v_email?.filter((item) => item?.value)?.map((item) => item?.value),
});

const VendorEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Vendor Edit");

  return (
    <Edit
      mutationMode={
        process.env.NEXT_PUBLIC_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      transform={transform}
      {...rest}
      redirect="list"
    >
      <SimpleForm
        toolbar={
          <SaveDeleteToolbar
            isSave
            isDelete={permissions?.includes("vendorDelete")}
          />
        }
      >
        <VendorForm />
      </SimpleForm>
    </Edit>
  );
};

export default VendorEdit;
