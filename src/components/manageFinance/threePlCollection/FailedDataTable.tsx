import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

type Props = {
  data: any;
};

export default function FailedDataTable({ data }: Props) {
  const tableHeading = [
    "S/L",
    "REFID",
    "Invoice No",
    "Product Price",
    "Shipping Price",
    "Collected Amount (Cod)",
    "Payment Date",
    "Case",
  ];

  return (
    <div>
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Wrong Data List</h4>
          {/* <Button label="Export" variant="outlined" onClick={handleExport} /> */}
        </div>

        <Table stickyHeader aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              {tableHeading?.map((d: any) => (
                <TableCell>{d}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any, idx: any) => (
              <TableRow key={row.refid}>
                <TableCell component="th" scope="row">
                  {idx + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.tcd_ref_id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.tcd_invoice_no}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.tcd_product_price}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.tcd_shipping_price}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.tcd_collected_amount_cod}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.tcd_payment_date}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.case}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    </div>
  );
}
