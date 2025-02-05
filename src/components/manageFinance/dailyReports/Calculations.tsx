import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC } from "react";
import { NumberInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { toFixedNumber } from "@/utils/helpers";

type CalculationsProps = {
  page: "create" | "edit";
  lastDayData?: any;
  totalCollections?: number;
  totalPurchases?: number;
  record?: any;
};

const Calculations: FC<CalculationsProps> = ({
  page,
  lastDayData,
  totalCollections = 0,
  totalPurchases = 0,
  record,
}) => {
  const classes = useStyles();
  const { values } = useWatch();

  let lastDay: number;
  let cashInHand: number;

  if (page === "create") {
    lastDay = toFixedNumber(lastDayData?.b_balance);
    cashInHand =
      lastDay +
      toFixedNumber(values.b_received) +
      totalCollections -
      totalCollections -
      totalPurchases -
      values.total_salaries -
      values.total_loans -
      values.total_expenses;
  } else {
    lastDay = toFixedNumber(record?.b_details?.lastDay?.b_balance);
    cashInHand =
      lastDay +
      toFixedNumber(values.b_received) +
      values.total_collections -
      values.total_collections -
      values.total_purchases -
      values.total_salaries -
      values.total_loans -
      values.total_expenses;
  }

  values.final_balance = cashInHand || 0;

  return (
    <TableContainer>
      <Table size="small" className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell>Balance from previous date</TableCell>
            <TableCell align="right">{lastDay}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Received from arogga account</TableCell>
            <TableCell align="right">
              <NumberInput
                source="b_received"
                label="Amount"
                variant="outlined"
                helperText={false}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Collection</TableCell>
            <TableCell align="right">
              {page === "create" ? totalCollections : values.total_collections}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes["MuiTableCell-root"]}>
              Total Collection Deposit To Bank
            </TableCell>
            <TableCell className={classes["MuiTableCell-root"]} align="right">
              {" "}
              -&nbsp;
              {page === "create" ? totalCollections : values.total_collections}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Purchase</TableCell>
            <TableCell align="right">
              {" "}
              -&nbsp;
              {page === "create" ? totalPurchases : values.total_purchases}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Salary</TableCell>
            <TableCell align="right">
              {" "}
              -&nbsp;
              {toFixedNumber(values.total_salaries)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Loan</TableCell>
            <TableCell align="right">
              {" "}
              -&nbsp;
              {toFixedNumber(values.total_loans)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Expense</TableCell>
            <TableCell align="right">
              {" "}
              -&nbsp;
              {toFixedNumber(values.total_expenses)}
            </TableCell>
          </TableRow>
          <TableRow className={classes["MuiTableRow-root"]}>
            <TableCell className={classes["MuiTableCell-root"]}>
              Cash In Hand
            </TableCell>
            <TableCell align="right" className={classes["MuiTableCell-root"]}>
              {toFixedNumber(values.final_balance)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
  "MuiTableRow-root": {
    backgroundColor: "#A6C789",
  },
  "MuiTableCell-root": {
    fontWeight: "bold",
  },
});

export default Calculations;
