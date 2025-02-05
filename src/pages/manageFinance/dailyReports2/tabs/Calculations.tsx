import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const Calculations = ({ allCount }) => {
  const classes = useStyles();

  const {
    collection = 0,
    purchase = 0,
    salary = 0,
    loan = 0,
    expense = 0,
  } = allCount || {};

  return (
    <TableContainer>
      <Table size="small" className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell>Total Collection</TableCell>
            <TableCell align="right">{collection}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Purchase</TableCell>
            <TableCell align="right">- {purchase}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Salary</TableCell>
            <TableCell align="right">- {salary}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Loan</TableCell>
            <TableCell align="right">- {loan}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Expense</TableCell>
            <TableCell align="right">- {expense}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Calculations;

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});
