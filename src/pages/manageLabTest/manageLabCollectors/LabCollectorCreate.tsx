import {
  Button,
  Dialog,
  DialogContent,
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
import { makeStyles } from "@mui/styles";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { FC, SetStateAction, useState } from "react";
import { CreateProps, SaveButton, SimpleForm, Toolbar } from "react-admin";

import { useDocumentTitle, useRequest } from "../../../hooks";
import { capitalizeFirstLetter } from "../../../utils/helpers";
import { Check2Icon } from "../../../components/icons";

const LabCollectorCreate: FC<CreateProps> = () => {
  useDocumentTitle("Arogga |Lab Collector Create");
  const classes = useStyle();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const { data: Collector } = useRequest(
    `/lab-order/api/v1/admin/collectors?page=1&limit=500`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );
  const { data: User, total } = useRequest(
    `/v1/users?_page=${currentPage + 1}&_perPage=${rowsPerPage}&_role=employee`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );
  const addCollector = User?.filter(
    (obj2) => !Collector?.some((obj1) => obj1.userId === obj2.u_id.toString())
  );
  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);

    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };
  const UploadFile = ({
    qc_id,
    handleDialogClose,
  }: {
    handleDialogClose: any;
    qc_id: number;
  }) => {
    const { refetch: handleDoneAction } = useRequest(
      `/lab-order/api/v1/admin/collectors`,
      {
        method: "POST",
        body: {
          userId: qc_id,
        },
      },
      {
        onSuccess: () => {
          handleDialogClose();
        },
      }
    );
    const CustomToolbar = (props: any) => (
      <Toolbar {...props}>
        <Button
          variant="contained"
          disableElevation
          className={classes.buttonCancel}
          onClick={handleDialogClose}
        >
          Cancel
        </Button>{" "}
        <SaveButton style={{ width: 120 }} label="Confirm" />
      </Toolbar>
    );

    return (
      <SimpleForm save={handleDoneAction} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "none" }}></div>
              <div className="name">
                <strong>Are you add this user as a collector? </strong>
              </div>
            </div>
          </div>
        </div>
      </SimpleForm>
    );
  };
  return (
    <div style={{ marginTop: 20 }}>
      {addCollector?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Add Collector</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addCollector?.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell component="th" align="left">
                      {row?.u_id}
                    </TableCell>
                    <TableCell align="left">{row?.u_name}</TableCell>
                    <TableCell align="left">{row?.u_email}</TableCell>
                    <TableCell align="left">{row?.u_mobile}</TableCell>
                    <TableCell align="left">
                      {capitalizeFirstLetter(row.u_status)}
                    </TableCell>
                    <TableCell align="left">
                      {/* @ts-ignore */}
                      <Button
                        disableElevation
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          handleOpenDialog(row.u_id);
                        }}
                      >
                        <AutorenewIcon />
                      </Button>
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
                  count={total}
                  rowsPerPage={addCollector?.length}
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <UploadFile qc_id={qcId} handleDialogClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
const useStyle = makeStyles(() => ({
  flex: {
    display: "flex",
    justifyContent: "end",
    width: "100%",
  },
  buttonCancel: {
    backgroundColor: "red",
    marginRight: 10,
    width: 120,
  },
  updateBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "250px",
  },
}));

export default LabCollectorCreate;
