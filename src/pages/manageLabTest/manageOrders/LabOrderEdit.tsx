import { FC } from "react";
import { Edit, EditProps, FormTab, TabbedForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import {
  OrderDetailsTab,
  OrderHistoryTab,
  PatientsTab,
  RefundOrderTab,
  StatusTab,
  UserTab,
} from "./tabs";
import ModifyOrderTab from "./tabs/ModifyOrderTab";

const LabOrderEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Lab Order | Edit");
  return (
    <Edit {...rest} mutationMode="pessimistic">
      <TabbedForm toolbar={null} defaultValues={3}>
        <FormTab label="User">
          <UserTab permissions={permissions} />
        </FormTab>
        {/* <FormTab label="Order">
          <OrderDetailsTab />
        </FormTab>
        <FormTab label="Patients">
          <PatientsTab />
        </FormTab>
        <FormTab label="Status">
          <StatusTab />
        </FormTab>
        <FormTab label="History">
          <OrderHistoryTab />
        </FormTab>
        <FormTab label="Modify Order">
          <ModifyOrderTab />
        </FormTab>
        <FormTab label="Payment History">
          <RefundOrderTab />
        </FormTab> */}
      </TabbedForm>
    </Edit>
  );
};

export default LabOrderEdit;
