import { FC, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import ExpensesForm from "./ExpensesForm";
import ExpensesTable from "./ExpensesTable";

type ExpensesProps = {
  page: "create" | "edit";
};

const Expenses: FC<ExpensesProps> = ({ page }) => {
  const { values } = useWatch();

  const { data, refetch } = useRequest(
    `/v1/expenses?ids=${values?.b_details?.expense_ids}`,
    {},
    {
      isPreFetching: values?.b_details?.expense_ids?.length,
    }
  );

  let defaultItems;

  if (page === "create") {
    defaultItems = [];
  } else {
    if (data?.length) {
      defaultItems = [...data];
    } else {
      defaultItems = [];
    }
  }

  const [allItems, setAllItems] = useState(defaultItems);

  useEffect(() => {
    if (data?.length) {
      setAllItems((prevState) => [...prevState, ...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length]);

  values.expenses_new = allItems;
  values.total_expenses =
    (!!allItems?.length &&
      allItems.reduce(
        (prevValue, currentValue) =>
          prevValue + Math.abs(currentValue?.l_amount) * 1,
        0
      )) ||
    0;

  const choices = [
    {
      id: "IT & Telecomunication Expenses",
      name: "IT & Telecomunication Expenses",
    },
    {
      id: "Meals and Entertainment",
      name: "Meals and Entertainment",
    },
    {
      id: "Office Supplies",
      name: "Office Supplies",
    },
    {
      id: "Donation and Subscription",
      name: "Donation and Subscription",
    },
    {
      id: "Travel, Conveyance and Accommodation Expenses",
      name: "Travel, Conveyance and Accommodation Expenses",
    },
    {
      id: "Utilities and Service Charges",
      name: "Utilities and Service Charges",
    },
    {
      id: "Legal Fees",
      name: "Legal Fees",
    },
    {
      id: "Advertising Expense",
      name: "Advertising Expense",
    },
    { id: "Other Debit", name: "Other Debit" },
  ];

  return (
    <>
      <ExpensesForm choices={choices} setAllItems={setAllItems} />
      <ExpensesTable
        page={page}
        choices={choices}
        refresh={refetch}
        allItems={allItems}
        setAllItems={setAllItems}
      />
    </>
  );
};

export default Expenses;
