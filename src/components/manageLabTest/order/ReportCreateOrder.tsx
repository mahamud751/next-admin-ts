import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Pagination,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import {
  FileField,
  FileInput,
  SaveButton,
  SimpleForm,
  Toolbar,
  useNotify,
} from "react-admin";

import VisibilityIcon from "@/components/icons/VisibilityIcon";

import { labTestUploadDataProvider } from "@/dataProvider";
import { httpClient } from "@/utils/http";
import DeleteIcon from "../../icons/DeleteIcon";
import { Check2Icon, NotVisibilityIcon } from "../../icons";
import CustomReportCreate from "./CustomReportCreate";

const ReportCreateOrder = ({
  patients,
  currentPage,
  setCurrentPage,
  reportsPerPage,
  refetch,
  patient,
  setUpdateStatus,
  labReport,
  total,
}) => {
  const classes = useStyles();
  const notify = useNotify();
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId2, setQcId2] = useState<number | null>(null);
  const [qcId3, setQcId3] = useState<number | null>(null);
  const [modalType, setModalType] = useState(null);

  let modalContent = null;
  const handleOpenDialog = (id: number, id2: number, type: string) => {
    setQcId2(id);
    setQcId3(id2);
    setModalType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setModalType(null);
    setOpenDialog(false);
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    refetch(value);
  };

  const totalPages = Math.ceil(total / reportsPerPage);
  const onSave = async (data) => {
    const formattedPayload = {
      ...data,
    };
    try {
      await labTestUploadDataProvider.create(
        `lab-order/api/v1/admin/order-patients/${patients}/reports`,
        {
          data: formattedPayload,
        }
      );
      notify("Successfully save!", { type: "success" });
      refetch();
      handleCloseDialog();
    } catch (err) {
      notify(`${err}`, {
        type: "error",
      });
    }
  };

  const CustomToolbar2 = (props) => (
    <Toolbar {...props}>
      <SaveButton />
    </Toolbar>
  );
  const CustomToolbar = (props: any) => (
    <Toolbar {...props} toolbar={<CustomToolbar />}>
      <Button
        variant="contained"
        disableElevation
        className={classes.buttonCancel}
        onClick={handleCloseDialog}
      >
        Cancel
      </Button>{" "}
      <SaveButton style={{ width: 120 }} label="Confirm" />
    </Toolbar>
  );
  const UploadFile = ({
    qc_id,
    qc_id2,
    handleDialogClose,
  }: {
    qc_id: any;
    qc_id2: any;
    handleDialogClose: any;
  }) => {
    const handleCartItemDelete = (mainId, cartItemId) => {
      httpClient(
        `/lab-order/api/v1/admin/order-patients/${mainId}/reports/${cartItemId}`,
        {
          method: "DELETE",
        }
      )
        .then(() => {
          notify("Item deleted successfully", { type: "success" });
          refetch();
          handleCloseDialog();
        })
        .catch((error) => {
          notify(` ${error}`, { type: "error" });
        });
    };
    const CustomToolbar = (props: any) => (
      <Toolbar {...props} toolbar={<CustomToolbar />}>
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
      <SimpleForm
        onSubmit={() => handleCartItemDelete(qc_id, qc_id2)}
        toolbar={<CustomToolbar />}
      >
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "none" }}></div>
              <div className="name">
                <strong> Are you sure want to Delete This Report? </strong>
              </div>
            </div>
          </div>
        </div>
      </SimpleForm>
    );
  };
  const UploadFile2 = ({
    s_qc_id,
    s_qc_id2,
    handleDialogClose2,
  }: {
    s_qc_id: number;
    s_qc_id2: number;
    handleDialogClose2: any;
  }) => {
    const body = {
      reportStatus: "unpublish",
    };
    const handleSuccess = () => {
      setUpdateStatus(Date.now());
    };
    return (
      <CustomReportCreate
        body={body}
        s_qc_id={s_qc_id}
        s_qc_id2={s_qc_id2}
        handleDialogClose={handleDialogClose2}
        onSuccess={handleSuccess}
      />
    );
  };
  const UploadFile3 = ({
    s_qc_id,
    s_qc_id2,
    handleDialogClose3,
  }: {
    s_qc_id: number;
    s_qc_id2: number;
    handleDialogClose3: any;
  }) => {
    const body = {
      reportStatus: "publish",
    };
    const handleSuccess = () => {
      setUpdateStatus(Date.now());
    };
    return (
      <CustomReportCreate
        body={body}
        s_qc_id={s_qc_id}
        s_qc_id2={s_qc_id2}
        handleDialogClose={handleDialogClose3}
        onSuccess={handleSuccess}
      />
    );
  };

  switch (modalType) {
    case "delete":
      modalContent = (
        <UploadFile
          handleDialogClose={handleCloseDialog}
          qc_id={qcId2}
          qc_id2={qcId3}
        />
      );
      break;
    case "unpublish":
      modalContent = (
        <UploadFile2
          handleDialogClose2={handleCloseDialog}
          s_qc_id={qcId2}
          s_qc_id2={qcId3}
        />
      );
      break;
    case "publish":
      modalContent = (
        <UploadFile3
          handleDialogClose3={handleCloseDialog}
          s_qc_id={qcId2}
          s_qc_id2={qcId3}
        />
      );
      break;
    default:
      modalContent = null;
  }

  return (
    <div>
      <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar2 />}>
        <FileInput
          source="attachedFiles-reportUrl"
          label="Upload Reports"
          //   accept="image/*, application/pdf"
          maxSize={50000000}
          multiple
        >
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
      <CardContent>
        <div className={classes.cartDetails2}>
          <Grid container spacing={1} className={classes.cartDetails3}>
            <Grid alignItems="center" item md={4} container>
              <Box marginLeft={2}>
                <Typography variant="body1">Name</Typography>
              </Box>
            </Grid>
            <Grid alignItems="center" item md={4} container>
              <Box marginLeft={2}>
                <Typography variant="body1">Status</Typography>
              </Box>
            </Grid>
            <Grid alignItems="center" item md={4} container>
              <Box marginLeft={2}>
                <Typography variant="body1">Action</Typography>
              </Box>
            </Grid>
          </Grid>
          {labReport?.map((report) => {
            return (
              <div>
                <Grid container spacing={1} style={{ margin: "10px 0px" }}>
                  <Grid alignItems="center" item md={4} container>
                    <Box marginLeft={2}>
                      <Typography variant="body2" color="textSecondary">
                        {report?.reportName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid alignItems="center" item md={4} container>
                    <Box marginLeft={2}>
                      {report.status && report.status === "active" && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{
                            color: report.status === "active" ? "#27ac94" : "",
                          }}
                        >
                          Published
                        </Typography>
                      )}
                      {report.status && report.status === "inactive" && (
                        <Typography variant="body2" color="textSecondary">
                          Not Published
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid alignItems="center" item md={4} container>
                    <Box marginLeft={2}>
                      {report.status === "active" ? (
                        <a
                          href={report.reportUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <VisibilityIcon />
                        </a>
                      ) : (
                        <a
                          href={report.reportUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <NotVisibilityIcon />
                        </a>
                      )}
                      <button
                        // @ts-ignore
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          handleOpenDialog(patient.id, report.id, "delete");
                        }}
                        style={{
                          cursor: "pointer",
                          margin: "0px 10px",
                          border: "none",
                          background: "none",
                          padding: 0,
                        }}
                      >
                        <DeleteIcon />
                      </button>

                      <button
                        // @ts-ignore
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          handleOpenDialog(patient.id, report.id, "unpublish");
                        }}
                        style={{
                          cursor: "pointer",
                          background: "none",
                        }}
                      >
                        <NotInterestedIcon />
                      </button>
                      <button
                        // @ts-ignore
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          handleOpenDialog(patient.id, report.id, "publish");
                        }}
                        style={{
                          cursor: "pointer",
                          marginLeft: 10,
                          background: "none",
                        }}
                      >
                        <DoneIcon />
                      </button>
                    </Box>
                  </Grid>
                </Grid>
              </div>
            );
          })}
        </div>
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </CardContent>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>{modalContent}</DialogContent>
      </Dialog>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  cartDetails2: {
    border: "1px solid #EAEBEC",
    borderLeft: "1px solid #EAEBEC",
    borderRight: "1px solid #EAEBEC",
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  cartDetails3: {
    borderBottom: "1px solid #EAEBEC",
    background: "#FFF",
    padding: 5,
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

export default ReportCreateOrder;
