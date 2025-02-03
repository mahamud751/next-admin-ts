import {
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
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import { useEditContext } from "react-admin";

import { useRequest } from "../../../../hooks";
import { CheckIcon, DescriptionIcon } from "../../../../components/icons";
import ClearBtn from "../../../../components/manageLabTest/Button/ClearBtn";
import Details from "@/components/manageLabTest/order/Details";

const OrderDetailsTab = () => {
  const classes = useStyles();
  const { record } = useEditContext();
  const [, setDialogId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setDialogId(null);
    setOpenDialog(false);
  };
  const handleOpenDialog2 = (id: number) => {
    setQcId(id);
    setOpenDialog2(true);
  };
  const handleCloseDialog2 = () => {
    setDialogId(null);
    setOpenDialog2(false);
  };
  const UploadFile = ({
    qc_id,
    handleDialogClose,
  }: {
    handleDialogClose: any;
    qc_id: number;
  }) => {
    const { data: test } = useRequest(
      `/misc/api/v1/admin/lab-items/${qc_id}`,
      {},
      {
        isSuccessNotify: false,
        isPreFetching: true,
      }
    );
    return (
      <div>
        <div className={classes.packageModal}>
          <Typography variant="body1" className={classes.testName}>
            {test?.name.en}
          </Typography>
          <ClearBtn handleCloseDialog={handleDialogClose} />
        </div>
        <div style={{ display: "flex" }}>
          <div className={classes.sampleType}>
            <Grid container spacing={1} style={{ marginBottom: 10 }}>
              <DescriptionIcon />
              <Typography
                variant="body1"
                className={classes.testName}
                style={{ marginLeft: 10, marginTop: 5 }}
              >
                Sample Type:
              </Typography>
              {test?.sampleRequirements?.map((item) => (
                <div className={classes.sample} key={item.id}>
                  <Typography variant="body2" className={classes.sample2}>
                    {item?.en}
                  </Typography>
                </div>
              ))}
            </Grid>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
            }}
          >
            <DescriptionIcon />
            <Typography
              variant="body1"
              className={classes.testName}
              style={{ marginLeft: 10, marginTop: 5 }}
            >
              Sub Title
            </Typography>
          </div>
          <Typography variant="body2" className={classes.description}>
            {test?.subTitle?.en}
          </Typography>
        </div>
      </div>
    );
  };
  const UploadFile2 = ({
    qc_id,
    handleDialogClose,
  }: {
    handleDialogClose: any;
    qc_id: number;
  }) => {
    const { data: test } = useRequest(
      `/misc/api/v1/admin/lab-items/${qc_id}`,
      {},
      {
        isSuccessNotify: false,
        isPreFetching: true,
      }
    );
    const mainId = record?.items?.find((pd) => pd.externalId === test?.id);
    const mainIdTest = mainId?.tests?.map((item) => item?.name.en);
    return (
      <div>
        <div className={classes.packageModal}>
          <Typography variant="body1" className={classes.testName}>
            {test?.name.en}
          </Typography>
          <ClearBtn handleCloseDialog={handleDialogClose} />
        </div>
        <div style={{ display: "flex" }}>
          <div className={classes.sampleTypeDiv}>
            <Grid container spacing={1} style={{ marginBottom: 10 }}>
              <DescriptionIcon />
              <Typography
                variant="body1"
                className={classes.testName}
                style={{ marginLeft: 10, marginTop: 5 }}
              >
                Sample Type:
              </Typography>
              {test?.sampleRequirements?.map((item) => (
                <div className={classes.sample} key={item.id}>
                  <Typography variant="body2" className={classes.sample2}>
                    {item?.en}
                  </Typography>
                </div>
              ))}
            </Grid>
          </div>
        </div>
        <div className={classes.sampleTypeDiv}>
          <div
            style={{
              display: "flex",
            }}
          >
            <DescriptionIcon />
            <Typography
              variant="body1"
              className={classes.testName}
              style={{ marginLeft: 10, marginTop: 5 }}
            >
              Tests Included
            </Typography>
          </div>
          <Grid container spacing={1} style={{ marginBottom: 10 }}>
            {test?.tests?.map((item, index) => {
              const testName = item?.test?.name?.en;
              return (
                <div key={index} className={classes.package}>
                  <Typography variant="body2">* {testName}</Typography>
                  {mainIdTest.includes(testName) && (
                    <span
                      style={{
                        color: "#fd6a6a",
                        marginLeft: 2,
                      }}
                    >
                      (Booked)
                    </span>
                  )}
                </div>
              );
            })}
          </Grid>
        </div>
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
            }}
          >
            <DescriptionIcon />
            <Typography
              variant="body1"
              className={classes.testName}
              style={{ marginLeft: 10, marginTop: 5 }}
            >
              Sub Title
            </Typography>
          </div>

          <Typography variant="body2" className={classes.description}>
            {test?.subTitle?.en}
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <>
      <Details record={record} />
      <div className={classes.orderItem}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">SL</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {record?.items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell>
                    <div className={classes.packageTest}>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: 10,
                            height: "100%",
                            flex: 1,
                            marginRight: 10,
                            ...(item.itemType === "package" && {
                              borderBottom: "1px solid #EAEBEC",
                            }),
                          }}
                        >
                          {" "}
                          {item?.itemType === "package" ? (
                            <Typography variant="body2" color="textSecondary">
                              Package
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Test
                            </Typography>
                          )}
                          <Typography variant="body1">
                            {item?.name?.en}
                          </Typography>
                        </div>
                        <div>
                          <InfoIcon
                            // @ts-ignore
                            onClick={() => handleOpenDialog2(item?.externalId)}
                            className={classes.infoIcon}
                          />
                        </div>
                      </div>
                    </div>
                    {item?.itemType === "package" && (
                      <>
                        <div className={classes.titleType}>
                          <Typography variant="body2" color="textSecondary">
                            Tests
                          </Typography>
                        </div>

                        {item.tests?.map((item) => (
                          <div className={classes.packageMain} key={item.id}>
                            <CheckIcon />

                            <Typography
                              style={{
                                marginLeft: 10,
                                width: 180,
                              }}
                              variant="body1"
                            >
                              {item?.name.en}
                            </Typography>

                            <InfoIcon
                              // @ts-ignore
                              onClick={() => handleOpenDialog(item?.externalId)}
                              className={classes.infoIcon}
                            />
                          </div>
                        ))}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent>
          <UploadFile qc_id={qcId || 0} handleDialogClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog2} onClose={handleCloseDialog2} maxWidth="md">
        <DialogContent>
          <UploadFile2
            qc_id={qcId || 0}
            handleDialogClose={handleCloseDialog2}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const useStyles = makeStyles(() => ({
  packageModal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #E0E0E0",
  },
  orderItem: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    border: "1px solid #EAEBEC",
    borderRadius: 6,
    marginBottom: 20,
  },
  packageTest: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 70,
  },
  sampleTypeDiv: {
    marginTop: 10,
    borderBottom: "1px solid #E0E0E0",
  },
  sample: {
    borderRadius: 45,
    width: 80,
    background: "#fef0f0",
    marginLeft: 10,
  },
  sampleType: {
    marginTop: 20,
    borderBottom: "1px solid #E0E0E0",
  },
  sample2: {
    color: "#fd6a6a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 500,
    textTransform: "capitalize",
  },
  testName: {
    color: "var(--greyscale-900, #111827)",
    fontFamily: "Inter",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "160%",
    letterSpacing: "0.15px",
  },
  description: {
    color: "var(--greyscale-600, #718096)",
    fontFamily: "Inter",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "160%",
    marginLeft: 50,
    marginTop: 5,
  },
  package: {
    display: "flex",
    color: "var(--greyscale-700, #323B49)",
    fontFamily: "Inter",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "160%",
    marginLeft: 50,
    marginTop: 5,
  },
  packageMain: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  titleType: {
    marginLeft: 10,
    marginTop: 10,
  },
  infoIcon: {
    color: "#969BAD",
    cursor: "pointer",
  },
}));

export default OrderDetailsTab;
