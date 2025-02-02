import {
  Box,
  Button,
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
import { FC, useState } from "react";
import {
  ImageField,
  ImageInput,
  SaveButton,
  ShowProps,
  SimpleForm,
  Toolbar,
  useEditContext,
  useNotify,
  useRefresh,
} from "react-admin";
import { useParams } from "react-router-dom";

import { labTestUploadDataProvider } from "@/dataProvider";
import { useRequest } from "@/hooks";

import ClearBtn from "@/components/manageLabTest/Button/ClearBtn";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { Check2Icon } from "@/components/icons";
import { makeStyles } from "@mui/styles";

const HomeBanner: FC = () => {
  const classes = useStyles();
  const { record } = useEditContext();
  const refresh = useRefresh();
  const { id } = useParams<{ id: string }>();
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [, setDialogId] = useState<number | null>(null);
  const [qcId, setQcId] = useState<number | null>(null);
  const [qcId2, setQcId2] = useState<number | null>(null);
  const { data } = useRequest(
    `/misc/api/v1/admin/lab-items/banner-image/${record?.id}`,
    {},
    {
      isBaseUrl: true,
      isPreFetching: true,
      isSuccessNotify: false,
    }
  );
  const notify = useNotify();
  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleOpenDialog2 = (id: number) => {
    setQcId2(id);
    setOpenDialog2(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const handleCloseDialog2 = () => {
    setDialogId(null);
    setOpenDialog2(false);
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
        itemId: record.id,
      };
      try {
        await labTestUploadDataProvider.create(
          `misc/api/v1/admin/lab-items/banner-image`,
          {
            data: formattedPayload,
          }
        );
        notify("Successfully save!", { type: "success" });
        handleDialogClose();
        refresh();
      } catch (err) {
        notify(`${err}`, {
          type: "error",
        });
      }
    };

    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <SaveButton />
      </Toolbar>
    );
    return (
      <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar />}>
        <ClearBtn handleCloseDialog={handleCloseDialog} />
        <Box>
          <Typography variant="h6" color="initial">
            Add Banner Image
          </Typography>
          <ImageInput
            source="attachedFiles-banner-image"
            label="Banner( WEB 1080*1080 px )"
            // accept="image/*"
            maxSize={10000000}
            multiple
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        </Box>
      </SimpleForm>
    );
  };
  const UploadFile2 = ({
    qc_id,
    handleDialogClose2,
  }: {
    qc_id: any;
    handleDialogClose2: any;
  }) => {
    const { refetch } = useRequest(
      `/misc/api/v1/admin/lab-items/banner-image/${qc_id.id}`,
      {
        method: "DELETE",
      },
      {
        onSuccess: () => {
          handleDialogClose2();
          refresh();
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
      <SimpleForm onSubmit={refetch} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />
            <p style={{ fontWeight: "bold" }}>
              Do you want to remove this banner image?
            </p>
          </div>
        </div>
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
                <TableCell align="left">
                  Image Banner( WEB 1080*1080 px )
                </TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left">
                    <img
                      src={row.src}
                      alt="bannenr img"
                      style={{ width: 120 }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <button
                      //@ts-ignore
                      onClick={(e: MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenDialog2(row);
                      }}
                    >
                      <DeleteIcon />
                    </button>
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
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogContent>
          <UploadFile2
            handleDialogClose2={() => {
              handleCloseDialog2();
            }}
            qc_id={qcId2}
          />
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

export default HomeBanner;
