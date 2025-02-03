import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Theme,
  Typography,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import clsx from "clsx";
import { useState } from "react";

import { useRequest } from "@/hooks";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { CheckIcon, RemoveIcon } from "../../icons";

const UpdateTestModal = ({
  manageTest,
  handleOpenDialog3,
  handleOpenDialog2,
  handleOpenDialog4,
  handleOpenDialog5,
  sample,
  setSample,
  row,
  refresh,
  handleCloseDialog,
}) => {
  const classes = useStyles();
  const [expandedPatients, setExpandedPatients] = useState({});
  const [refrenceInput, setRefrenceInput] = useState("");
  const handleExpandClick = (patientId) => {
    setExpandedPatients((prevState) => ({
      ...prevState,
      [patientId]: !prevState[patientId],
    }));
  };
  const { refetch: onSave } = useRequest(
    `/lab-order/api/v1/admin/order-patients/${row.id}`,
    {
      method: "PUT",
      body: {
        vendorReferenceNumber: refrenceInput,
      },
    },
    {
      onSuccess: () => {
        refresh();
        handleCloseDialog();
      },
    }
  );

  return (
    <div>
      <div>
        <div style={{ display: "flex" }}>
          <div>
            {manageTest?.testGroups?.map((testGroup) => (
              <div className={classes.assignPatientsDiv} key={testGroup.id}>
                <div style={{ display: "flex" }}>
                  <Typography variant="h6" color="initial">
                    Sample Type:{" "}
                  </Typography>
                  <div className={classes.sampleDiv}>
                    <Typography variant="body2">
                      {testGroup?.sampleRequirement.en}
                    </Typography>
                  </div>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]:
                        expandedPatients[testGroup?.sampleRequirement.en],
                    })}
                    onClick={() =>
                      handleExpandClick(testGroup?.sampleRequirement.en)
                    }
                    aria-expanded={
                      expandedPatients[testGroup?.sampleRequirement.en]
                    }
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>

                <Collapse
                  in={expandedPatients[testGroup?.sampleRequirement.en]}
                  timeout="auto"
                  unmountOnExit
                >
                  <FormControlLabel
                    label={`All ${capitalizeFirstLetter(
                      testGroup?.sampleRequirement.en
                    )} Sample collected`}
                    control={
                      <Checkbox
                        value={sample}
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          const isCompleted =
                            testGroup?.testGroupStatus === "completed";
                          if (isCompleted) {
                            handleOpenDialog5(
                              manageTest.externalId,
                              testGroup.sampleRequirement?.en
                            );
                          } else {
                            handleOpenDialog4(
                              manageTest.externalId,
                              testGroup.sampleRequirement?.en
                            );
                          }
                        }}
                        checked={testGroup?.testGroupStatus === "completed"}
                        onChange={() =>
                          setSample(testGroup?.sampleRequirement?.en)
                        }
                      />
                    }
                  />

                  {testGroup?.tests?.map((test) => (
                    <div className={classes.assignTestsDiv} key={test.id}>
                      <div>
                        <Typography>{test?.name.en}</Typography>
                        <Typography>
                          Tube type:{" "}
                          <span
                            style={{
                              color: "#38BDF8",
                            }}
                          >
                            Plain
                          </span>
                        </Typography>
                        {test?.testStatus === "completed" ? (
                          <Typography
                            style={{
                              color: "#1DA099",
                            }}
                          >
                            Sample collected
                          </Typography>
                        ) : (
                          <Typography
                            style={{
                              color: "#F44336",
                            }}
                          >
                            Sample not collected
                          </Typography>
                        )}
                      </div>
                      <div>
                        {test?.testStatus === "completed" ? (
                          <>
                            {/* @ts-ignore */}
                            <Button
                              disableElevation
                              onClick={(e: MouseEvent) => {
                                e.stopPropagation();
                                handleOpenDialog3(test.id, test.name.en);
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
                                e.stopPropagation();
                                handleOpenDialog2(test.id, test.name.en);
                              }}
                            >
                              <CheckIcon />
                            </Button>{" "}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </Collapse>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Typography variant="h6" color="initial">
          Reference Number *
        </Typography>

        <Box
          style={{
            width: "100%",
            padding: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label={
              manageTest?.vendorReferenceNumber
                ? manageTest?.vendorReferenceNumber
                : "Enter reference number "
            }
            defaultValue={manageTest?.vendorReferenceNumber}
            variant="outlined"
            onChange={(e) => setRefrenceInput(e.target.value)}
            style={{ width: "50%" }}
          />
          <Button
            variant="contained"
            className={classes.button}
            onClick={onSave}
            style={{
              width: "30%",
              cursor: "pointer",
              borderRadius: " 4px",
              background: "var(--primary-main, #1DA099)",
              boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.05)",
            }}
          >
            Update Reference
          </Button>{" "}
        </Box>
      </div>
    </div>
  );
};
const theme = createTheme({});
const useStyles = makeStyles(() => ({
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
  button: {
    marginRight: 10,
    textTransform: "capitalize",
  },
  assignPatientsDiv: {
    borderTop: "1px solid #EAEBEC",
    borderBottom: "1px solid #EAEBEC",
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    width: "600px",
  },
  assignTestsDiv: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px dashed #EAEBEC",
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    width: "600px",
  },
  sampleDiv: {
    backgroundColor: "#F44336",
    color: "#FFFFFF",
    borderRadius: 42,
    textAlign: "center",
    padding: "5px",
    textTransform: "capitalize",
    marginLeft: 20,
    width: 60,
    height: 24,
  },
}));
export default UpdateTestModal;
