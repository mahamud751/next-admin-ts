import { SetStateAction, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useEditContext,
  useRefresh,
} from "react-admin";

import ClearBtn from "@/components/manageLabTest/Button/ClearBtn";
import { getColorByStatus } from "@/utils/helpers";
import EditIcon from "@/components/icons/EditIcon";
import { useRequest } from "@/hooks";

const Faq = () => {
  const classes = useStyles();
  const { record } = useEditContext();
  const refresh = useRefresh();
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [qcId2, setQcId2] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };
  const { data: Order, total } = useRequest(
    `/misc/api/v1/admin/lab-items/faq?itemId=${record.id}&page=${
      currentPage + 1
    }&limit=${rowsPerPage}`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );

  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog2 = (id: number) => {
    setQcId2(id);
    setOpenDialog2(true);
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  const UploadFile = ({ qc_id }: { handleDialogClose: any; qc_id: number }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { refetch: onSave } = useRequest(
      `/misc/api/v1/admin/lab-items/faq`,
      {
        method: "POST",
        body: {
          title: { en: title, bn: "bn" },
          description: { en: description, bn: "bn" },
          itemId: record.id,
        },
      },
      {
        onSuccess: () => {
          refresh();
        },
      }
    );
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <SaveButton />
      </Toolbar>
    );

    return (
      <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar />}>
        <ClearBtn handleCloseDialog={handleCloseDialog} />
        <TextInput
          source="title[en]"
          variant="outlined"
          label="Title(EN)"
          multiline
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="outlined-multiline-static"
          label="Test Descriptions (EN)"
          multiline
          rows={4}
          variant="outlined"
          onChange={(e) => setDescription(e.target.value)}
        />
      </SimpleForm>
    );
  };
  const UploadFile2 = ({
    qc_id2,
  }: {
    handleDialogClose2: any;
    qc_id2: any;
  }) => {
    const [title, setTitle] = useState(qc_id2?.title?.en || null);
    const [description, setDescription] = useState(
      qc_id2?.description?.en || null
    );
    const [status, setStatus] = useState(qc_id2?.status || null);
    useEffect(() => {
      setTitle(qc_id2?.title?.en || null);
      setDescription(qc_id2?.description?.en || null);
      setStatus(qc_id2?.status || null);
    }, [qc_id2]);

    const { refetch: onSave } = useRequest(
      `/misc/api/v1/admin/lab-items/faq/${qc_id2?.id}`,
      {
        method: "PUT",
        body: {
          title: { en: title, bn: "bn" },
          description: { en: description, bn: "bn" },
          itemId: record.id,
          status: status,
          __v: qc_id2?.__v,
        },
      },
      {
        onSuccess: () => {
          refresh();
        },
      }
    );
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <SaveButton />
      </Toolbar>
    );

    return (
      <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar />}>
        <ClearBtn handleCloseDialog={handleCloseDialog2} />
        <TextInput
          source="title[en]"
          variant="outlined"
          label="Title(EN)"
          multiline
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={qc_id2?.title?.en}
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ height: "40px" }}
          >
            <MenuItem value={"active"}>Active</MenuItem>
            <MenuItem value={"inactive"}>InActive</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="outlined-multiline-static"
          label="Test Descriptions (EN)"
          multiline
          rows={4}
          variant="outlined"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
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
              handleOpenDialog(record?.id);
            }}
          >
            Add New
          </Button>{" "}
        </Box>
      </div>
      {Order?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Order?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row?.id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.title?.en}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.description?.en}
                  </TableCell>
                  <TableCell align="left">
                    <p
                      style={{
                        color: getColorByStatus(row?.status),
                        textTransform: "capitalize",
                      }}
                    >
                      {" "}
                      {row?.status}
                    </p>
                  </TableCell>

                  <TableCell align="left">
                    {/* @ts-ignore */}
                    <Button
                      disableElevation
                      onClick={(e: MouseEvent) => {
                        handleOpenDialog2(row);
                      }}
                    >
                      <EditIcon />
                    </Button>{" "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/* @ts-ignore */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
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
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent>
          <UploadFile handleDialogClose={handleCloseDialog} qc_id={qcId || 0} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog2} onClose={handleCloseDialog2} maxWidth="md">
        <DialogContent>
          <UploadFile2
            handleDialogClose2={handleCloseDialog2}
            qc_id2={qcId2 || 0}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  formControl: {
    height: 60,
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

export default Faq;
