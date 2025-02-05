import {
  createTheme,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle as MuiDialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  data: any;
  open: boolean;
  onClose: () => void;
};

export default function DetailsViewDialog({ data, open, onClose }: Props) {
  const cs = useStyles();
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xl"}
      open={open}
      onClose={onClose}
      aria-labelledby="max-dialog-title"
    >
      <DialogContent>
        <MuiDialogTitle className={cs.dialogTitle}>
          <Typography variant="h6">{"List of Invoice"}</Typography>
          <IconButton className={cs.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>

        <div className={cs.heading}>
          <div>
            <p className={cs.summary}> Total Amount: {data?.tc_amount} </p>
            <p className={cs.summary}>
              Total Invoice: {data?.tc_data?.length}{" "}
            </p>
          </div>
        </div>

        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>S/L</TableCell>
              <TableCell>REFID</TableCell>
              <TableCell>Invoice No</TableCell>
              <TableCell>Product Price</TableCell>
              <TableCell>Shipping Price</TableCell>
              <TableCell>Collected Amount (Cod)</TableCell>
              <TableCell>Payment Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data?.tc_data?.map((row: any, index: any) => (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.refid}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.invoiceNo}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.productPrice}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.shippingPrice}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.collectedAmountCod}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.paymentDate}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
const theme = createTheme();
const useStyles = makeStyles(() => ({
  heading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[700],
  },

  summary: {
    fontWeight: 700,
    fontSize: "14px",
    color: "#333",
  },
}));
