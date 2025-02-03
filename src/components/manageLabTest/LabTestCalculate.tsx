import { makeStyles } from "@mui/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const LabTestCalculate = ({ calculate }) => {
  const classes = useStyles();
  return (
    <div>
      <TableContainer>
        <Table size="small" className={classes.table} align="center">
          <TableBody>
            <TableRow>
              <TableCell>Subtotal</TableCell>
              <TableCell align="right">{calculate.subtotalAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Discount Applied</TableCell>
              <TableCell align="right">{calculate.discountAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Arogga Cash</TableCell>
              <TableCell align="right">{calculate.cash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rounding Off</TableCell>
              <TableCell align="right">{calculate.roundingOff}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sample Collection Conveyance</TableCell>
              <TableCell align="right">
                {calculate.collectionConveyance}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Delivery Conveyance</TableCell>
              <TableCell align="right">
                {calculate.hardCopyConveyance}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Total Amount</TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                {calculate.totalAmount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  table: {
    width: 362,
    marginTop: 20,
    marginBottom: 18,
  },
}));

export default LabTestCalculate;
