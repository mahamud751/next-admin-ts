import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FileField } from "react-admin";

import { getFormattedDateString } from "@/utils/helpers";
import TotalAmount from "../TotalAmount";
import AroggaProgress from "@/components/common/AroggaProgress";
import NoDataFound from "@/components/common/NoDataFound";

const Expenses = ({ isLoading, count, data }) => {
  const classes = useStyles();

  if (isLoading)
    return (
      <Box position="relative" pt={10} pb={10}>
        <AroggaProgress />
      </Box>
    );

  if (!data?.length) return <NoDataFound />;

  return (
    <>
      <TableContainer>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Sl No</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Approved At</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Related Files</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  {getFormattedDateString(item.ee_created_at)}
                </TableCell>
                <TableCell>
                  {getFormattedDateString(item.ee_approved_at)}
                </TableCell>
                <TableCell>{item.ee_expense_description}</TableCell>
                <TableCell align="right">{item.ee_expense_amount}</TableCell>
                <TableCell>
                  <FileField
                    source="attachedFiles_ee_attachment"
                    src="src"
                    title="title"
                    target="_blank"
                    record={item}
                    // @ts-ignore
                    multiple
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TotalAmount title="Total Expense" amount={count} />
    </>
  );
};

export default Expenses;

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});
