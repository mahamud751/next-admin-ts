import { FC } from "react";
import { Edit, EditProps, FormTab, TabbedForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { CartDetailsTab, UserTab } from "./tabs";

const LTCartEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Lab Cart | Edit");
  return (
    <Edit {...rest} mutationMode="pessimistic">
      <TabbedForm toolbar={null}>
        <FormTab label="User">
          <UserTab permissions={permissions} />
        </FormTab>
        <FormTab label="Cart Details">
          <CartDetailsTab />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

export default LTCartEdit;
