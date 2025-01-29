import { TableCell, TableHead, TableRow } from "@mui/material";

const TableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell>Sl No</TableCell>
      <TableCell>Name</TableCell>
      <TableCell>Variant</TableCell>
      <TableCell>Form</TableCell>
      <TableCell>Strength</TableCell>
      <TableCell>Qty</TableCell>
      <TableCell>Total Qty</TableCell>
      <TableCell>TP Price</TableCell>
      <TableCell>Vat</TableCell>
      <TableCell>Discount</TableCell>
      <TableCell style={{ whiteSpace: "nowrap" }}>Discount Fixed</TableCell>
      <TableCell style={{ whiteSpace: "nowrap" }}>
        Total Purchase Price
      </TableCell>
      <TableCell style={{ whiteSpace: "nowrap" }}>Total MRP</TableCell>
      <TableRow
        style={{
          whiteSpace: "nowrap",
          borderLeft: "1px solid rgb(234 235 236)",
          borderRight: "1px solid rgb(234 235 236)",
        }}
      >
        <TableRow>
          <TableCell colSpan={2}>Profit Percentage Summary</TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            colSpan={1}
            style={{
              borderRight: "1px solid rgb(234 235 236)",
              textAlign: "center",
            }}
          >
            B2C (%)
          </TableCell>
          <TableCell
            colSpan={1}
            style={{
              textAlign: "center",
            }}
          >
            B2B (%)
          </TableCell>
        </TableRow>
      </TableRow>
      <TableCell>Multiplier</TableCell>
      <TableCell>Batch*</TableCell>
      <TableCell>Expiry*</TableCell>
      <TableCell>Action</TableCell>
    </TableRow>
  </TableHead>
);

export default TableHeader;
