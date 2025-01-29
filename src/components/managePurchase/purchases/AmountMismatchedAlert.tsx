import { makeStyles } from "@mui/styles";
import Alert from "@mui/material/Alert";

import { useWatch } from "react-hook-form";

const AmountMismatchedAlert = () => {
  const classes = useStyles();
  const values = useWatch();

  if (!values.isAmountMismatched) return;

  return (
    <Alert classes={{ root: classes.mismatchedWarning }} severity="warning">
      Amount mismatched!
    </Alert>
  );
};

const useStyles = makeStyles({
  mismatchedWarning: {
    width: 300,
    margin: "0 auto",
  },
});

export default AmountMismatchedAlert;
