import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FC, useState } from "react";
import {
  SaveButton,
  SelectInput,
  ShowProps,
  SimpleForm,
  TextInput,
  Toolbar,
  useNotify,
  useRefresh,
} from "react-admin";
import { useParams } from "react-router-dom";

import { labTestUploadDataProvider } from "@/dataProvider";
import { useDocumentTitle, useRequest } from "@/hooks";
import ClearBtn from "@/components/manageLabTest/Button/ClearBtn";

const LabPatientShow: FC<ShowProps> = () => {
  useDocumentTitle("Arogga | Lab Test | Patient");
  const classes = useStyles();
  const refresh = useRefresh();
  const { id }: { id: string } = useParams();
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const { data, refetch } = useRequest(
    `/patient/api/v1/admin/patient/${id}`,
    {},
    {
      isBaseUrl: true,
      isPreFetching: true,
      isSuccessNotify: false,
      refreshDeps: [id],
      isRefresh: true,
    }
  );

  const userId = data ? data[0].userId : "";
  const notify = useNotify();
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
    const onSave = async (data) => {
      const formattedPayload = {
        ...data,
        userId: userId,
      };
      try {
        await labTestUploadDataProvider.create("patient/api/v1/admin/patient", {
          data: formattedPayload,
        });

        notify("Successfully save!", { type: "success" });
        refresh();
        refetch();
        handleDialogClose();
      } catch (err) {
        notify(`Something went wrong! Please try again! &${err}`, {
          type: "error",
        });
      }
    };
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <SaveButton />
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
      <SimpleForm save={onSave} toolbar={<CustomToolbar />}>
        <ClearBtn handleCloseDialog={handleCloseDialog} />
        <Box>
          <Typography variant="h6" color="initial">
            Add Patient
          </Typography>
          <TextInput source="name" label="Name" variant="outlined" fullWidth />
          <TextInput source="age" label="Age" variant="outlined" fullWidth />

          <SelectInput
            variant="outlined"
            fullWidth
            source="gender"
            choices={[
              { id: "male", name: "Male" },
              { id: "female", name: "Female" },
              { id: "other", name: "Others" },
            ]}
          />

          <SelectInput
            variant="outlined"
            label="Realtion"
            source="relation"
            choices={selectRelation}
            fullWidth
            alwaysOn
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
    <div>
      <div className={classes.AddBtn}>
        <Box display="flex">
          {/* @ts-ignore */}
          <Button
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              //@ts-ignore
              handleOpenDialog(id);
            }}
          >
            Add New
          </Button>{" "}
        </Box>
      </div>
      {data?.length === 0 ? (
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
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Gender</TableCell>
                <TableCell align="left">Age</TableCell>
                <TableCell align="left">Weight</TableCell>
                <TableCell align="left">Reason</TableCell>
                <TableCell align="left">Relation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">
                    <span className={classes.captialLetter}> {row.gender}</span>
                  </TableCell>
                  <TableCell align="left">{row.age}</TableCell>
                  <TableCell align="left">
                    {row.weight && <span>{row.weight} KG</span>}
                  </TableCell>
                  <TableCell align="left">{row.reason}</TableCell>
                  <TableCell align="left">
                    <span className={classes.captialLetter}>
                      {" "}
                      {row.relation}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent>
          <UploadFile handleDialogClose={handleCloseDialog} qc_id={qcId || 0} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  captialLetter: {
    textTransform: "capitalize",
  },
  clearBtn: {
    color: "#EF1962",
    cursor: "pointer",
  },
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

export default LabPatientShow;
