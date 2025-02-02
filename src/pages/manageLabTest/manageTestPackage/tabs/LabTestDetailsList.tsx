import { SetStateAction, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEditContext } from "react-admin";
import { Link } from "react-router-dom";

import { useRequest } from "@/hooks";
import { getColorByStatus } from "@/utils/helpers";
import EditIcon from "@/components/icons/EditIcon";

const LabTestDetailsList = () => {
  const classes = useStyles();
  const { record } = useEditContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };
  const { data: Order, total } = useRequest(
    `/misc/api/v1/admin/lab-items/details?itemId=${record.id}&page=${
      currentPage + 1
    }&limit=${rowsPerPage}`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );
  const sortedData = Order?.sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <div>
      <Link
        to={`/misc/api/v1/admin/lab-items/addNew/${record?.id}`}
        style={{ textDecoration: "none" }}
      >
        <div className={classes.AddBtn}>
          <Box display="flex">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              className={classes.button}
            >
              Add New
            </Button>{" "}
          </Box>
        </div>
      </Link>

      {sortedData?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="left">Details Type</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row?.title?.en}
                  </TableCell>
                  <TableCell align="left">
                    <p className={classes.textCapitalize}>
                      {" "}
                      {row?.detailsType}
                    </p>
                  </TableCell>
                  <TableCell align="left">
                    <p
                      style={{
                        color: getColorByStatus(row?.status),
                        textTransform: "capitalize",
                      }}
                    >
                      {" "}
                      {row?.status}
                    </p>
                  </TableCell>
                  <TableCell align="left">
                    <Link
                      to={`/misc/api/v1/admin/lab-items/update/${record?.id}?recordId=${row?.id}`}
                    >
                      <Button>
                        <EditIcon />
                      </Button>{" "}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: 10,
    textTransform: "capitalize",
  },
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "end",
  },
  textCapitalize: {
    textTransform: "capitalize",
  },
}));

export default LabTestDetailsList;
