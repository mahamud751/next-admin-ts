import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useEffect, useRef, useState } from "react";
import { AutocompleteInput, NumberInput, TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";

type ExpensesFormProps = {
  choices: { id: string; name: string }[];
  setAllItems: (items) => void;
};

const ExpensesForm: FC<ExpensesFormProps> = ({ choices, setAllItems }) => {
  const classes = useStyles();
  const { getValues, setValue } = useFormContext();
  const values = getValues();

  const fieldRef1 = useRef<HTMLInputElement>(null!);
  const fieldRef2 = useRef<HTMLInputElement>(null!);
  const fieldRef3 = useRef<HTMLInputElement>(null!);

  const [ledgerType, setLedgerType] = useState("");

  const handleOnKeyDown = () => {
    const { l_type, l_a_uid, l_a_date, l_reason, l_amount } = values;

    setAllItems((prevState: object[]) => [
      {
        l_type,
        l_a_uid,
        l_a_date,
        l_reason,
        l_amount,
      },
      ...prevState,
    ]);

    setValue("l_type", undefined);
    l_a_uid && setValue("l_a_uid", undefined);
    setValue("l_reason", undefined);
    setValue("l_amount", undefined);

    setTimeout(() => {
      fieldRef1.current.focus();
    }, 1);
  };

  useEffect(() => {
    if (!ledgerType) return;

    fieldRef2.current?.focus();
  }, [ledgerType]);

  return (
    <div className={classes.root}>
      <div className={classes.form}>
        <Grid container spacing={2}>
          <Grid item md={2}>
            <AutocompleteInput
              source="l_type"
              label="Type"
              variant="outlined"
              helperText={false}
              //   options={{
              //     InputProps: { inputRef: fieldRef1 },
              //   }}
              onChange={(event, item) => setLedgerType((item as any)?.name)}
              choices={choices}
              fullWidth
            />
          </Grid>
          <Grid item lg={2}>
            <TextInput
              source="l_reason"
              label="Reason"
              variant="outlined"
              helperText={false}
              inputRef={fieldRef2}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setTimeout(() => {
                    fieldRef3.current.focus();
                  }, 1);
                }
              }}
              fullWidth
            />
          </Grid>
          <Grid item lg={2}>
            <NumberInput
              source="l_amount"
              label="Amount"
              variant="outlined"
              helperText={false}
              inputRef={fieldRef3}
              onKeyDown={(e: any) => {
                if (e.key === "Enter" && e.target.value) handleOnKeyDown();
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  form: {
    flexGrow: 8,
  },
});

export default ExpensesForm;
