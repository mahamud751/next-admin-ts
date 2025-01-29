import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FC, SetStateAction, useEffect, useState } from "react";
import {
  FunctionField,
  ListProps,
  SelectInput,
  SimpleForm,
  useEditContext,
  useRefresh,
} from "react-admin";

import { useRequest } from "@/hooks";
import { Status } from "@/utils/enums";
import { isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";
import DeleteIcon from "@/components/icons/DeleteIcon";

const Locations: FC<ListProps> = ({ ...props }) => {
  const { record } = useEditContext();
  const classes = useStyle();
  const refresh = useRefresh();
  const [openDialog, setOpenDialog] = useState(false);
  const [, setDialogId] = useState<number | null>(null);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const [qcId2, setQcId2] = useState<number | null>(null);
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [searchAll, setSearchAll] = useState();
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(true);

  const [locations, setLocations] = useState(null);
  useEffect(() => {
    const locationsFromStorage = sessionStorage.getItem("locations");
    if (locationsFromStorage) {
      setLocations(
        isJSONParsable(locationsFromStorage)
          ? JSON.parse(locationsFromStorage)
          : {}
      );
      setLoading(false);
    } else {
      httpClient("/v1/allLocations/", { isBaseUrl: true })
        .then(({ json }: any) => {
          if (json.status === Status.SUCCESS) {
            setLocations(json.data);
            sessionStorage.setItem("locations", JSON.stringify(json.data));
          }
        })
        .catch((err) => logger(err))
        .finally(() => setLoading(false));
    }
  }, []);
  const toChoices = (items = []) =>
    items?.map((item) => ({ id: item, name: item }));

  const handleOpenDialog = (id: number) => {
    setQcId2(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setDialogId(null);
    setOpenDialog(false);
  };
  const handleOpenDialog3 = (id: number) => {
    setQcId(id);
    setOpenDialog3(true);
  };
  const handleCloseDialog3 = () => {
    setOpenDialog3(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    data: Order,
    total,
    refetch,
  } = useRequest(
    `/lab-order/api/v1/admin/locations?page=${
      currentPage + 1
    }&limit=${rowsPerPage}&collectorUqid=${record.id}&${
      searchAll ? `search=${searchAll}` : ""
    }&${division ? `division=${division}` : ""}&${
      district ? `district=${district}` : ""
    }&${area ? `area=${area}` : ""}&${zone ? `zone=${zone}` : ""}`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );
  const handleAllSearch = (event) => {
    setSearchAll(event.target.value);
    refetch();
  };
  const handleDivisionSearch = (event) => {
    setDivision(event.target.value);
    refetch();
  };
  const handleDistrictSearch = (event) => {
    setDistrict(event.target.value);
    refetch();
  };
  const handleAreaSearch = (event) => {
    setArea(event.target.value);
    refetch();
  };
  const handleZoneSearch = (event) => {
    setZone(event.target.value);
    refetch();
  };
  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
  const UploadFile = ({
    qc_id,
    handleDialogClose,
  }: {
    qc_id: any;
    handleDialogClose: any;
  }) => {
    const { isLoading, refetch } = useRequest(
      `/lab-order/api/v1/admin/coverages?zone=${qc_id.zone}&collectorUqid=${record.id}`,
      {
        method: "DELETE",
      },
      {
        onSuccess: () => {
          handleDialogClose();
          refresh();
        },
      }
    );
    return (
      <SimpleForm toolbar={false}>
        <Box style={{ width: "320px", padding: 10 }}>
          <div>
            <div style={{ display: "none" }}></div>
            <div className="name">
              <strong>Are you sure want to unAssigned? </strong>
            </div>
          </div>
          <AroggaDialogActions
            isLoading={isLoading}
            confirmLabel="Confirm"
            onDialogClose={handleCloseDialog}
            onConfirm={refetch}
          />
        </Box>
      </SimpleForm>
    );
  };

  const UploadFile3 = ({
    qc_id,
    handleDialogClose3,
  }: {
    qc_id: number;
    handleDialogClose3: any;
  }) => {
    const [zoneSelect, setZoneSelect] = useState("");
    const handleChange = (event: any) => {
      setZoneSelect(event.target.value as string);
    };

    const { data: Zones } = useRequest(
      `/v1/zones?page=1&limit=100&onlyMainZones=1`,
      { method: "GET" },
      {
        isBaseUrl: true,
        isSuccessNotify: false,
        isPreFetching: true,
        refreshDeps: [newZoneAdded],
      }
    );

    const { refetch: addNewZone } = useRequest(undefined, undefined, {
      onSuccess: (json) => {
        setZoneSelect("");
        setNewZoneAdded(Date.now());
        refresh();
      },
    });
    const handleAddNewZone = async () => {
      try {
        await addNewZone({
          endpoint: `/lab-order/api/v1/admin/coverages`,
          method: "POST",
          body: {
            zones: [zoneSelect],
            collectorUqids: [record.id],
          },
        });
        handleDialogClose3();
      } catch (error) {
        console.error(error);
      }
    };
    return (
      <Box style={{ width: "320px", padding: 10 }}>
        <FormControl
          variant="filled"
          fullWidth
          size="small"
          style={{ maxWidth: "100%" }}
        >
          <InputLabel id="demo-simple-select-label">Zone</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={zoneSelect}
            label="Zone"
            onChange={handleChange}
          >
            {Zones?.zones?.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={classes.AddBtn}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={handleAddNewZone}
            disabled={!zoneSelect}
          >
            Save Update
          </Button>
        </div>
      </Box>
    );
  };
  return (
    <>
      {/* <LocationFilter /> */}
      <div style={{ margin: "20px 0px" }}>
        <TextField
          id="standard-basic"
          label="Search"
          onChange={handleAllSearch}
          value={searchAll}
        />
        <SelectInput
          source="division"
          className={classes.inputFiled}
          label="Division"
          variant="outlined"
          choices={
            !!locations ? locations && toChoices(Object.keys(locations)) : []
          }
          onChange={handleDivisionSearch}
          value={division?.toString()}
          allowEmpty
          alwaysOn
        />
        <SelectInput
          className={classes.inputFiled}
          source="district"
          label="District"
          variant="outlined"
          choices={
            !!division
              ? toChoices(locations && Object.keys(locations[division]))
              : []
          }
          onChange={handleDistrictSearch}
          value={district}
          alwaysOn
        />
        <SelectInput
          className={classes.inputFiled}
          source="area"
          label="Area"
          variant="outlined"
          choices={
            !!division &&
            !!district &&
            locations &&
            locations[division] &&
            locations[division][district] &&
            !loading
              ? toChoices(Object.keys(locations[division][district]))
              : []
          }
          onChange={handleAreaSearch}
          value={area}
          alwaysOn
        />
        <TextField
          className={classes.inputFiled}
          id="standard-basic"
          label="Search Zone"
          onChange={handleZoneSearch}
          value={zone}
        />
      </div>
      {Order?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Location ID</TableCell>
                <TableCell align="left">Division</TableCell>
                <TableCell align="left">District</TableCell>
                <TableCell align="left">Area</TableCell>
                <TableCell align="left">Zone</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Order?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.division}</TableCell>
                  <TableCell align="left">{row.district}</TableCell>
                  <TableCell align="left">{row.area}</TableCell>
                  <TableCell align="left">{row.zone}</TableCell>

                  <TableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ marginLeft: 10 }}>
                        <button
                          //@ts-ignore
                          onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenDialog(row);
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
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
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  handleOpenDialog3(record.id);
                }}
              >
                Add New
              </Button>{" "}
            </Box>
          )}
        />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <UploadFile
            handleDialogClose={() => {
              handleCloseDialog();
            }}
            qc_id={qcId2}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog3} onClose={handleCloseDialog3}>
        <DialogContent style={{ maxWidth: "850px" }}>
          <UploadFile3
            handleDialogClose3={() => {
              handleCloseDialog3();
            }}
            qc_id={qcId || 0}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const useStyle = makeStyles(() => ({
  button: {
    marginRight: 10,
    textTransform: "capitalize",
  },
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "end",
  },
  inputFiled: {
    marginLeft: 10,
  },
}));

export default Locations;
