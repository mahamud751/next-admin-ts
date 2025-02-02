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
} from "@mui/material";
import { SetStateAction, useState } from "react";
import { useEditContext } from "react-admin";

import { useRequest } from "@/hooks";
import { getFormattedDate } from "@/utils/helpers";

const LabTestHistoryTab = () => {
  const { record } = useEditContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: Order, total } = useRequest(
    `/misc/api/v1/admin/lab-items/history?page=${
      currentPage + 1
    }&limit=${rowsPerPage}&itemId=${record.id}`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );
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
      {Order?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Mobile</TableCell>
                <TableCell align="left">Cretaed At</TableCell>
                <TableCell align="left">Action</TableCell>
                <TableCell align="left">Data From</TableCell>
                <TableCell align="left">Data To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Order?.map((row) => {
                const modifiedAction = row.action
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase());
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row?.updatedBy?.name} ( {row?.updatedBy?.id} )
                    </TableCell>
                    <TableCell align="left">{row?.updatedBy?.email}</TableCell>
                    <TableCell align="left">
                      {row?.updatedBy?.mobileNumber}
                    </TableCell>
                    <TableCell align="left">
                      {getFormattedDate(row.createdAt)}
                    </TableCell>
                    <TableCell align="left">{modifiedAction}</TableCell>
                    <TableCell align="left">{row.dataFrom}</TableCell>
                    <TableCell align="left">{row.dataTo}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/* @ts-ignore */}
                <TablePagination
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

export default LabTestHistoryTab;
