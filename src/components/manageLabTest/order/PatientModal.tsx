import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useMemo, useState } from "react";
import {
  FunctionField,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useNotify,
  useRefresh,
} from "react-admin";

import { labTestUploadDataProvider } from "../../../dataProvider";
import { useRequest } from "../../../hooks";
import ClearBtn from "../Button/ClearBtn";
import DoneBtn from "../Button/DoneBtn";

const PatientModal = ({ record, Order, refetch }) => {
  const classes = useStyles();
  const notify = useNotify();
  const refresh = useRefresh();
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const { refetch: onSubmit } = useRequest(
    `/lab-order/api/v1/admin/orders/${record.id}/order-status`,
    {
      method: "PUT",
      body: {
        orderStatus: "processing",
      },
    },
    {
      onSuccess: () => {
        refresh();
        refetch();
      },
    }
  );
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
  const UploadFile = ({
    handleDialogClose,
  }: {
    handleDialogClose: any;
    qc_id: number;
  }) => {
    const [openDialog2, setOpenDialog2] = useState(false);
    const [, setQcId2] = useState<number | null>(null);

    const { data: managePatient } = useRequest(
      `/lab-order/api/v1/admin/orders/${record.id}/manage-patients`,
      {},
      { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
    );
    const initialCheckedPatients = useMemo(() => {
      const result = [];
      Order?.forEach((patient) => {
        const isPatientInManage = managePatient?.find(
          (managePatient) => managePatient.externalId === patient.externalId
        );
        result[patient.externalId] = isPatientInManage ? true : false;
      });
      return result;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Order, managePatient]);

    const [checkedPatients, setCheckedPatients] = useState(
      initialCheckedPatients
    );

    useEffect(() => {
      setCheckedPatients(initialCheckedPatients);
    }, [initialCheckedPatients]);

    const [addPatientExternalUqids, setAddPatientExternalUqids] = useState<
      number[]
    >([]);
    const [removePatientExternalUqids, setRemovePatientExternalUqids] =
      useState<number[]>([]);

    const handleCheckboxChange = (externalId) => {
      setCheckedPatients((prevChecked) => ({
        ...prevChecked,
        [externalId]: !prevChecked[externalId],
      }));

      setRemovePatientExternalUqids((prevSelected) =>
        initialCheckedPatients[externalId]
          ? [...prevSelected, externalId]
          : prevSelected.filter((id) => id !== externalId)
      );

      setAddPatientExternalUqids((prevSelected) =>
        checkedPatients[externalId]
          ? prevSelected.filter((id) => id !== externalId)
          : [...prevSelected, externalId]
      );
    };
    const { refetch: handleDoneAction } = useRequest(
      `/lab-order/api/v1/admin/order-patients`,
      {
        method: "PUT",
        body: {
          orderUqid: record.id,
          addPatientExternalUqids,
          removePatientExternalUqids,
        },
      },
      {
        onSuccess: () => {
          handleDialogClose();
          refetch();
        },
      }
    );
    const handleOpenDialog2 = (id: number) => {
      setQcId2(id);
      setOpenDialog2(true);
    };
    const handleCloseDialog2 = () => {
      setOpenDialog2(false);
      if (newZoneAdded) {
        setNewZoneAdded(Date.now());
      }
    };
    const UploadFile2 = () => {
      const onSave = async (data) => {
        const formattedPayload = {
          ...data,
          orderUqid: record.id,
        };

        try {
          await labTestUploadDataProvider.create(
            "lab-order/api/v1/admin/order-patients/new",
            {
              data: formattedPayload,
            }
          );
          notify("Successfully save!", { type: "success" });
          refetch();
        } catch (err) {
          notify(`${err}`, {
            type: "error",
          });
        }
      };
      const CustomToolbar = (props) => (
        <Toolbar {...props}>
          <SaveButton style={{ width: "100%" }} />
        </Toolbar>
      );
      const { data: realtion } = useRequest(
        "/patient/api/v1/patient/relation",
        {},
        { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
      );
      const selectRelation = realtion?.map((category) => ({
        id: category?.key,
        name: category?.label?.en,
      }));
      return (
        <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar />}>
          <div style={{ display: "flex", justifyContent: "end" }}>
            {/* @ts-ignore */}
            <ClearIcon
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                handleCloseDialog2();
              }}
              style={{
                fontSize: 35,
                color: "red",
                marginBottom: 10,
                cursor: "pointer",
              }}
            />
          </div>
          <Box>
            <Typography variant="h6" color="initial">
              Add Patient
            </Typography>
            <TextInput
              source="name"
              label="Name"
              variant="outlined"
              fullWidth
              //   optionText="s"
            />
            <TextInput source="age" label="Age" variant="outlined" fullWidth />

            <SelectInput
              variant="outlined"
              fullWidth
              source="gender"
              choices={[
                { id: "male", name: "Male" },
                { id: "female", name: "Female" },
                { id: "male_female", name: "Both" },
              ]}
            />

            <SelectInput
              variant="outlined"
              label="Realtion"
              source="relation"
              alwaysOn
              choices={selectRelation}
              fullWidth
            />
            <TextInput
              source="weight"
              label="Weight"
              variant="outlined"
              fullWidth
            />
          </Box>
        </SimpleForm>
      );
    };
    return (
      <Box style={{ width: 620 }}>
        <ClearBtn handleCloseDialog={handleCloseDialog} />
        <Typography variant="h6" color="initial">
          Assign Patients
        </Typography>
        {managePatient?.map((item) => (
          <div className={classes.assignPatientsDiv} key={item.externalId}>
            <div style={{ display: "flex" }}>
              <img
                src="https://i.ibb.co/fvtDpn2/360-F-335145501-8-Cr-SIh-UYBs-G7-Fg-H7-YPHFI0r-Y5-Ieb-Qy-EO.jpg"
                alt=""
                style={{ width: 60 }}
              />
              <div>
                <Typography variant="h6" color="initial">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="initial">
                  {item.gender}, {item.age} Years, {item.weight}kg
                </Typography>
                <div className={classes.text}>
                  <Typography variant="body2" color="initial">
                    Tests Selected: {item.testCount}
                  </Typography>
                </div>
              </div>
            </div>
            <Checkbox
              checked={checkedPatients[item.externalId]}
              onChange={() => handleCheckboxChange(item.externalId)}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "end" }}>
          <div className={classes.AddBtn}>
            <FunctionField
              label="Actions"
              render={(record: any) => (
                <Box display="flex">
                  {/* @ts-ignore */}
                  <Button
                    variant="contained"
                    disableElevation
                    className={classes.button}
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      handleOpenDialog2(record.id);
                    }}
                    style={{
                      borderRadius: " 4px",
                      background: "var(--warning-main, #ED6C02)",
                      boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    ADD NEW PATIENT
                  </Button>{" "}
                </Box>
              )}
            />
          </div>
          <DoneBtn handleDoneAction={handleDoneAction} />
        </div>
        <Dialog open={openDialog2} onClose={handleCloseDialog2} maxWidth="lg">
          <DialogContent>
            <UploadFile2 />
          </DialogContent>
        </Dialog>
      </Box>
    );
  };
  return (
    <div style={{ display: "flex", justifyContent: "end" }}>
      <div className={classes.AddBtn}>
        <FunctionField
          label="Actions"
          render={(record: any) => (
            <Box display="flex">
              {/* @ts-ignore */}
              <Button
                variant="contained"
                color="primary"
                disableElevation
                className={classes.button}
                disabled={record.orderStatus !== "collected"}
                onClick={onSubmit}
                style={{ textTransform: "uppercase" }}
              >
                All sample submited ?
              </Button>{" "}
            </Box>
          )}
        />
      </div>
      <div className={classes.AddBtn}>
        <FunctionField
          label="Actions"
          render={(record: any) => (
            <Box display="flex">
              {/* @ts-ignore */}
              <Button
                variant="contained"
                color="primary"
                disableElevation
                className={classes.button}
                disabled={
                  record.orderStatus === "collected" ||
                  record.orderStatus === "processing" ||
                  record.orderStatus === "completed" ||
                  record.orderStatus === "tested" ||
                  record.orderStatus === "cancelled"
                }
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  handleOpenDialog(record.id);
                }}
              >
                MANAGE PATIENTS
              </Button>{" "}
            </Box>
          )}
        />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg">
        <DialogContent>
          <UploadFile handleDialogClose={handleCloseDialog} qc_id={qcId || 0} />
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
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "end",
  },
  assignPatientsDiv: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #EAEBEC",
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    backgroundColor: "#E5F6F5",
    color: "#1DA099",
    borderRadius: 42,
    textAlign: "center",
    paddingTop: 5,
    paddingBottom: 5,
    textTransform: "capitalize",
  },
}));

export default PatientModal;
