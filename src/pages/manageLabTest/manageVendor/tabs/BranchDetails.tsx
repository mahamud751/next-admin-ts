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

import { FC, useEffect, useState } from "react";
import {
  FunctionField,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
  useEditContext,
  useNotify,
  useRefresh,
} from "react-admin";
import { useFormState } from "react-final-form";

import LabAreaInput from "../../../../components/manageLabTest/Order/LabAreaInput";
import LabDistrictInput from "../../../../components/manageLabTest/Order/LabDistrictInput";
import ShippingDialog from "../../../../components/manageLabTest/Order/ShippingDialog";
import { labTestUploadDataProvider } from "../../../../dataProvider";
import { useRequest } from "@/hooks";
import { Status } from "@/utils/enums";
import {
  capitalizeFirstLetterOfEachWord,
  getFormattedDate,
  isJSONParsable,
  logger,
} from "@/utils/helpers";
import { httpClient } from "@/utils/http";
import ClearBtn from "@/components/manageLabTest/Button/ClearBtn";
import {
  CalenderIcon,
  CartItemCountIcon,
  RegularPriceIcon,
} from "@/components/icons";
import AroggaButton from "@/components/common/AroggaButton";

type UserTabProps = {
  permissions: string[];
  [key: string]: any;
};
const BranchDetails: FC<UserTabProps> = ({ ...rest }) => {
  const classes = useStyles();
  const { record } = useEditContext();
  const refresh = useRefresh();
  const notify = useNotify();

  const { values } = useFormState();
  const [locations, setLocations] = useState(null);
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false);
  const [isLocationEditBtnClick, setIsLocationEditBtnClick] = useState(false);
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [, setDialogId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [, setQcId] = useState<number | null>(null);
  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setDialogId(null);
    setOpenDialog(false);
  };
  useEffect(() => {
    const locationsFromStroage = sessionStorage.getItem("locations");
    if (locationsFromStroage) {
      setLocations(
        isJSONParsable(locationsFromStroage)
          ? JSON.parse(locationsFromStroage)
          : {}
      );
    } else {
      httpClient("/v1/allLocations/", { isBaseUrl: true })
        .then(({ json }: any) => {
          if (json.status === Status.SUCCESS) {
            setLocations(json.data);
            sessionStorage.setItem("locations", JSON.stringify(json.data));
          }
        })
        .catch((err) => logger(err));
    }
  }, []);

  const toChoices = (items: string[]) =>
    items.map((item: string) => ({ id: item, name: item }));

  const isAddressConfirmButtonShow =
    !rest.record?.address_checked &&
    rest.record?.o_status === "processing" &&
    rest.record?.o_i_status === "processing";

  values.isAddressConfirmButtonShow = isAddressConfirmButtonShow;

  const { data: branchList } = useRequest(
    `/misc/api/v1/admin/vendor/branch?vendorId=${record.id}`,
    { method: "GET" },
    {
      isSuccessNotify: false,
      refreshDeps: [record.id],
      isPreFetching: true,
    }
  );

  const refetch = async (data) => {
    try {
      await labTestUploadDataProvider.create(
        "misc/api/v1/admin/vendor/branch",
        {
          data: {
            area: data.area,
            vendorId: record.id,
            division: division,
            district: district,
            address: data.address,
          },
        }
      );
      notify("Successfully Branch Create!", { type: "success" });
      refresh();
    } catch (err: any) {
      let message = err.message;
      if (
        err.message ===
        "A record with the given unique attributes already exists."
      )
        message =
          "This zone is already attacthed to the branch. Please assigned another zone";

      notify(message, {
        type: "error",
      });
    }
  };
  const CustomToolbar = (props: any) => (
    <Toolbar
      {...props}
      toolbar={<CustomToolbar />}
      style={{ background: "none" }}
    >
      <SaveButton style={{ width: 120 }} label="Confirm" />
    </Toolbar>
  );

  return (
    <>
      <div className={classes.cartDetails}>
        <Grid container spacing={1}>
          <Grid alignItems="center" item md={3} container>
            <RegularPriceIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Vendor Name EN
              </Typography>
              <Typography variant="body1">{record.name.en}</Typography>
            </Box>
          </Grid>
          <Grid alignItems="center" item md={3} container>
            <CartItemCountIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Vendor Name BN
              </Typography>
              <Typography variant="body1">{record.name.bn}</Typography>
            </Box>
          </Grid>
          <Grid alignItems="center" item md={3} container>
            <CalenderIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Vendor Created Date and Time
              </Typography>
              <Typography variant="body1">
                {getFormattedDate(record.updatedAt)}
              </Typography>
            </Box>
          </Grid>
          <Grid alignItems="center" item md={3} container>
            <CalenderIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Vendor Update Date and Time
              </Typography>
              <Typography variant="body1">
                {getFormattedDate(record.updatedAt)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>

      <div className={classes.cartDetails}>
        <div className={classes.AddBtn}>
          <Typography variant="h5" style={{ marginBottom: 10 }}>
            Branch Locations
          </Typography>
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
                    handleOpenDialog(record.id);
                  }}
                >
                  Add New
                </Button>{" "}
              </Box>
            )}
          />
        </div>
        {branchList?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell align="left">Division</TableCell>
                  <TableCell align="left">District</TableCell>
                  <TableCell align="left">Area</TableCell>
                  <TableCell align="left">Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchList?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">
                      {capitalizeFirstLetterOfEachWord(row.location?.division)}
                    </TableCell>
                    <TableCell align="left">
                      {capitalizeFirstLetterOfEachWord(row.location?.district)}
                    </TableCell>
                    <TableCell align="left">
                      {capitalizeFirstLetterOfEachWord(row.location?.area)}
                    </TableCell>
                    <TableCell align="left">
                      {capitalizeFirstLetterOfEachWord(row?.address)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogContent>
            <>
              <div className={classes.flex}>
                <Typography variant="h5">Add New Branch</Typography>
                <ClearBtn handleCloseDialog={handleCloseDialog} />
              </div>
              {(!rest.record?.location || isLocationEditBtnClick) && (
                <Grid container className={classes.locationArea}>
                  <SimpleForm save={refetch} toolbar={<CustomToolbar />}>
                    <Grid container spacing={1} style={{ width: "100%" }}>
                      <Grid item sm={6} md={4}>
                        <SelectInput
                          source="location.division"
                          label="Branch Division"
                          variant="outlined"
                          choices={
                            !!locations ? toChoices(Object.keys(locations)) : []
                          }
                          onChange={(e) => setDivision(e.target.value)}
                          allowEmpty
                          fullWidth
                        />
                      </Grid>
                      <Grid item sm={6} md={4}>
                        <LabDistrictInput
                          source="location.district"
                          label="Branch City"
                          variant="outlined"
                          validate={[required()]}
                          locations={locations}
                          setLocations={setLocations}
                          onChange={(e) => setDistrict(e.target.value)}
                          allowEmpty
                          fullWidth
                        />
                      </Grid>
                      <Grid item sm={6} md={4}>
                        <LabAreaInput
                          source="area"
                          label="Branch Area"
                          variant="outlined"
                          validate={[required()]}
                          locations={locations}
                          setLocations={setLocations}
                          allowEmpty
                          fullWidth
                        />
                      </Grid>
                      <Grid item sm={6} md={6}>
                        <TextInput
                          source="address"
                          label="Address"
                          validate={[required()]}
                          variant="outlined"
                          minRows={2}
                          multiline
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </SimpleForm>
                  <Grid item sm={6} md={4}></Grid>
                  {isAddressConfirmButtonShow && (
                    <>
                      <Grid item sm={6} md={4} style={{ position: "relative" }}>
                        <div
                          style={{
                            position: "absolute",
                            bottom: 37,
                            right: 0,
                          }}
                        >
                          <AroggaButton
                            label="Confirm Address"
                            type="success"
                            onClick={() => setIsShippingDialogOpen(true)}
                          />
                        </div>
                      </Grid>
                      <ShippingDialog
                        formValues={values}
                        open={isShippingDialogOpen}
                        handleShippingDialogClose={() =>
                          setIsShippingDialogOpen(false)
                        }
                        setIsLocationEditBtnClick={setIsLocationEditBtnClick}
                        hasSubArea={false}
                        subAreaId={null}
                        {...rest}
                      />
                    </>
                  )}
                </Grid>
              )}
            </>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

const useStyles = makeStyles(() => ({
  cartDetails: {
    border: "1px solid #EAEBEC",
    borderRadius: 6,
    padding: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  location: {
    padding: 5,
    width: 205,
    wordWrap: "break-word",
    border: "0.5px solid #DCE0E4",
    background: "#F4F4F4",
    color: "#6C757D",
  },
  locationArea: {
    width: "100%",
    margin: "20px 0px 20px 0px",

    background: "#FFFFFF",
    border: "1px dashed #3ECBA5",
    borderRadius: 6,
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    marginRight: 10,
    textTransform: "capitalize",
  },
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default BranchDetails;
