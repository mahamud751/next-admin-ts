import { FC } from "react";
import { Edit, EditProps, FormTab, TabbedForm } from "react-admin";
import { useParams } from "react-router-dom";

import { useDocumentTitle, useRequest } from "@/hooks";
import {
  Faq,
  HomeBanner,
  LabTestDetails,
  LabTestDetailsList,
  LabTestHistoryTab,
  Test,
  VendorPrice,
} from "./tabs";

type Params = Record<string, string>;

const LabTestPckgEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Lab Test| Edit");
  const { id } = useParams<Params>();
  const { data: Order } = useRequest(
    `/misc/api/v1/admin/lab-items/${id}`,
    {},
    {
      isPreFetching: true,
      isSuccessNotify: false,
    }
  );

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
    >
      <TabbedForm toolbar={null}>
        <FormTab label="Details">
          <LabTestDetails />
        </FormTab>
        <FormTab label="Vendor Price">
          <VendorPrice />
        </FormTab>
        {Order?.itemType === "package" && (
          <FormTab label="Test">
            <Test />
          </FormTab>
        )}
        <FormTab label="History">
          <LabTestHistoryTab />
        </FormTab>
        <FormTab label="Details List">
          <LabTestDetailsList />
        </FormTab>
        <FormTab label="Faq">
          <Faq />
        </FormTab>
        <FormTab label="Home-Banner">
          <HomeBanner />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

export default LabTestPckgEdit;
