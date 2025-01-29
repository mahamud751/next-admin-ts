import { FC } from "react";
import { Edit, EditProps, FormTab, TabbedForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { Locations, OrderHistory, UserTab } from "./tabs";

const LabCollectorsEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Collectors Edit");
  return (
    <Edit {...rest}>
      <TabbedForm toolbar={null}>
        <FormTab label="User">
          <UserTab />
        </FormTab>
        <FormTab label="Order History">
          <OrderHistory />
        </FormTab>
        <FormTab label="Assigned Locations ">
          <Locations permissions={permissions} />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

export default LabCollectorsEdit;
