import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { SetStateAction, useState } from "react";
import { useRefresh } from "react-admin";

import { useRequest } from "@/hooks";
import ClearBtn from "../Button/ClearBtn";

const CollectorAssignModal = ({ handleDialogClose, qcId, zone }) => {
  const refresh = useRefresh();
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
  const UploadFile = ({
    id,
    handleDialogClose,
  }: {
    handleDialogClose: any;
    id: number;
    zone: string;
  }) => {
    const { data: Order, total } = useRequest(
      `/lab-order/api/v1/admin/collectors?page=${
        currentPage + 1
      }&limit=${rowsPerPage}&zone=${zone}`,
      {},
      {
        isSuccessNotify: false,
        isPreFetching: true,
        refreshDeps: [currentPage, rowsPerPage],
      }
    );
    const { refetch: addNewZone } = useRequest(undefined, undefined, {
      onSuccess: (json) => {
        handleDialogClose();
        refresh();
      },
    });
    const handleAddNewZone = (collectorUqid) => {
      addNewZone({
        endpoint: `/lab-order/api/v1/admin/orders/${id}/collector`,
        method: "PUT",
        body: {
          collectorUqid: collectorUqid,
        },
      });
    };
    return (
      <Box style={{ width: "100%", padding: 10 }}>
        <ClearBtn handleCloseDialog={handleDialogClose} />
        {Order?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Mobile</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Order?.map((row) => (
                  <TableRow key={row.userId}>
                    <TableCell component="th" scope="row">
                      {row.userId}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.mobileNumber}</TableCell>

                    <TableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            marginLeft: 10,
                          }}
                        >
                          <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddNewZone(row.id)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
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
          //@ts-ignore
          <Typography variant="body">
            Lab collector not found for the given sample collection zone
          </Typography>
        )}
      </Box>
    );
  };
  return (
    <div>
      <UploadFile
        id={qcId || 0}
        handleDialogClose={handleDialogClose}
        zone={zone}
      />
    </div>
  );
};

export default CollectorAssignModal;
