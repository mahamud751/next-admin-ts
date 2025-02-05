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
import { ReferenceField, TextField } from "react-admin";

import { getFormattedDateString } from "@/utils/helpers";
import TotalAmount from "../TotalAmount";
import AroggaProgress from "@/components/common/AroggaProgress";
import NoDataFound from "@/components/common/NoDataFound";

const Loans = ({ isLoading, count, data }) => {
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
              <TableCell>ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.el_id}</TableCell>
                <TableCell>
                  {getFormattedDateString(item.el_created_at)}
                </TableCell>
                <TableCell>
                  <ReferenceField
                    source="el_employee_id"
                    reference="v1/employee"
                    link="show"
                    record={item}
                  >
                    <TextField source="e_name" />
                  </ReferenceField>
                </TableCell>
                <TableCell align="right">{item.el_amount}</TableCell>
                <TableCell>{item.el_reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TotalAmount title="Total Loan" amount={count} />
    </>
  );
};

export default Loans;

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});
