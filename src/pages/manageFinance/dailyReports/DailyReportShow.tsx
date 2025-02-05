import { FC } from "react";
import { NumberField, Show, ShowProps, TextField } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import AroggaDateField from "@/components/common/AroggaDateField";

const DailyReportShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Daily Report Show");

  const classes = useAroggaStyles();

  return (
    <Show {...props}>
      <ColumnShowLayout>
        <NumberField source="b_id" label="Id" />
        <TextField source="b_collection" label="Collection" />
        <TextField
          source="b_collections_deposited"
          label="Total Collection Deposit To Bank"
        />
        <TextField source="b_purchase" label="Purchase" />
        <TextField source="b_expense" label="Expense" />
        <TextField source="b_balance" label="Cash In Hand" />
        <TextField source="b_l_balance" label="Ledger Balance" />
        <TextField
          source="b_l_b_approved"
          label="Ledger Balance When Approved"
        />
        <AroggaDateField source="b_date" label="Date" />
        <TextField
          source="b_status"
          label="Status"
          className={classes.capitalize}
        />
      </ColumnShowLayout>
    </Show>
  );
};

export default DailyReportShow;
