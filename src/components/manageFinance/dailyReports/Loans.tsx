import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import { Link } from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import Footer from "./Footer";

const Loans = ({ data }) => {
  const classes = useStyles();
  const { values } = useWatch();

  const { data: employeeData, refetch } = useRequest(
    `/v1/employee?ids=${data?.map((item) => item.el_employee_id)}`
  );

  useEffect(() => {
    data?.length && refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const employeeName = (employeeId) => {
    const employee = employeeData?.find((data) => data.e_id === employeeId);
    return employee?.e_name || "";
  };

  return (
    <TableContainer>
      <Table size="small" className={classes.table}>
        {!!data?.length && (
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {!!data?.length &&
            data.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.el_id}</TableCell>
                <TableCell>{item.el_created_at}</TableCell>
                <TableCell>
                  <Link to={`/v1/employee/${item.el_employee_id}`}>
                    {employeeName(item.el_employee_id)}
                  </Link>
                </TableCell>
                <TableCell>{item.el_amount}</TableCell>
                <TableCell>{item.el_reason}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Footer title="Total Loan" amount={values.total_loans} />
    </TableContainer>
  );
};

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});

export default Loans;
