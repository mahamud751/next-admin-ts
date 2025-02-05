import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import CSVReader from "./CSVReader";
import LedgerMultipleEntryForm from "./LedgerMultipleEntryForm";
import LedgerMultipleEntryTable from "./LedgerMultipleEntryTable";

const LedgerMultipleEntry = ({ pathname }) => {
  const { getValues } = useFormContext();
  const values = getValues();

  const [dataSource, setDataSource] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const formattedDataSource = dataSource?.map((item) => ({
    l_type: item.deposits > 0 ? "input" : "Meals and Entertainment",
    l_reason: `${item.description} (Date: ${item.transaction_date})`,
    l_amount: item.deposits > 0 ? item.deposits : `-${item.withdrawal}`,
  }));

  useEffect(() => {
    formattedDataSource?.length > 0 &&
      setAllItems((prevState) => [...prevState, ...formattedDataSource]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  values.pathname = pathname;
  values.multipleEntry = allItems;

  return (
    <>
      <CSVReader setDataSource={setDataSource} />
      <Box my={3}>
        <LedgerMultipleEntryForm setAllItems={setAllItems} />
      </Box>
      <LedgerMultipleEntryTable allItems={allItems} setAllItems={setAllItems} />
    </>
  );
};

export default LedgerMultipleEntry;
