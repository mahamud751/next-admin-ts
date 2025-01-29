import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
  Select,
  TextField,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

import { Edit as EditIcon } from "@mui/icons-material";

import { FC, SetStateAction, useState } from "react";
import {
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useEditContext,
  useNotify,
} from "react-admin";

import { CalenderIcon, RegularPriceIcon } from "@/components/icons";
import CartItemCount from "@/components/icons/CartItemCount";

import { labTestUploadDataProvider } from "@/dataProvider";
import { useRequest } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getFormattedDate,
  toFixedNumber,
} from "@/utils/helpers";
import { makeStyles } from "@mui/styles";
import ClearBtn from "@/components/manageLabTest/Button/ClearBtn";

type UserTabProps = {
  permissions: string[];
  [key: string]: any;
};
const TestDetails: FC<UserTabProps> = ({ ...rest }) => {
  const classes = useStyles();
  const { record } = useEditContext();
  const notify = useNotify();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [qcId, setQcId] = useState<number | null>(null);
  const [vendorPrice, setQsetVendorPricecId] = useState<number | null>(null);
  const [, setDialogId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [nameStatus, setFilterName] = useState("");
  const [dataStatus, setDataStatus] = useState("");

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };
  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setDialogId(null);
    setOpenDialog(false);
  };
  const handleOpenDialog2 = (id: number, price: number) => {
    setQcId(id);
    setQsetVendorPricecId(price);
    setOpenDialog2(true);
  };
  const handleCloseDialog2 = () => {
    setDialogId(null);
    setOpenDialog2(false);
  };

  const {
    data: testList,
    total,
    refetch: testRefetch,
  } = useRequest(
    `/misc/api/v1/admin/vendor/vendor-item?page=${
      currentPage + 1
    }&limit=${rowsPerPage}&vendorId=${record.id}&name=${nameStatus}&${
      filterStatus !== "all" ? `&status=${filterStatus}` : ""
    }`,
    { method: "GET" },
    {
      isSuccessNotify: false,
      refreshDeps: [record.id, currentPage, rowsPerPage],
      isPreFetching: true,
    }
  );
  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
    testRefetch();
    setCurrentPage(0);
  };
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
    testRefetch();
  };
  const handleStatusChange = (event) => {
    setDataStatus(event.target.value);
  };

  const CustomToolbar = (props: any) => (
    <Toolbar
      {...props}
      toolbar={<CustomToolbar />}
      style={{ background: "none" }}
    >
      <SaveButton style={{ width: 120 }} label="Confirm" />
    </Toolbar>
  );
  const refetch = async () => {
    try {
      //@ts-ignore
      await labTestUploadDataProvider.update(
        `misc/api/v1/admin/vendor/vendor-item/${qcId}`,
        {
          data: {
            status: dataStatus,
          },
        }
      );
      notify("Successfully Test Update!", { type: "success" });
      testRefetch();
      setOpenDialog(false);
    } catch (err: any) {
      notify(`${err}`, {
        type: "error",
      });
    }
  };
  const refetch2 = async (data) => {
    try {
      await labTestUploadDataProvider.update(
        `misc/api/v1/admin/vendor/vendor-item/${qcId}`,
        {
          data: {
            vendorPrice: data.vendorPrice,
          },
        }
      );
      notify("Successfully Test Update!", { type: "success" });
      testRefetch();
      setOpenDialog2(false);
    } catch (err: any) {
      notify(`${err}`, {
        type: "error",
      });
    }
  };
  return (
    <>
      <div className={classes.cartDetails}>
        <Grid container spacing={1}>
          <Grid alignItems="center" item md={3} container>
            <RegularPriceIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Vendor Name EN
              </Typography>
              <Typography variant="body1">{record.name.en}</Typography>
            </Box>
          </Grid>
          <Grid alignItems="center" item md={3} container>
            <CartItemCount />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Vendor Name BN
              </Typography>
              <Typography variant="body1">{record.name.bn}</Typography>
            </Box>
          </Grid>
          <Grid alignItems="center" item md={3} container>
            <CalenderIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Vendor Created Date and Time
              </Typography>
              <Typography variant="body1">
                {getFormattedDate(record.updatedAt)}
              </Typography>
            </Box>
          </Grid>
          <Grid alignItems="center" item md={3} container>
            <CalenderIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Vendor Update Date and Time
              </Typography>
              <Typography variant="body1">
                {getFormattedDate(record.updatedAt)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
      <TextField
        className={classes.formControl}
        id="standard-basic"
        onChange={handleFilterNameChange}
        label="Test Name"
      />
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Filter Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterStatus}
          onChange={handleFilterStatusChange}
        >
          <MenuItem value={"all"}>All</MenuItem>
          <MenuItem value={"active"}>Active</MenuItem>
          <MenuItem value={"inactive"}>Inactive</MenuItem>
        </Select>
      </FormControl>
      <div className={classes.cartDetails}>
        {testList?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Test Name</TableCell>
                  <TableCell align="left">Base Price</TableCell>
                  <TableCell align="left">Material Cost</TableCell>
                  <TableCell align="left">Margin</TableCell>
                  <TableCell align="left">External Material Cost</TableCell>
                  <TableCell align="left">Regular Price</TableCell>
                  <TableCell align="left">Discount Price</TableCell>
                  <TableCell align="left">Vendor Price</TableCell>
                  <TableCell align="left"> Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testList?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell align="left">
                      {capitalizeFirstLetterOfEachWord(row.item?.name.en)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row.item?.basePrice).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row.item?.materialCost).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row.item?.margin).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row.item?.externalMaterialCost).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row.item?.regularPrice).toFixed(2)}
                    </TableCell>

                    <TableCell align="left">
                      {toFixedNumber(row.item?.discountPrice).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {/* @ts-ignore */}
                      <Button
                        disableElevation
                        onClick={(e: MouseEvent) => {
                          handleOpenDialog2(row.id, row.vendorPrice);
                        }}
                        style={{
                          backgroundColor: "rgba(1, 25, 0, 0.063)",
                          color: "rgb(6, 25, 80)",
                          borderRadius: 42,
                          textAlign: "center",
                          paddingTop: 5,
                          paddingBottom: 5,
                          textTransform: "capitalize",
                        }}
                      >
                        {toFixedNumber(row.vendorPrice).toFixed(2)}
                        <EditIcon />
                      </Button>
                    </TableCell>
                    <TableCell align="left">
                      {/* @ts-ignore */}
                      <Button
                        disableElevation
                        onClick={(e: MouseEvent) => {
                          handleOpenDialog(row.id);
                          setDataStatus(row.status);
                        }}
                        style={{
                          backgroundColor:
                            (row.status === "active" ? "#4CAF50" : "#FFB547") +
                            "10",
                          color:
                            row.status === "inactive" ? "#FFB547" : "#4CAF50",
                          borderRadius: 42,
                          textAlign: "center",
                          paddingTop: 5,
                          paddingBottom: 5,
                          textTransform: "capitalize",
                        }}
                      >
                        {capitalizeFirstLetterOfEachWord(row.status)}
                        <EditIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
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
            <>
              {" "}
              <div className={classes.flex}>
                <Typography variant="h5">Status Update</Typography>
                <ClearBtn handleCloseDialog={handleCloseDialog} />
              </div>
              <Grid container className={classes.locationArea}>
                <SimpleForm save={refetch} toolbar={<CustomToolbar />}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className={classes.status}
                  >
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      value={dataStatus}
                      onChange={handleStatusChange}
                      label="Status"
                    >
                      <MenuItem value={"active"}>Active</MenuItem>
                      <MenuItem value={"inactive"}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </SimpleForm>
              </Grid>
            </>
          </DialogContent>
        </Dialog>
        <Dialog open={openDialog2} onClose={handleCloseDialog2}>
          <DialogContent>
            <>
              <div className={classes.flex}>
                <Typography variant="h5">Vendor Price Update</Typography>
                <ClearBtn handleCloseDialog={handleCloseDialog2} />
              </div>

              <Grid container className={classes.locationArea}>
                <SimpleForm save={refetch2} toolbar={<CustomToolbar />}>
                  <TextInput
                    variant="outlined"
                    label="Vendor Price"
                    source="vendorPrice"
                    defaultValue={toFixedNumber(vendorPrice).toFixed(2)}
                    alwaysOn
                  />
                </SimpleForm>
                <Grid item sm={6} md={4}></Grid>
              </Grid>
            </>
          </DialogContent>
        </Dialog>
      </div>
      .
    </>
  );
};

const useStyles = makeStyles(() => ({
  cartDetails: {
    border: "1px solid #EAEBEC",
    borderRadius: 6,
    padding: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  locationArea: {
    width: "100%",
    margin: "20px 0px 20px 0px",
    background: "#FFFFFF",
    border: "1px dashed #3ECBA5",
    borderRadius: 6,
  },
  formControl: {
    margin: 20,
    minWidth: 140,
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  status: {
    width: 300,
  },
}));

export default TestDetails;
