import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useMemo, useState } from "react";
import { FunctionField, useRefresh } from "react-admin";

import { useRequest } from "@/hooks";
import ClearBtn from "../Button/ClearBtn";
import DoneBtn from "../Button/DoneBtn";
import { LabTestAddIcon } from "../../icons";

const TestModal = ({ record, refetch, row }) => {
  const classes = useStyles();
  const refresh = useRefresh();
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const { data: Order } = useRequest(
    `/lab-order/api/v1/admin/order-patients/${row.id}/items?page=1&limit=10`,
    {},
    { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
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
    const { data: manageTest } = useRequest(
      `/lab-order/api/v1/admin/order-patients/${row.id}/manage-items`,
      {},
      { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
    );
    const initialCheckedPatients = useMemo(() => {
      const result = [];
      Order?.forEach((patient) => {
        const isPatientInManage = manageTest?.find(
          (manageTest) => manageTest.id === patient.id
        );
        result[patient.id] = isPatientInManage ? true : false;
      });
      return result;
    }, [manageTest]);

    const [checkedPatients, setCheckedPatients] = useState(
      initialCheckedPatients
    );
    useEffect(() => {
      setCheckedPatients(initialCheckedPatients);
    }, [initialCheckedPatients]);
    const [addOrderItemUqids, setAddPatientExternalUqids] = useState<number[]>(
      []
    );

    const [removeOrderItemUqids, setRemovePatientExternalUqids] = useState<
      number[]
    >([]);

    const handleCheckboxChange = (id) => {
      setCheckedPatients((prevChecked) => ({
        ...prevChecked,
        [id]: !prevChecked[id],
      }));
      if (checkedPatients[id]) {
        setRemovePatientExternalUqids((prevSelected) => [...prevSelected, id]);
        setAddPatientExternalUqids((prevSelected) =>
          prevSelected?.filter((selectedId) => selectedId !== id)
        );
      } else {
        setAddPatientExternalUqids((prevSelected) => [...prevSelected, id]);
        setRemovePatientExternalUqids((prevSelected) =>
          prevSelected.filter((selectedId) => selectedId !== id)
        );
      }
    };
    const { refetch: handleDoneAction } = useRequest(
      `/lab-order/api/v1/admin/order-patients/${row.id}/items`,

      {
        method: "PUT",
        body: {
          orderUqid: record.id,
          addOrderItemUqids,
          removeOrderItemUqids,
        },
      },
      {
        onSuccess: () => {
          refresh();
          refetch();
          handleDialogClose();
        },
      }
    );

    return (
      <Box style={{ width: 620 }}>
        <ClearBtn handleCloseDialog={handleCloseDialog} />
        <Typography variant="h6" color="initial">
          Select Test for {row?.name}
        </Typography>
        {manageTest?.map((item) => (
          <div className={classes.assignPatientsDiv} key={item.id}>
            <div style={{ display: "flex" }}>
              <Checkbox
                checked={checkedPatients[item.id]}
                onChange={() => handleCheckboxChange(item.id)}
                inputProps={{
                  "aria-label": "primary checkbox",
                }}
              />

              <div>
                <Typography variant="h6" color="initial">
                  {item.name.en}
                </Typography>
                <div
                  style={{
                    width: 93,
                    backgroundColor: "#E5F6F5",
                    color: "#1DA099",
                    borderRadius: 42,
                    textAlign: "center",
                    paddingTop: 5,
                    paddingBottom: 5,
                    textTransform: "capitalize",
                  }}
                >
                  <Typography variant="body2" color="initial">
                    {item.itemType}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        ))}
        <DoneBtn handleDoneAction={handleDoneAction} />
      </Box>
    );
  };
  return (
    <div>
      <div className={classes.AddBtn}>
        <FunctionField
          label="Actions"
          render={(record: any) => (
            <Box display="flex">
              <LabTestAddIcon
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
}));

export default TestModal;
