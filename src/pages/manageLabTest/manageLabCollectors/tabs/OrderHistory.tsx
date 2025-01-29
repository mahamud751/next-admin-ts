import {
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";

import { SetStateAction, useState } from "react";
import { DateInput, SelectInput, useEditContext } from "react-admin";

import { useRequest } from "../../../../hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getColorByStatus,
  getFormattedDate,
} from "../../../../utils/helpers";

const OrderHistory = () => {
  const { record } = useEditContext();
  const [searchAll, setSearchAll] = useState();
  const [filterStatus, setFilterStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [numberFilter, setNumberFilter] = useState();
  const [dateFilter, setDateFilter] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    data: Order,
    total,
    refetch,
  } = useRequest(
    `/lab-order/api/v1/admin/orders?page=${
      currentPage + 1
    }&limit=${rowsPerPage}&collectorUqid=${record?.id}&${
      dateFilter ? `orderedAt=${dateFilter}` : ""
    }&${
      numberFilter ? `orderNumberPrefix=${numberFilter}` : ""
    }&paymentStatus=${paymentStatus}&filterStatus=${filterStatus}&${
      searchAll ? `search=${searchAll}` : ""
    }`,
    { method: "GET" },
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );
  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
    refetch();
  };
  const handlePaymentStatusChange = (event) => {
    setPaymentStatus(event.target.value);
    refetch();
  };
  const handleNumberFilter = (event) => {
    const newValue = event.target.value;
    setNumberFilter(event.target.value);
    if (newValue.length >= 4) {
      refetch();
    }
  };
  const handleDateFilter = (event) => {
    setDateFilter(event.target.value);
    refetch();
  };
  const handleAllSearch = (event) => {
    setSearchAll(event.target.value);
    refetch();
  };
  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };
  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <TextField
          id="standard-basic"
          label="Search"
          onChange={handleAllSearch}
          value={searchAll}
        />

        <SelectInput
          variant="outlined"
          label="Payment Status"
          source="paymentStatus"
          choices={[
            { id: "", name: "All" },
            { id: "paid", name: "Paid" },
            { id: "unpaid", name: "Unpaid" },
          ]}
          onChange={handlePaymentStatusChange}
          value={paymentStatus}
          style={{ marginLeft: "20px", marginRight: "20px" }}
          alwaysOn
        />
        <SelectInput
          variant="outlined"
          label="Filter Status"
          source="filterStatus"
          choices={[
            { id: "all", name: "All" },
            { id: "pending", name: "Pending" },
            { id: "active", name: "Active" },
            { id: "completed", name: "Completed" },
            { id: "cancelled", name: "Cancelled" },
            { id: "today", name: "Today" },
            { id: "upcoming", name: "Upcoming" },
          ]}
          onChange={handleFilterStatusChange}
          value={filterStatus}
          alwaysOn
        />
        <DateInput
          source="createdAt"
          label="Ordered At"
          variant="outlined"
          value={dateFilter}
          onChange={handleDateFilter}
          style={{ marginLeft: "20px", marginRight: "20px" }}
          resettable
          alwaysOn
        />
        <TextField
          id="standard-basic"
          label="Order ID Last 4 Digit"
          value={numberFilter}
          onChange={handleNumberFilter}
        />
      </div>
      {Order?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Oreders ID#</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Mobile</TableCell>
                <TableCell align="left">Create Date & Time</TableCell>
                <TableCell align="left">Schedule</TableCell>
                <TableCell align="left">Count</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="left">Pay Status</TableCell>
                <TableCell align="left">Zone</TableCell>
                <TableCell align="center">Assigned</TableCell>
                <TableCell align="center">Order Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Order?.map((row, index) => {
                const color = getColorByStatus(row?.orderStatus);
                return (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.orderNumber}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.mobileNumber}</TableCell>
                    <TableCell align="left">
                      {getFormattedDate(row.createdAt)}
                    </TableCell>
                    <TableCell align="left">
                      {row.formattedScheduleDate}
                      <br />
                      {row.scheduleTimeRange.en}
                    </TableCell>
                    <TableCell align="left">{row.testCount}</TableCell>
                    <TableCell align="left">{row.totalAmount}</TableCell>
                    <TableCell align="center">
                      <div
                        style={{
                          width: 93,
                          backgroundColor:
                            (row?.paymentStatus === "paid"
                              ? "#4CAF50"
                              : "#FFB547") + "10",
                          color:
                            row?.paymentStatus === "unpaid"
                              ? "#ff4949"
                              : "#008000",
                          borderRadius: 42,
                          textAlign: "center",
                          paddingTop: 5,
                          paddingBottom: 5,
                        }}
                      >
                        {capitalizeFirstLetterOfEachWord(row?.paymentStatus)}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      {row?.userLocation?.zone}
                    </TableCell>
                    <TableCell align="left">{row?.assignedTo?.name}</TableCell>

                    <TableCell align="center">
                      <div
                        style={{
                          width: 93,
                          backgroundColor: color,
                          color: "#FFFFFF",
                          borderRadius: 42,
                          textAlign: "center",
                          paddingTop: 5,
                          paddingBottom: 5,
                        }}
                      >
                        {capitalizeFirstLetterOfEachWord(row.orderStatus)}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/* @ts-ignore */}
                <TablePagination
                  style={{ width: "100%" }}
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <Grid
          style={{
            borderBottom: "1px solid #E0E0E0",
            paddingTop: 20,
            paddingBottom: 20,
          }}
          container
          spacing={1}
        >
          <Grid alignItems="center" item md={2} container>
            <Typography variant="body2" color="textSecondary">
              No Record Found
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default OrderHistory;
