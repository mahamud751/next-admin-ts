import { makeStyles } from "@mui/styles";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  SaveButton,
  SimpleForm,
  Toolbar,
  useEditContext,
  useRefresh,
} from "react-admin";

import { useRequest } from "@/hooks";
import { Check2Icon } from "@/components/icons";

const stepsStage2 = ["Collected", "Processing", "Completed"];
const orderStatusToStepIndex = {
  collected: 0,
  processing: 1,
  completed: 2,
};

export default function StatusStepperStage2() {
  const classes = useStyles();
  const { record } = useEditContext();
  const refresh = useRefresh();
  const [data, setData] = useState(null);
  const [selectedStage1Status, setSelectedStage1Status] = useState("");
  const [activeStep, setActiveStep] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId] = useState(null);
  const { data: responseData, refetch: orderRefetch } = useRequest(
    `/lab-order/api/v1/admin/orders/${record.id}`,
    {},
    {
      isBaseUrl: true,
      isPreFetching: true,
      isSuccessNotify: false,
      refreshDeps: [record.id],
    }
  );
  useEffect(() => {
    if (responseData) {
      const initialSelectedStage1Status = responseData.orderStatus;
      if (
        initialSelectedStage1Status === "collected" ||
        initialSelectedStage1Status === "processing" ||
        initialSelectedStage1Status === "completed"
      ) {
        const initialActiveStep =
          orderStatusToStepIndex[initialSelectedStage1Status];
        setSelectedStage1Status(initialSelectedStage1Status);
        setActiveStep(initialActiveStep);
        setData(responseData);
      }
    }
  }, [responseData]);

  const { refetch } = useRequest(
    `/lab-order/api/v1/admin/orders/${data?.id}/order-status`,
    {
      method: "PUT",
      body: {
        orderStatus: selectedStage1Status,
      },
    },
    {
      // refreshDeps: [data],
      onSuccess: () => {
        orderRefetch();
        refresh();
      },
    }
  );
  const handleChange = (value) => {
    setSelectedStage1Status(value);
    setActiveStep(orderStatusToStepIndex[value]);
    if (value === "completed") {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const UploadFile = ({
    handleDialogClose,
  }: {
    handleDialogClose: any;
    s_qc_id: number;
  }) => {
    const save = () => {
      handleCloseDialog();
      refetch();
    };
    const CustomToolbar = (props) => (
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
      <SimpleForm onSubmit={save} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />
            <p style={{ fontWeight: "bold" }}>
              Do you want to udpate this order ?
            </p>
          </div>
        </div>
      </SimpleForm>
    );
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" color="primary">
        Stage 2
      </Typography>
      <Box
        sx={{
          display: "flex",
          //@ts-ignore
          gap: "2rem",
          my: 2,
        }}
      >
        <Button
          type="button"
          value={"completed"}
          onClick={() => handleChange("completed")}
          className={classes.cancelBtn}
          style={
            responseData?.orderStatus !== "processing"
              ? { background: "gray", color: "white" }
              : {
                  background: "var(--primary-main, #1DA099)",
                }
          }
          disabled={responseData?.orderStatus !== "processing"}
        >
          {responseData?.orderStatus !== "completed" ? "Complete" : "Completed"}
        </Button>
      </Box>
      <Stepper
        style={{ border: "none", padding: 0 }}
        activeStep={activeStep}
        alternativeLabel
      >
        {stepsStage2.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent style={{ maxWidth: "850px" }}>
          <UploadFile
            s_qc_id={qcId || 0}
            handleDialogClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

const useStyles = makeStyles(() => ({
  buttonCancel: {
    backgroundColor: "red",
    marginRight: 10,
    width: 120,
  },
  cancelBtn: {
    borderRadius: "4px",
    boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.05)",
    display: "flex",
    width: "140px",
    height: " 40px",
    alignItems: "center",
    color: "#FFFFFF",
  },
  updateBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "250px",
  },
}));
