import { TableCell, TableHead, TableRow } from "@mui/material";
type Props = {};

export default function ViewDetailsTableHeader({}: Props) {
  const tableHeading = [
    "S/L",
    "REFID",
    "Arogga Invoice No",
    "Product Price",
    "Shipping Price",
    "Payable amount",
    "Collected Amount (Cod)",
    // "New Collected Amount (Cod)",
    "Payment Date",
    "Updated received amount",
    "Settlement remark",
    "Settlement Status",
    "Comment",
    "Linked Collection ID",
    "Attachment",
    "Action",
  ];
  return (
    <TableHead>
      <TableRow>
        {tableHeading?.map((d: any) => (
          <TableCell key={d}>{d}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
