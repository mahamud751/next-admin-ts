import { Paper, TextField } from "@mui/material";
import { DateTime } from "luxon";
import queryString from "query-string";
import { useState } from "react";
import { FormTab, TabbedForm, Title } from "react-admin";

import { useDocumentTitle, useRequest } from "@/hooks";
import { numberFormat, toFixedNumber } from "@/utils/helpers";
import {
  Calculations,
  Collections,
  Expenses,
  Loans,
  Purchases,
  Salaries,
} from "./tabs";

const DailyReports2Page = () => {
  useDocumentTitle("Arogga | Daily Reports 2");

  const [filterByDate, setFilterByDate] = useState(
    DateTime.local().toFormat("yyyy-MM-dd")
  );
  const [allCount, setAllCount] = useState(null);

  const queryParamsString = queryString.stringify({
    _page: 1,
    _perPage: 100000,
    _start_date: `${filterByDate} 00:00:00`,
    // _end_date: `${DateTime.fromISO(filterByDate)
    //     .plus({ days: 0 })
    //     .toFormat("yyyy-MM-dd")} 23:59:59`,
    _end_date: `${filterByDate} 23:59:59`,
  });

  const { data: cashCollections, isLoading: isLoadingCashCollections } =
    useRequest(
      `/v1/cashCollection?${queryParamsString}`,
      {},
      {
        isPreFetching: true,
        refreshDeps: [filterByDate],
        onSuccess: ({ data }) => {
          const collection = numberFormat(
            toFixedNumber(getCount("cc_amount", data))
          );
          setAllCount((prev) => ({ ...prev, collection }));
        },
      }
    );

  const {
    data: productPurchases,
    isLoading: isLoadingProductPurchases,
    refetch: refetchProductPurchase,
  } = useRequest(
    `/v1/productPurchase?${queryString.stringify({
      _page: 1,
      _perPage: 100000,
      _paid_at_start: `${filterByDate} 00:00:00`,
      _paid_at_end: `${filterByDate} 23:59:59`,
    })}`,
    {},
    {
      isPreFetching: true,
      refreshDeps: [filterByDate],
      onSuccess: ({ data }) => {
        const purchase = numberFormat(
          toFixedNumber(getCount("pp_inv_price", data))
        );
        setAllCount((prev) => ({ ...prev, purchase }));
      },
    }
  );

  const { data: salaries, isLoading: isLoadingSalaries } = useRequest(
    `/v1/salary?${queryParamsString}`,
    {},
    {
      isPreFetching: true,
      refreshDeps: [filterByDate],
      onSuccess: ({ data }) => {
        const salary = numberFormat(
          toFixedNumber(getCount("s_net_payable", data))
        );
        setAllCount((prev) => ({ ...prev, salary }));
      },
    }
  );

  const { data: employeeLoans, isLoading: isLoadingEmployeeLoans } = useRequest(
    `/v1/employeeLoan?${queryParamsString}`,
    {},
    {
      isPreFetching: true,
      refreshDeps: [filterByDate],
      onSuccess: ({ data }) => {
        const loan = numberFormat(toFixedNumber(getCount("el_amount", data)));
        setAllCount((prev) => ({ ...prev, loan }));
      },
    }
  );

  const { data: expenseEntries, isLoading: isLoadingExpenseEntries } =
    useRequest(
      `/v1/expenseEntry?${queryParamsString}`,
      {},
      {
        isPreFetching: true,
        refreshDeps: [filterByDate],
        onSuccess: ({ data }) => {
          const expense = numberFormat(
            toFixedNumber(getCount("ee_expense_amount", data))
          );
          setAllCount((prev) => ({ ...prev, expense }));
        },
      }
    );

  const getCount = (key, data = []) => {
    return data?.reduce(
      (prevValue, currentValue) => prevValue + (+currentValue?.[key] || 0),
      0
    );
  };

  const handleChangeFilterByDate = (e) => {
    setFilterByDate(e.target.value);
  };

  return (
    <Paper style={{ marginTop: 25, padding: 20 }}>
      <Title title="Daily Reports 2" />
      <TextField
        label="Filter By Date"
        value={filterByDate}
        type="date"
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={handleChangeFilterByDate}
      />
      <TabbedForm syncWithLocation={false} toolbar={null}>
        <FormTab label="Collections">
          <Collections
            isLoading={isLoadingCashCollections}
            count={allCount?.collection}
            data={cashCollections}
          />
        </FormTab>
        <FormTab label="Purchases">
          <Purchases
            isLoading={isLoadingProductPurchases}
            count={allCount?.purchase}
            data={productPurchases}
            refresh={refetchProductPurchase}
          />
        </FormTab>
        <FormTab label="Salaries">
          <Salaries
            isLoading={isLoadingSalaries}
            count={allCount?.salary}
            data={salaries}
          />
        </FormTab>
        <FormTab label="Loans">
          <Loans
            isLoading={isLoadingEmployeeLoans}
            count={allCount?.loan}
            data={employeeLoans}
          />
        </FormTab>
        <FormTab label="Expenses">
          <Expenses
            isLoading={isLoadingExpenseEntries}
            count={allCount?.expense}
            data={expenseEntries}
          />
        </FormTab>
        <FormTab label="Calculations">
          <Calculations allCount={allCount} />
        </FormTab>
      </TabbedForm>
    </Paper>
  );
};

export default DailyReports2Page;
