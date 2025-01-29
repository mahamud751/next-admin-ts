import { FC } from "react";
import { Edit, EditProps, FormTab, TabbedForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import VendorUpdate from "./tabs/VendorUpdate";
// import BranchDetails from "./tabs/BranchDetails";
// import CoverageDetails from "./tabs/CoverageDetails";
// import TestDetails from "./tabs/TestDetails";

const LabVendorEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga |Lab Test |Vendor Edit");

  return (
    <Edit {...rest} mutationMode="pessimistic">
      <TabbedForm toolbar={null}>
        <FormTab label="Update Vendor">
          <VendorUpdate />
        </FormTab>
        {/* <FormTab label="Branch Details">
                    <BranchDetails permissions={permissions} />
                </FormTab>
                <FormTab label="Test Details">
                    <TestDetails permissions={permissions} />
                </FormTab>
                <FormTab label="Coverage Details">
                    <CoverageDetails permissions={permissions} />
                </FormTab> */}
      </TabbedForm>
    </Edit>
  );
};

export default LabVendorEdit;
