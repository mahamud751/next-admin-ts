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

import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import TotalAmount from "../TotalAmount";
import AroggaProgress from "@/components/common/AroggaProgress";
import NoDataFound from "@/components/common/NoDataFound";

const Salaries = ({ isLoading, count, data }) => {
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
              <TableCell>Employee</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Month</TableCell>
              <TableCell align="right">Net Payable</TableCell>
              <TableCell>Payment Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.s_id}</TableCell>
                <TableCell>
                  <ReferenceField
                    source="s_employee_id"
                    reference="v1/employee"
                    link="show"
                    record={item}
                  >
                    <TextField source="e_name" />
                  </ReferenceField>
                </TableCell>
                <TableCell>{item.s_year}</TableCell>
                <TableCell>{item.s_month}</TableCell>
                <TableCell align="right">{item.s_net_payable}</TableCell>
                <TableCell>
                  {capitalizeFirstLetterOfEachWord(item.s_payment_mode)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TotalAmount title="Total Salary" amount={count} />
    </>
  );
};

export default Salaries;

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});
