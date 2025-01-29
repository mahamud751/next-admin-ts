import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Grid,
  Typography,
} from "@mui/material";

import { FC, SetStateAction, useState } from "react";
import { ListProps, Title } from "react-admin";
import { Link } from "react-router-dom";

import { useRequest } from "../../../hooks";

const LabZoneList: FC<ListProps> = ({ permissions, ...rest }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: Order } = useRequest(
    `/v1/zones?page=${currentPage + 1}&limit=${rowsPerPage}&onlyMainZones=1`,
    { method: "GET" },
    {
      isBaseUrl: true,
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
    <div style={{ padding: 10, margin: "60px 0px" }}>
      <Title title="List of Lab Zones" />
      {Order?.zones?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Order?.zones?.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell component="th" align="left">
                      <Link
                        to={`/zone-main/${index}`}
                        style={{
                          textDecoration: "none",
                          color: "#000",
                        }}
                      >
                        {index}
                      </Link>
                    </TableCell>

                    <TableCell align="left">
                      <Link
                        to={`/zone-main/${index}`}
                        style={{
                          textDecoration: "none",
                          color: "#000",
                        }}
                      >
                        {row}
                      </Link>
                    </TableCell>
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
                  count={Order?.zones?.length}
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

export default LabZoneList;
