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

const Salaries = ({ data }) => {
  const classes = useStyles();
  const { values } = useWatch();

  const { data: employeeData, refetch } = useRequest(
    `/v1/employee?ids=${data?.map((item) => item.s_employee_id)}`
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
              <TableCell>Employee</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Net Payable</TableCell>
              <TableCell>Payment Mode</TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {!!data?.length &&
            data.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.s_id}</TableCell>
                <TableCell>
                  <Link to={`/v1/employee/${item.s_employee_id}`}>
                    {employeeName(item.s_employee_id)}
                  </Link>
                </TableCell>
                <TableCell>{item.s_year}</TableCell>
                <TableCell>{item.s_month}</TableCell>
                <TableCell>{item.s_net_payable}</TableCell>
                <TableCell>{item.s_payment_mode}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Footer title="Total Salary" amount={values.total_salaries} />
    </TableContainer>
  );
};

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});

export default Salaries;
