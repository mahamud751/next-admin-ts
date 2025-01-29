import { FC, SetStateAction, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
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
import { Edit as EditIcon } from "@mui/icons-material";

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
import LabReportShipmentFilter from "./LabReportShipmentFilter";

const LabReportShipmentList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga |Lab Report Shipments List");
  const refresh = useRefresh();
  const exporter = useExport(rest);

  const [openDialog, setOpenDialog] = useState(false);
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [qcId, setQcId] = useState<number | null>(null);
  const [zone, setZone] = useState<string | null>(null);
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
        endpoint: `/lab-order/api/v1/admin/order-shipments/${s_qc_id}/assignment`,
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
                      {row?.userId}
                    </TableCell>
                    <TableCell align="left">{row?.name}</TableCell>
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
  return (
    <>
      <List
        {...rest}
        title="List of Lab Report Shipments"
        filters={<LabReportShipmentFilter children={""} />}
        perPage={25}
        exporter={exporter}
        // bulkActionButtons={false}
        sort={{ field: "createdAt", order: "DESC" }}
      >
        <Datagrid>
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
            label="Address "
            render={(record) => (
              <>
                <p>
                  {record?.userLocation?.name}(
                  {record?.userLocation?.mobileNumber})
                </p>
                <p>{record?.userLocation?.location}</p>
              </>
            )}
          />
          <FunctionField
            label="Assigned "
            render={(record) => (
              <div>
                <p>{record?.deliveryUser?.name}</p>
                {/* @ts-ignore */}
                <EditIcon
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    //@ts-ignore
                    handleOpenDialog(
                      //@ts-ignore
                      record?.id,
                      record?.userLocation?.zone
                    );
                  }}
                  style={{
                    color: "#ED6C02",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
          />
          <TextField source="deliveredBy.name" label="Delivered By" />
          <FunctionField
            render={(record) => {
              const color = getColorByStatus(record.shipmentStatus);
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
                    {capitalizeFirstLetterOfEachWord(record.shipmentStatus)}
                  </div>
                </>
              );
            }}
            label="Shipment Status"
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
    </>
  );
};

export default LabReportShipmentList;
