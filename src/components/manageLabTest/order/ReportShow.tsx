import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Card,
  CardContent,
  Collapse,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import clsx from "clsx";
import { useState } from "react";
import { FunctionField, useEditContext } from "react-admin";

import { useRequest } from "../../../hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getFormattedDate,
} from "../../../utils/helpers";

import {
  ExpandIcon,
  LabReportIcon,
  LabReportDisableIcon,
  LabReportDoneIcon,
} from "../../icons";
import ReportCreateOrder from "./ReportCreateOrder";

const ReportShow = ({ row }) => {
  const classes = useStyles();
  const { record } = useEditContext();
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [, setQcId] = useState<number | null>(null);
  const [expandedPatients, setExpandedPatients] = useState({});
  const [patients, setPatients] = useState("");
  const [updateStatus, setUpdateStatus] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(true);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const {
    data: labReport = [],
    refetch,
    total,
  } = useRequest(
    `/lab-order/api/v1/admin/order-patients/${row.id}/reports?page=${currentPage}&limit=${reportsPerPage}`,
    {},
    {
      isBaseUrl: true,
      isPreFetching: true,
      isSuccessNotify: false,
      refreshDeps: [updateStatus, currentPage],
    }
  );

  const handleExpandClick = (patientId) => {
    setExpandedPatients((prevState) => ({
      ...prevState,
      [patientId]: !prevState[patientId],
    }));
    setPatients(patientId);
  };

  return (
    <div>
      <div className={classes.AddBtn}>
        <FunctionField
          label="Actions"
          render={(record: any) => (
            <Box display="flex" style={{ marginLeft: 10 }}>
              {record.orderStatus === "processing" ||
              record.orderStatus === "completed" ? (
                <>
                  {labReport?.length > 0 ? (
                    <LabReportDoneIcon
                      //@ts-ignore
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        handleOpenDialog(record.id);
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <LabReportIcon
                      //@ts-ignore
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        handleOpenDialog(record.id);
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  )}
                </>
              ) : (
                <LabReportDisableIcon
                  style={{
                    cursor: "pointer",
                    pointerEvents: "none",
                  }}
                />
              )}
            </Box>
          )}
        />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg">
        <DialogContent>
          <Box style={{ width: 1200 }}>
            <ClearIcon
              onClick={() => setOpenDialog(false)}
              style={{
                fontSize: 35,
                color: "red",
                marginBottom: 10,
                cursor: "pointer",
                float: "right",
              }}
            />
            {labReport?.length > 0 ? (
              <Box marginLeft={2}>
                <Typography variant="h4">Report</Typography>
              </Box>
            ) : (
              ""
            )}

            <CardContent>
              <>
                <>
                  <Box className={classes.orderBox}>
                    <Grid alignItems="center" item md={3} container>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className={classes.orderId}
                      >
                        Order ID:
                      </Typography>
                      <Typography variant="body1">
                        {record.orderNumber}
                      </Typography>
                    </Grid>

                    <Grid alignItems="center" item md={3} container>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className={classes.orderId}
                      >
                        Order Date:
                      </Typography>
                      <Typography variant="body1">
                        {getFormattedDate(record.createdAt)}
                      </Typography>
                    </Grid>
                  </Box>

                  <Card className={classes.root}>
                    <CardContent style={{ padding: 0 }}>
                      <div className={classes.cartDetails}>
                        <Grid container spacing={1}>
                          <Grid alignItems="center" item md={3} container>
                            <Box marginLeft={2}>
                              <Typography variant="body2" color="textSecondary">
                                Patient Name
                              </Typography>
                              <Typography variant="body1">
                                {row.name}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid alignItems="center" item md={3} container>
                            <Box marginLeft={2}>
                              <Typography variant="body2" color="textSecondary">
                                Gender
                              </Typography>
                              <Typography variant="body1">
                                {capitalizeFirstLetterOfEachWord(row.gender)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid alignItems="center" item md={2} container>
                            <Box marginLeft={2}>
                              <Typography variant="body2" color="textSecondary">
                                Age
                              </Typography>
                              <Typography variant="body1">{row.age}</Typography>
                            </Box>
                          </Grid>
                          <Grid alignItems="center" item md={2} container>
                            <Box marginLeft={2}>
                              <Typography variant="body2" color="textSecondary">
                                Reference Number
                              </Typography>

                              <Typography variant="body1">
                                {row?.vendorReferenceNumber}{" "}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid alignItems="center" item md={2} container>
                            <IconButton
                              className={clsx(classes.expand, {
                                [classes.expandOpen]: expandedPatients[row.id],
                              })}
                              onClick={() => handleExpandClick(row.id)}
                              aria-expanded={expandedPatients[row.id]}
                              aria-label="show more"
                            >
                              <ExpandIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    </CardContent>
                    <Collapse
                      in={expandedPatients[row.id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <ReportCreateOrder
                        patients={patients}
                        total={total}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        reportsPerPage={reportsPerPage}
                        refetch={refetch}
                        patient={row}
                        setUpdateStatus={setUpdateStatus}
                        labReport={labReport}
                      />
                    </Collapse>
                  </Card>
                </>
              </>
            </CardContent>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};
const theme = createTheme({});
const useStyles = makeStyles(() => ({
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "end",
  },
  flex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 120,
  },
  root: {
    maxWidth: "100%",
    marginBottom: 20,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  cartDetails: {
    border: "1px solid #EAEBEC",
    padding: 25,
    background: "var(--grey-grey-100, #F5F5F5)",
  },
  orderBox: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 10,
  },
  orderId: {
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "175%",
    letterSpacing: " 0.15px",
    marginRight: 5,
  },
}));

export default ReportShow;
