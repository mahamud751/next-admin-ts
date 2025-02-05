import { Button } from "@mui/material";
import { useState } from "react";
import {
  Datagrid,
  FunctionField,
  NumberField,
  Pagination,
  ReferenceManyField,
  SimpleForm,
  TextField,
} from "react-admin";

import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";
import WithdrawDialog from "@/components/manageUser/users/WithdrawDialog";

const TransactionHistory = () => {
  const classes = useAroggaStyles();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [record, setRecord] = useState({});

  const handleOnWithdraw = (data) => {
    setRecord(data);
    setIsDialogOpen(true);
  };

  return (
    <>
      <ReferenceManyField
        reference="v1/userTransaction"
        target="_u_id"
        pagination={<Pagination />}
        sort={{ field: "ut_id", order: "DESC" }}
      >
        <Datagrid>
          <TextField source="ut_id" label="ID" />
          <AroggaDateField source="ut_created_at" label="Date" />
          <TextField source="ut_title" label="Title" />
          <TextField source="ut_details" label="Details" />
          <NumberField source="ut_amount" label="Amount" />
          <NumberField source="ut_cash_amount" label="Cash Amount" />
          <NumberField source="ut_bonus_amount" label="Bonus Amount" />
          <NumberField source="ut_balance" label="Balance" />
          <NumberField source="ut_cash_balance" label="Cash Balance" />
          <NumberField source="ut_bonus_balance" label="Bonus Balance" />
          <TextField
            source="ut_status"
            label="Status"
            className={classes.capitalize}
          />
          <FunctionField
            label="Withdraw"
            render={(record) => {
              if (!record.ut_allow_withdraw) return;

              return (
                <Button
                  variant="contained"
                  onClick={() => handleOnWithdraw(record)}
                >
                  Withdraw
                </Button>
              );
            }}
          />
        </Datagrid>
      </ReferenceManyField>
      <SimpleForm toolbar={null}>
        <WithdrawDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          record={record}
        />
      </SimpleForm>
    </>
  );
};

export default TransactionHistory;
