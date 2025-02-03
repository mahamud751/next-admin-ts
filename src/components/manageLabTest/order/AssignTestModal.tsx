import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import {
  FunctionField,
  SaveButton,
  SimpleForm,
  Toolbar,
  useRefresh,
} from "react-admin";

import { useRequest } from "@/hooks";
import { capitalizeFirstLetter } from "@/utils/helpers";
import ClearBtn from "../Button/ClearBtn";

import { Check2Icon, LabTestAssignIcon } from "../../icons";
import UpdateTestModal from "./UpdateTestModal";

const AssignTestModal = ({ record, refetch, row }) => {
  const classes = useStyles();
  const refresh = useRefresh();
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sample, setSample] = useState("");
  const [, setQcId] = useState<number | null>(null);
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
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [openDialog4, setOpenDialog4] = useState(false);
  const [openDialog5, setOpenDialog5] = useState(false);
  const [qcId2, setQcId2] = useState<number | null>(null);
  const [qcText, setQcText] = useState<string | null>(null);

  const { data: manageTest } = useRequest(
    `/lab-order/api/v1/admin/order-patients/${row.id}/tests`,
    {},
    {
      isBaseUrl: true,
      isPreFetching: true,
      isSuccessNotify: false,
      refreshDeps: [row],
    }
  );

  const handleOpenDialog2 = (id: number, name: string) => {
    setQcId2(id);
    setQcText(name);
    setOpenDialog2(true);
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const handleOpenDialog3 = (id: number, name: string) => {
    setQcId2(id);
    setQcText(name);
    setOpenDialog3(true);
  };
  const handleCloseDialog3 = () => {
    setOpenDialog3(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const handleOpenDialog4 = (id: number, name: string) => {
    setQcId2(id);
    setQcText(name);
    setOpenDialog4(true);
  };
  const handleCloseDialog4 = () => {
    setOpenDialog4(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const handleOpenDialog5 = (id: number, name: string) => {
    setQcId2(id);
    setQcText(name);
    setOpenDialog5(true);
  };
  const handleCloseDialog5 = () => {
    setOpenDialog5(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const UploadFile2 = ({
    qc_id2,
    qcText,
    handleDialogClose2,
  }: {
    handleDialogClose2: any;
    qcText: string;
    qc_id2: number;
  }) => {
    const { refetch: handleDoneAction } = useRequest(
      `/lab-order/api/v1/admin/order-patients/${row.id}/tests/${qc_id2}`,
      {
        method: "PUT",
        body: {
          orderUqid: record.id,
          trackingNumber: manageTest?.trackingNumber,
        },
      },
      {
        onSuccess: () => {
          handleDialogClose2();
          refetch();
        },
      }
    );
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <Button
          variant="contained"
          disableElevation
          className={classes.buttonCancel}
          onClick={handleDialogClose2}
        >
          Cancel
        </Button>{" "}
        <SaveButton style={{ width: 120 }} label="Confirm" />
      </Toolbar>
    );
    return (
      <SimpleForm onSubmit={handleDoneAction} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />

            <p style={{ fontWeight: "bold" }}>Are you sure ?</p>
            <p>Did you collect a sample for the</p>
            <p style={{ color: "#1DA099" }}>{qcText}</p>
          </div>
        </div>
      </SimpleForm>
    );
  };
  const UploadFile3 = ({
    qc_id2,
    qcText,
    handleDialogClose3,
  }: {
    handleDialogClose3: any;
    qcText: string;
    qc_id2: number;
  }) => {
    const { refetch: handleRemoveAction } = useRequest(
      `/lab-order/api/v1/admin/order-patients/${row.id}/tests/${qc_id2}`,
      {
        method: "PUT",
        body: {
          orderUqid: record.id,
          trackingNumber: "",
        },
      },
      {
        onSuccess: () => {
          handleDialogClose3();
          refetch();
        },
      }
    );
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <Button
          variant="contained"
          disableElevation
          className={classes.buttonCancel}
          onClick={handleDialogClose3}
        >
          Cancel
        </Button>{" "}
        <SaveButton style={{ width: 120 }} label="Confirm" />
      </Toolbar>
    );
    return (
      <SimpleForm onSubmit={handleRemoveAction} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />

            <p style={{ fontWeight: "bold" }}>Are you sure ?</p>
            <p>Do you want to clear sample collection for the </p>
            <p style={{ color: "#1DA099" }}>{qcText}</p>
          </div>
        </div>
      </SimpleForm>
    );
  };
  const UploadFile4 = ({
    qcText,
    handleDialogClose4,
  }: {
    handleDialogClose4: any;
    qcText: string;
    qc_id2: number;
  }) => {
    const { refetch: handleDoneAction } = useRequest(
      `/lab-order/api/v1/admin/order-patients/${row.id}/tests`,
      {
        method: "PUT",
        body: {
          orderUqid: record.id,
          trackingNumber: manageTest?.trackingNumber,
          sampleType: sample,
        },
      },
      {
        onSuccess: () => {
          handleDialogClose4();
          refetch();
        },
      }
    );
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <Button
          variant="contained"
          disableElevation
          className={classes.buttonCancel}
          onClick={handleDialogClose4}
        >
          Cancel
        </Button>{" "}
        <SaveButton style={{ width: 120 }} label="Confirm" />
      </Toolbar>
    );
    return (
      <SimpleForm onSubmit={handleDoneAction} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />

            <p style={{ fontWeight: "bold" }}>Are you sure ?</p>
            <p>Did you collect a sample for the</p>
            <p style={{ color: "#1DA099" }}>{capitalizeFirstLetter(qcText)}</p>
          </div>
        </div>
      </SimpleForm>
    );
  };
  const UploadFile5 = ({
    qcText,
    handleDialogClose5,
  }: {
    handleDialogClose5: any;
    qcText: string;
    qc_id2: number;
  }) => {
    const { refetch: handleDoneAction } = useRequest(
      `/lab-order/api/v1/admin/order-patients/${row.id}/tests`,
      {
        method: "PUT",
        body: {
          orderUqid: record.id,
          trackingNumber: "",
          sampleType: sample,
        },
      },
      {
        onSuccess: () => {
          handleDialogClose5();
          refetch();
        },
      }
    );
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <Button
          variant="contained"
          disableElevation
          className={classes.buttonCancel}
          onClick={handleDialogClose5}
        >
          Cancel
        </Button>{" "}
        <SaveButton style={{ width: 120 }} label="Confirm" />
      </Toolbar>
    );
    return (
      <SimpleForm onSubmit={handleDoneAction} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />

            <p style={{ fontWeight: "bold" }}>Are you sure ?</p>
            <p>Did you collect a sample for the</p>
            <p style={{ color: "#1DA099" }}>{capitalizeFirstLetter(qcText)}</p>
          </div>
        </div>
      </SimpleForm>
    );
  };

  return (
    <div>
      <div className={classes.AddBtn}>
        <FunctionField
          label="Actions"
          render={(record: any) => (
            <Box display="flex" style={{ marginLeft: 10 }}>
              <LabTestAssignIcon
                //@ts-ignore
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  handleOpenDialog(record.id);
                }}
                style={{ cursor: "pointer" }}
              />
            </Box>
          )}
        />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg">
        <DialogContent>
          <Box style={{ width: 620 }}>
            <ClearBtn handleCloseDialog={handleCloseDialog} />
            <div
              style={{
                display: "flex",
              }}
            >
              <Typography variant="h6" color="initial">
                Select Test for {row.name}
              </Typography>
              <div className={classes.trackingDiv}>
                <Typography className={classes.TrackingText}>
                  Tracking# {manageTest?.formattedTrackingNumber}
                </Typography>
              </div>
            </div>

            <UpdateTestModal
              manageTest={manageTest}
              row={row}
              refresh={refresh}
              handleOpenDialog3={handleOpenDialog3}
              handleOpenDialog4={handleOpenDialog4}
              handleOpenDialog2={handleOpenDialog2}
              handleCloseDialog={handleCloseDialog}
              handleOpenDialog5={handleOpenDialog5}
              sample={sample}
              setSample={setSample}
            />
            <Dialog
              open={openDialog2}
              onClose={handleCloseDialog2}
              maxWidth="lg"
            >
              <DialogContent>
                <UploadFile2
                  handleDialogClose2={handleCloseDialog2}
                  qc_id2={qcId2 || 0}
                  qcText={qcText}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={openDialog3}
              onClose={handleCloseDialog3}
              maxWidth="lg"
            >
              <DialogContent>
                <UploadFile3
                  handleDialogClose3={handleCloseDialog3}
                  qc_id2={qcId2 || 0}
                  qcText={qcText}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={openDialog4}
              onClose={handleCloseDialog4}
              maxWidth="lg"
            >
              <DialogContent>
                <UploadFile4
                  handleDialogClose4={handleCloseDialog4}
                  qc_id2={qcId2 || 0}
                  qcText={qcText}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={openDialog5}
              onClose={handleCloseDialog5}
              maxWidth="lg"
            >
              <DialogContent>
                <UploadFile5
                  handleDialogClose5={handleCloseDialog5}
                  qc_id2={qcId2 || 0}
                  qcText={qcText}
                />
              </DialogContent>
            </Dialog>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  flex: {
    display: "flex",
    justifyContent: "end",
    width: "100%",
  },
  button: {
    marginRight: 10,
    textTransform: "capitalize",
  },
  buttonCancel: {
    backgroundColor: "red",
    marginRight: 10,
    width: 120,
  },
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "end",
  },
  trackingDiv: {
    backgroundColor: "#E5F6F5",
    color: "#1DA099",
    borderRadius: 42,
    textAlign: "center",
    padding: 7,
    textTransform: "capitalize",
    marginLeft: 20,
  },
  TrackingText: {
    color: "var(--others-blue, #0062FF)",
    fontFeatureSettings: `'clig' off, 'liga' off`,
    fontWeight: 400,
  },
  updateBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "250px",
  },
}));
export default AssignTestModal;
