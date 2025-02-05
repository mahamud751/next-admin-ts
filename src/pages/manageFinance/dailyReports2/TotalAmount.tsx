import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC } from "react";

type TotalAmountProps = {
  title?: string;
  amount?: number;
};

const TotalAmount: FC<TotalAmountProps> = ({ title = "Total", amount = 0 }) => {
  const classes = useStyles();

  return (
    <Table size="small" className={classes.table}>
      <TableBody>
        <TableRow>
          <TableCell>{title}</TableCell>
          <TableCell>{amount}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TotalAmount;

const useStyles = makeStyles({
  table: {
    width: 250,
    marginTop: 20,
    margin: "auto",
  },
});
