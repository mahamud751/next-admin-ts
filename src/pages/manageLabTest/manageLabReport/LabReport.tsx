import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";
import { createTheme } from "@mui/material/styles";

import clsx from "clsx";
import { useState } from "react";
import { Title } from "react-admin";

import { useDocumentTitle, useRequest } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getFormattedDate,
} from "@/utils/helpers";
import { LabReportSearchIcon } from "@/components/icons";
import ExpandIcon from "@/components/icons/ExpandIcon";
import ReportCreate from "@/components/manageLabTest/Report/ReportCreate";

const LabReport = () => {
  useDocumentTitle("Arogga | Lab Report");
  const classes = useStyles();
  const [patientReferenceNumber, setPatientReferenceNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [expandedPatients, setExpandedPatients] = useState({});
  const [patients, setPatients] = useState("");
  const handleExpandClick = (patientId) => {
    setExpandedPatients((prevState) => ({
      ...prevState,
      [patientId]: !prevState[patientId],
    }));
    setPatients(patientId);
  };
  const { data: Order, refetch } = useRequest(
    `/lab-order/api/v1/admin/order-patients?patientReferenceNumber=${patientReferenceNumber}&orderNumber=${orderId}&patientTrackingNumber=${trackingId}`,
    { method: "GET" },
    {
      isSuccessNotify: false,
    }
  );
  const handleTextFieldChange = (event) => {
    setPatientReferenceNumber(event.target.value);
    refetch();
  };
  const handleTextFieldChange2 = (event) => {
    const newValue = event.target.value;
    setOrderId(event.target.value);
    if (newValue.length >= 18) {
      refetch();
    }
  };
  const handleTextFieldChange3 = (event) => {
    const newValue = event.target.value;
    setTrackingId(event.target.value);
    if (newValue.length >= 6) {
      refetch();
    }
  };
  return (
    <>
      <Title title="List of Lab Reports" />
      <Box
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: 40,
        }}
      >
        <TextField
          id="standard-basic"
          label="Search by Order ID"
          value={orderId}
          onChange={handleTextFieldChange2}
        />

        <TextField
          id="standard-basic"
          label="Search By Reference Number"
          style={{ width: 220 }}
          value={patientReferenceNumber}
          onChange={handleTextFieldChange}
        />
        <TextField
          id="standard-basic"
          label="Search By Tracking Number"
          style={{ width: 220 }}
          value={trackingId}
          onChange={handleTextFieldChange3}
        />
      </Box>

      <>
        {Order?.orders?.length > 0 ? (
          <>
            {Order?.orders?.map((items) => (
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
                    <Typography variant="body1">{items.orderNumber}</Typography>
                  </Grid>
                  <Grid alignItems="center" item md={3} container>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className={classes.orderId}
                    >
                      User Name:
                    </Typography>
                    <Typography variant="body1">{items.name}</Typography>
                  </Grid>
                  <Grid alignItems="center" item md={3} container>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className={classes.orderId}
                    >
                      Mobile Number:
                    </Typography>
                    <Typography variant="body1">
                      {items.mobileNumber}
                    </Typography>
                    <Typography variant="body1">{items.orderId}</Typography>
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
                      {getFormattedDate(items.createdAt)}
                    </Typography>
                  </Grid>
                </Box>
                {items?.patients?.map((patient) => (
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
                                {patient.name}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid alignItems="center" item md={3} container>
                            <Box marginLeft={2}>
                              <Typography variant="body2" color="textSecondary">
                                Gender
                              </Typography>
                              <Typography variant="body1">
                                {capitalizeFirstLetterOfEachWord(
                                  patient.gender
                                )}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid alignItems="center" item md={2} container>
                            <Box marginLeft={2}>
                              <Typography variant="body2" color="textSecondary">
                                Age
                              </Typography>
                              <Typography variant="body1">
                                {patient.age}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid alignItems="center" item md={2} container>
                            <Box marginLeft={2}>
                              <Typography variant="body2" color="textSecondary">
                                Reference Number
                              </Typography>

                              <Typography variant="body1">
                                {patient?.vendorReferenceNumber}{" "}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid alignItems="center" item md={2} container>
                            <IconButton
                              className={clsx(classes.expand, {
                                [classes.expandOpen]:
                                  expandedPatients[patient.id],
                              })}
                              onClick={() => handleExpandClick(patient.id)}
                              aria-expanded={expandedPatients[patient.id]}
                              aria-label="show more"
                            >
                              <ExpandIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    </CardContent>
                    <Collapse
                      in={expandedPatients[patient.id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <ReportCreate
                        patients={patients}
                        refetch={refetch}
                        patient={patient}
                      />
                    </Collapse>
                  </Card>
                ))}
              </>
            ))}
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 40,
              }}
            >
              <LabReportSearchIcon />
            </div>

            <Typography
              variant="h6"
              color="textSecondary"
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >
              Search by Order ID or Reference Number
            </Typography>
          </>
        )}
      </>
    </>
  );
};
const theme = createTheme({});
const useStyles = makeStyles(() => ({
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
export default LabReport;
