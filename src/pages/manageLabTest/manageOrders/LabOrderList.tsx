import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  TablePagination,
} from "@mui/material";

import React, { FC, SetStateAction, useEffect, useState } from "react";
import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  ListProps,
  TextField,
  useRefresh,
} from "react-admin";

import ClearBtn from "@/components/manageLabTest/Button/ClearBtn";
import { useDocumentTitle, useExport, useRequest } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getColorByStatus,
} from "@/utils/helpers";
import LabOrderFilter from "./LabOrderFilter";
import EditIcon from "@/components/icons/EditIcon";

const LabOrderList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga |Lab Orders List");
  const exporter = useExport(rest);
  const refresh = useRefresh();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [qcId, setQcId] = useState<number | null>(null);
  const [zone, setZone] = useState<string | null>(null);
  const [record] = useState<any | null>(null);
  const handleOpenDialog = (id: number, zone: string) => {
    setQcId(id);
    setZone(zone);
    setOpenDialog(true);
    refetch();
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    data: Order,
    total,
    refetch,
  } = useRequest(
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
  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };
  const UploadFile = ({
    s_qc_id,
    handleDialogClose,
  }: {
    handleDialogClose: any;
    s_qc_id: number;
    zone: string;
  }) => {
    const { refetch: addNewZone } = useRequest(undefined, undefined, {
      onSuccess: (json) => {
        handleDialogClose();
        refresh();
      },
    });

    const handleAddNewZone = (collectorUqid) => {
      addNewZone({
        endpoint: `/lab-order/api/v1/admin/orders/${s_qc_id}/collector`,
        method: "PUT",
        body: {
          collectorUqid: collectorUqid,
        },
      });
    };
    return (
      <Box style={{ width: "100%", padding: 10 }}>
        <ClearBtn handleCloseDialog={handleCloseDialog} />
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
                        <div style={{ marginLeft: 10 }}>
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
  const UploadFile2 = ({
    record,
  }: {
    handleDialogClose2: any;
    record: any;
    s_qc_id: number;
  }) => {
    const orderStatusToStepIndex = {
      pending: 0,
      confirmed: 1,
      scheduled: 2,
      rescheduled: 3,
      cancelled: 4,
    };
    const initialSelectedStage1Status = record?.orderStatus;
    const initialActiveStep =
      orderStatusToStepIndex[initialSelectedStage1Status];
    const [activeStep, setActiveStep] = React.useState(initialActiveStep);
    const [selectedStage1Status, setSelectedStage1Status] = React.useState(
      initialSelectedStage1Status
    );
    const { refetch } = useRequest(
      `/lab-order/api/v1/admin/orders/${record.id}/order-status`,
      {
        method: "PUT",
        body: {
          orderStatus: selectedStage1Status,
        },
      }
    );
    const handleChange = (event: any) => {
      setSelectedStage1Status(event.target.value as string);
      setActiveStep(orderStatusToStepIndex[event.target.value]);
    };
    useEffect(() => {
      if (activeStep === 2) {
        setSelectedStage1Status("scheduled");
      }
    }, [activeStep]);
    const handleNext = () => {
      if (activeStep === 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      refetch();
    };
    return (
      <Box style={{ width: 500, padding: 10 }}>
        <ClearBtn handleCloseDialog={handleCloseDialog2} />
        <Typography variant="body2" color="initial">
          Current Status: {record?.orderStatus}
        </Typography>
        <Box
          sx={{
            display: "flex",
            //@ts-ignore
            gap: "2rem",
            my: 5,
          }}
        >
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-label">Update Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedStage1Status}
              label="Update Status"
              onChange={handleChange}
            >
              <MenuItem value={"pending"}>Pending</MenuItem>
              <MenuItem value={"confirmed"}>Confirmed</MenuItem>
              <MenuItem value={"cancelled"}>Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button
            size="medium"
            variant="contained"
            onClick={handleNext}
            style={{ width: 220 }}
          >
            Submit Now
          </Button>
        </Box>
      </Box>
    );
  };
  return (
    <>
      <List
        {...rest}
        title="List of Lab Orders"
        filters={<LabOrderFilter children={""} />}
        perPage={25}
        exporter={exporter}
        sort={{ field: "createdAt", order: "DESC" }}
      >
        <Datagrid rowClick="edit" bulkActionButtons={false}>
          <TextField source="orderNumber" label="Order ID" />
          <TextField source="name" label="Name" />
          <FunctionField
            render={(record) => {
              return (
                <>
                  {record?.mobileNumber ? (
                    <TextField source="mobileNumber" label="Mobile" />
                  ) : (
                    <TextField source="email" label="Email" />
                  )}
                </>
              );
            }}
            label="Mobile/Email"
          />
          <DateField
            source="createdAt"
            label="Create Date & Time"
            showTime={true}
          />
          <FunctionField
            label="Scheduled At"
            render={(record) => (
              <>
                <DateField
                  source="formattedScheduleDate"
                  style={{
                    color: record.isScheduleExpired === true ? "red" : "black",
                  }}
                >
                  {record.formattedScheduleDate}
                </DateField>
                <br />

                <TextField
                  source="scheduleTimeRange.en"
                  style={{
                    color: record.isScheduleExpired === true ? "red" : "black",
                  }}
                />
              </>
            )}
          />
          <TextField source="itemCount" label="Count" />
          <FunctionField
            label="Net Amount"
            render={(record) => `৳${record.netAmount}`}
          />
          <FunctionField
            label="Payment"
            render={(record) => {
              return (
                <div
                  style={{
                    width: 93,
                    backgroundColor:
                      (record.paymentStatus === "paid"
                        ? "#4CAF50"
                        : "#FFB547") + "10",
                    color:
                      record.paymentStatus === "unpaid" ? "#ff4949" : "#008000",
                    borderRadius: 42,
                    textAlign: "center",
                    paddingTop: 5,
                    paddingBottom: 5,
                    textTransform: "capitalize",
                  }}
                >
                  {record.paymentMethod === "online" ? "O | " : "C | "}
                  {record.paymentStatus}
                </div>
              );
            }}
          />

          <FunctionField
            label="Assigned"
            render={(record) => (
              <div>
                <p>{record.assignedTo.name}</p>
                {/* @ts-ignore */}
                <EditIcon
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    //@ts-ignore
                    handleOpenDialog(
                      //@ts-ignore
                      record.id,
                      record?.userLocation?.zone
                    );
                  }}
                  style={{
                    color: "#ED6C02",
                  }}
                />
              </div>
            )}
          />
          <FunctionField
            render={(record) => {
              const color = getColorByStatus(record.orderStatus);
              return (
                <>
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
                    {capitalizeFirstLetterOfEachWord(record.orderStatus)}
                  </div>
                </>
              );
            }}
            label="Order Status"
          />
        </Datagrid>
      </List>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent style={{ maxWidth: "850px" }}>
          <UploadFile
            s_qc_id={qcId || 0}
            zone={zone}
            handleDialogClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogContent>
          <UploadFile2
            s_qc_id={qcId || 0}
            record={record}
            handleDialogClose2={handleCloseDialog2}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LabOrderList;
