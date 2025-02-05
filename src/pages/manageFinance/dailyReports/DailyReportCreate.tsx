import { FC, useEffect } from "react";
import {
  Create,
  CreateProps,
  FormTab,
  SaveButton,
  TabbedForm,
  Toolbar,
} from "react-admin";
import { useWatch } from "react-hook-form";

import Calculations from "@/components/manageFinance/dailyReports/Calculations";
import CollectionsPurchases from "@/components/manageFinance/dailyReports/CollectionsPurchases";
import Expenses from "@/components/manageFinance/dailyReports/Expenses";
import Loans from "@/components/manageFinance/dailyReports/Loans";
import RedxTab from "@/components/manageFinance/dailyReports/RedxTab";
import Salaries from "@/components/manageFinance/dailyReports/Salaries";
import { useDocumentTitle, useRequest } from "@/hooks";

const DailyReportCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Daily Report Create");

  const { data, isSuccess } = useRequest(
    "/v1/daily-report/today",
    {},
    { isPreFetching: true }
  );

  const { data: collectionData, refetch: refetchCollection } = useRequest(
    `/v1/ledger?ids=${data?.collection_ids}`
  );

  const { data: collectionDataByCCIDS, refetch: refetchCollectionByCCIDS } =
    useRequest(`/v1/cashCollection?ids=${data?.cc_ids}`);

  const { data: purchaseData, refetch: refetchPurchase } = useRequest(
    `/v1/ledger?ids=${data?.purchase_ids}`
  );

  const { data: purchaseDataByPPIDS, refetch: refetchPurchaseByPPIDS } =
    useRequest(`/v1/productPurchase?ids=${data?.pp_ids}`);

  const { data: salaryData, refetch: refetchSalary } = useRequest(
    `/v1/salary?ids=${data?.es_ids}`
  );
  const { data: loanData, refetch: refetchLoan } = useRequest(
    `/v1/employeeLoan?ids=${data?.el_ids}`
  );

  useEffect(() => {
    if (data?.collection_ids?.length) refetchCollection();
    if (!data?.collection_ids?.length && data?.cc_ids?.length)
      refetchCollectionByCCIDS();
    if (data?.purchase_ids?.length) refetchPurchase();
    if (!data?.purchase_ids?.length && data?.pp_ids?.length)
      refetchPurchaseByPPIDS();
    if (data?.es_ids?.length) refetchSalary();
    if (data?.el_ids?.length) refetchLoan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const CollectionsTab = () => {
    const { values } = useWatch();
    values.total_collections = data?.total_collections;
    values.b_collections_deposited = data?.total_collections;
    return (
      <CollectionsPurchases
        tab="collections"
        data={collectionData}
        collectionDataByCCIDS={collectionDataByCCIDS}
      />
    );
  };

  const PurchasesTab = () => {
    const { values } = useWatch();
    values.total_purchases = data?.total_purchases;
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
    values.total_salaries = data?.total_salaries;
    return <Salaries data={salaryData} />;
  };

  const LoansTab = () => {
    const { values } = useWatch();
    values.total_loans = data?.total_loans;
    return <Loans data={loanData} />;
  };
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton alwaysEnable />
    </Toolbar>
  );
  return (
    <Create {...rest} redirect="list">
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
          <Expenses page="create" />
        </FormTab>
        <FormTab label="Calculations">
          <Calculations
            page="create"
            lastDayData={data?.lastDay}
            totalCollections={data?.total_collections}
            totalPurchases={data?.total_purchases}
          />
        </FormTab>
        <FormTab label="Redx">
          <RedxTab />
        </FormTab>
      </TabbedForm>
    </Create>
  );
};

export default DailyReportCreate;
