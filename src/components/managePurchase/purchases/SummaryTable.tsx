import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useWatch } from "react-hook-form";
import { numberFormat, toFixedNumber } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

const SummaryTable = () => {
  const classes = useStyles();
  const aroggaClasses = useAroggaStyles();
  const values = useWatch();

  return (
    <TableContainer>
      <Table size="small" className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell>Total Item</TableCell>
            <TableCell align="right">{values?.ppi?.length}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total TP</TableCell>
            <TableCell
              align="right"
              className={
                values.pp_total_purchase_price !== values.totalItemTPPrice
                  ? classes.textRed
                  : ""
              }
            >
              {numberFormat(toFixedNumber(values.pp_total_purchase_price))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Vat</TableCell>
            <TableCell
              align="right"
              className={
                (values.pp_total_vat || 0) !== values.totalItemVat
                  ? classes.textRed
                  : ""
              }
            >
              {numberFormat(toFixedNumber(values.pp_total_vat)) || 0}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Discount</TableCell>
            <TableCell
              align="right"
              className={
                (values.pp_total_discount || 0) - (values.pp_round || 0) !==
                values.totalItemDiscount
                  ? classes.textRed
                  : ""
              }
            >
              {numberFormat(
                toFixedNumber(
                  (values.pp_total_discount || 0) - (values.pp_round || 0)
                )
              ) || 0}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={aroggaClasses.fontBold}>
              Amount Payable
            </TableCell>
            <TableCell
              align="right"
              style={{
                fontWeight: "bold",
                color:
                  values.pp_inv_price !== values.totalItemPurchasePrice
                    ? "#EF1962"
                    : "",
              }}
            >
              {numberFormat(toFixedNumber(values.pp_inv_price, 2))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SummaryTable;

const useStyles = makeStyles({
  textRed: {
    color: "#EF1962",
  },
  table: {
    width: 350,
    margin: "auto",
  },
});
