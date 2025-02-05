import { FC, useEffect, useState } from "react";
import {
  Edit,
  EditProps,
  FormTab,
  SaveButton,
  TabbedForm,
  Toolbar,
} from "react-admin";
import { useWatch, useFormContext } from "react-hook-form";

import Calculations from "@/components/manageFinance/dailyReports/Calculations";
import CollectionsPurchases from "@/components/manageFinance/dailyReports/CollectionsPurchases";
import Expenses from "@/components/manageFinance/dailyReports/Expenses";
import Loans from "@/components/manageFinance/dailyReports/Loans";
import Salaries from "@/components/manageFinance/dailyReports/Salaries";
import { useDocumentTitle, useRequest } from "@/hooks";

const DailyReportEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Daily Report Edit");

  const [formValues, setFormValues] = useState<any>([]);
  const { data: collectionData, refetch: refetchCollection } = useRequest(
    `/v1/ledger?ids=${formValues?.collection_ids}`
  );

  const { data: collectionDataByCCIDS, refetch: refetchCollectionByCCIDS } =
    useRequest(`/v1/cashCollection?ids=${formValues?.cc_ids}`);

  const { data: purchaseData, refetch: refetchPurchase } = useRequest(
    `/v1/ledger?ids=${formValues?.purchase_ids}`
  );

  const { data: purchaseDataByPPIDS, refetch: refetchPurchaseByPPIDS } =
    useRequest(`/v1/productPurchase?ids=${formValues?.pp_ids}`);

  const { data: salaryData, refetch: refetchSalary } = useRequest(
    `/v1/salary?ids=${formValues?.es_ids}`
  );

  const { data: loanData, refetch: refetchLoan } = useRequest(
    `/v1/employeeLoan?ids=${formValues?.el_ids}`
  );

  useEffect(() => {
    if (formValues?.collection_ids?.length) refetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.collection_ids?.length]);

  useEffect(() => {
    if (!formValues?.collection_ids?.length && formValues?.cc_ids?.length)
      refetchCollectionByCCIDS();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.collection_ids?.length, formValues?.cc_ids?.length]);

  useEffect(() => {
    if (formValues?.purchase_ids?.length) refetchPurchase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.purchase_ids?.length]);

  useEffect(() => {
    if (!formValues?.purchase_ids?.length && formValues?.pp_ids?.length)
      refetchPurchaseByPPIDS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.purchase_ids?.length, formValues?.pp_ids?.length]);

  useEffect(() => {
    if (formValues?.es_ids?.length) refetchSalary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.es_ids?.length]);
  useEffect(() => {
    if (formValues?.el_ids?.length) refetchLoan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.el_ids?.length]);

  const CollectionsTab = () => {
    const { values } = useWatch();

    values.total_collections = values?.b_details?.total_collections || 0;
    values.b_collections_deposited = values?.b_details?.total_collections || 0;

    return (
      <CollectionsPurchases
        tab="collections"
        data={collectionData}
        collectionDataByCCIDS={collectionDataByCCIDS}
      />
    );
  };
  const WatchFormValues = ({ setFormValues }) => {
    const { control } = useFormContext();
    const values = useWatch({ control });

    useEffect(() => {
      setFormValues(values?.b_details);
    }, [values?.b_details, setFormValues]);

    return null; // No UI rendering needed
  };

  const PurchasesTab = () => {
    const { values } = useWatch();

    values.total_purchases = values?.b_details?.total_purchases || 0;

    return (
      <CollectionsPurchases
        tab="purchases"
        data={purchaseData}
        purchaseDataByPPIDS={purchaseDataByPPIDS}
      />
    );
  };

  const SalariesTab = () => {
    const { values } = useWatch();

    values.total_salaries = values?.b_details?.total_salaries || 0;

    return <Salaries data={salaryData} />;
  };
  const LoansTab = () => {
    const { values } = useWatch();
    values.total_loans = values?.b_details?.total_loans || 0;
    return <Loans data={loanData} />;
  };
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton alwaysEnable />
    </Toolbar>
  );
  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
      redirect="list"
    >
      <TabbedForm toolbar={<CustomToolbar />}>
        <FormTab label="Collections">
          <CollectionsTab />
        </FormTab>
        <FormTab label="Purchases">
          <PurchasesTab />
        </FormTab>
        <FormTab label="Salaries">
          <SalariesTab />
        </FormTab>
        <FormTab label="Loans">
          <LoansTab />
        </FormTab>
        <FormTab label="Expenses">
          <Expenses page="edit" />
        </FormTab>
        <FormTab label="Calculations">
          <Calculations page="edit" />
        </FormTab>
        <WatchFormValues setFormValues={setFormValues} />
      </TabbedForm>
    </Edit>
  );
};

export default DailyReportEdit;
