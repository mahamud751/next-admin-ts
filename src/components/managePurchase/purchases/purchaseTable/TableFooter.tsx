import { TableBody, TableCell, TableRow } from "@mui/material";
import { useWatch } from "react-hook-form";

import { numberFormat } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

const TableFooter = () => {
  const classes = useAroggaStyles();
  const values = useWatch();

  return (
    <TableBody>
      <TableRow>
        <TableCell className={classes.fontBold}>Total</TableCell>
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell className={classes.fontBold}>
          {numberFormat(values.totalItemTPPrice)}
        </TableCell>
        <TableCell className={classes.fontBold}>
          {numberFormat(values.totalItemVat)}
        </TableCell>
        <TableCell className={classes.fontBold}>
          {numberFormat(values.totalItemDiscount)}
        </TableCell>
        <TableCell></TableCell>
        <TableCell className={classes.fontBold}>
          {numberFormat(values.totalItemPurchasePrice)}
        </TableCell>
        <TableCell className={classes.fontBold}>
          {numberFormat(values.totalItemMRP)}
        </TableCell>
        <TableCell style={{ borderTop: "1px solid rgb(234 235 236)" }} />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
      </TableRow>
    </TableBody>
  );
};

export default TableFooter;
