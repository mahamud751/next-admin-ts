import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

import { SetStateAction, useEffect, useState } from "react";

import { useDocumentTitle, useRequest } from "../../../../hooks";
import {
  capitalizeFirstLetter,
  getColorByStatus,
} from "../../../../utils/helpers";
import { httpClient } from "../../../../utils/http";
import { CheckIcon, RemoveIcon } from "../../../../components/icons";
import VendorStatusUpdate from "@/components/manageLabTest/Zone/VendorStatusUpdate";

const VendorCollector = ({ id }) => {
  useDocumentTitle("Arogga | Lab Sample Location Assigned Show");
  const classes = useStyle();
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [updateStatus, setUpdateStatus] = useState<number | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [modalType, setModalType] = useState(null);
  const handleOpenDialog = (id: number, type: string) => {
    setQcId(id);
    setModalType(type);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setModalType(null);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  let modalContent = null;
  const { data: Zone } = useRequest(
    `/v1/zones?page=${currentPage + 1}&limit=${rowsPerPage}&onlyMainZones=1`,
    {},
    {
      isBaseUrl: true,
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );
  const zone = Zone?.zones?.find((item, index) => index === parseInt(id));
  useEffect(() => {
    if (zone) {
      const fetchData = async () => {
        try {
          const response = await httpClient(
            `/misc/api/v1/admin/vendor?page=${
              currentPage + 1
            }&limit=${rowsPerPage}&zone=${zone}`,
            {}
          );
          if (response && response.json) {
            setOrder(response.json.data);
            setTotal(response.json.count);
          }
          setSearchPerformed(true);
        } catch (error) {
          setSearchPerformed(true);
        }
      };
      fetchData();
    }
  }, [zone, currentPage, rowsPerPage, newZoneAdded, updateStatus]);
  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const UploadFile = ({
    handleDialogClose,
  }: {
    handleDialogClose: any;
    qc_id: number;
  }) => {
    const [zoneSelect, setZoneSelect] = useState("");
    const handleChange = (event: any) => {
      setZoneSelect(event.target.value as string);
    };
    const { data: Zones } = useRequest(
      `/lab-order/api/v1/admin/collectors`,
      { method: "GET" },
      {
        isSuccessNotify: false,
        isPreFetching: true,
      }
    );
    const { refetch: addNewZone } = useRequest(undefined, undefined, {
      onSuccess: (json) => {
        setZoneSelect("");
        setNewZoneAdded(Date.now());
      },
    });

    const handleAddNewZone = async () => {
      try {
        await addNewZone({
          endpoint: `/lab-order/api/v1/admin/coverages`,
          method: "POST",
          body: {
            zones: [zone],
            collectorUqids: [zoneSelect],
          },
        });
        handleDialogClose();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Box style={{ width: "320px", padding: 10 }}>
        <FormControl
          variant="filled"
          fullWidth
          size="small"
          style={{ maxWidth: "100%" }}
        >
          <InputLabel id="demo-simple-select-label">Collector</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={zoneSelect}
            label="Collector"
            onChange={handleChange}
          >
            {Zones?.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={classes.AddBtn}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={handleAddNewZone}
            disabled={!zoneSelect}
          >
            Save Update
          </Button>
        </div>
      </Box>
    );
  };
  const UploadFile2 = ({
    s_qc_id,
    handleDialogClose2,
  }: {
    handleDialogClose2: any;
    s_qc_id: number;
  }) => {
    const body = {
      status: "inactive",
    };
    const handleSuccess = () => {
      setUpdateStatus(Date.now());
    };
    return (
      <VendorStatusUpdate
        body={body}
        s_qc_id={s_qc_id}
        handleDialogClose={handleDialogClose2}
        onSuccess={handleSuccess}
      />
    );
  };
  const UploadFile3 = ({
    s_qc_id,
    handleDialogClose3,
  }: {
    handleDialogClose3: any;
    s_qc_id: number;
  }) => {
    const body = {
      status: "active",
    };
    const handleSuccess = () => {
      setUpdateStatus(Date.now());
    };
    return (
      <VendorStatusUpdate
        body={body}
        s_qc_id={s_qc_id}
        handleDialogClose={handleDialogClose3}
        onSuccess={handleSuccess}
      />
    );
  };
  switch (modalType) {
    case "add":
      modalContent = (
        <UploadFile handleDialogClose={handleCloseDialog} qc_id={qcId || 0} />
      );
      break;
    case "updateInactive":
      modalContent = (
        <UploadFile2
          s_qc_id={qcId || 0}
          handleDialogClose2={handleCloseDialog}
        />
      );
      break;
    case "updateActive":
      modalContent = (
        <UploadFile3
          s_qc_id={qcId || 0}
          handleDialogClose3={handleCloseDialog}
        />
      );
      break;
    default:
      modalContent = null;
  }
  return (
    <div>
      {searchPerformed && Order?.length === 0 ? (
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
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Vendor Name[EN]</TableCell>
                <TableCell align="left">Vendor Name[BN]</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="center">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Order?.map((row) => {
                const color = getColorByStatus(row.status);
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row?.name?.en}
                    </TableCell>
                    <TableCell align="left">{row?.name?.bn}</TableCell>
                    <TableCell align="left">
                      <p
                        style={{
                          width: 93,
                          backgroundColor: color + "10",
                          color: color,
                          borderRadius: 42,
                          textAlign: "center",
                          paddingTop: 5,
                          paddingBottom: 5,
                          textTransform: "capitalize",
                        }}
                      >
                        {" "}
                        {capitalizeFirstLetter(row.status)}
                      </p>
                    </TableCell>

                    <TableCell align="center">
                      <div>
                        {row?.status === "active" ? (
                          <>
                            {/* @ts-ignore */}
                            <Button
                              disableElevation
                              onClick={(e: MouseEvent) => {
                                e.stopPropagation();
                                handleOpenDialog(row.id, "updateInactive");
                              }}
                            >
                              <RemoveIcon />
                            </Button>
                          </>
                        ) : (
                          <>
                            {/* @ts-ignore */}
                            <Button
                              disableElevation
                              onClick={(e: MouseEvent) => {
                                handleOpenDialog(row.id, "updateActive");
                              }}
                            >
                              <CheckIcon />
                            </Button>{" "}
                          </>
                        )}
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
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>{modalContent}</DialogContent>
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
  button: {
    marginRight: 10,
    textTransform: "capitalize",
  },
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "end",
  },
}));

export default VendorCollector;
