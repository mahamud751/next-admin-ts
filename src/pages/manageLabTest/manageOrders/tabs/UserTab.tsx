import { Box, Button, Grid, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useEffect, useState } from "react";
import {
  FunctionField,
  ReferenceInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
  useNotify,
  useRefresh,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import ProfilePhotoPlaceholderIcon from "@/components/icons/ProfilePhotoPlaceholder";

import { useClipboard, useRequest } from "@/hooks";
import { Status } from "@/utils/enums";
import { isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";
import LabTestSubAreaUser from "./LabTestSubAreaUser";
import AddressTypeInput from "@/components/common/AddressTypeInput";
import AroggaButton from "@/components/common/AroggaButton";
import SendSmsDialog from "@/components/common/SendSmsDialog";
import LabAreaInput from "@/components/manageLabTest/order/LabAreaInput";
import LabDistrictInput from "@/components/manageLabTest/order/LabDistrictInput";
import LabUserLocationAutocompleteInput from "@/components/manageLabTest/order/LabUserLocationAutocompleteInput";
import ShippingDialog from "@/components/manageLabTest/order/ShippingDialog";
import LabLocationCreateModal from "@/components/manageLabTest/order/LabLocationCreateModal";

type UserTabProps = {
  permissions: string[];
  [key: string]: any;
};
const UserTab: FC<UserTabProps> = ({ permissions, ...rest }) => {
  const classes = useStyles();
  const notify = useNotify();
  const { setValue } = useFormContext();
  const clipboard = useClipboard();
  const refresh = useRefresh();
  const values = useWatch();
  const [locations, setLocations] = useState(null);
  const [subAreaId, setSubAreaId] = useState(values?.userLocation?.subareaId);
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false);
  const [isUserNoteUpdateButtonShow, setIsUserNoteUpdateButtonShow] =
    useState(false);
  const [isLocationEditBtnClick, setIsLocationEditBtnClick] = useState(false);
  const [district, setDistrict] = useState(values?.userLocation?.district);
  const [division, setDivision] = useState(values?.userLocation?.division);
  const [area, setArea] = useState(values?.userLocation?.area);
  const [type, setType] = useState(values?.userLocation?.type);
  const [address, setAddress] = useState(values?.userLocation?.address);
  const [name, setName] = useState(values?.userLocation?.name);
  const [mobile, setMobile] = useState(values?.userLocation?.mobileNumber);
  const [mainData, setMainData] = useState();
  const [, setLocationId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [hasSubArea, setHasSubArea] = useState(false);
  const [currentSubArea, setCurrentSubArea] = useState(null);

  //@ts-ignore
  const matchId = parseInt(mainData?.ul_id);
  //@ts-ignore
  const mainDataId = mainData?.ul_id;

  const { data: userData, refetch: refetchUserData } = useRequest(
    `/v1/users/${values.userId}`,
    {},
    { isPreFetching: true }
  );
  const { data: locationData } = useRequest(
    `/lab-order/api/v1/admin/orders/${values.id}/location`,
    {},
    { isPreFetching: true, isSuccessNotify: false }
  );

  const { refetch: updateUserNote } = useRequest(
    `/v1/tinyUpdate/user/${values.userId}`,
    {
      method: "POST",
      body: {
        u_note: values.userNote,
      },
    },
    {
      successNotify: "Successfully updated user note",
      onSuccess: () => {
        refetchUserData();
        setIsUserNoteUpdateButtonShow(false);
      },
    }
  );
  useEffect(() => {
    const locationsFromStroage = sessionStorage.getItem("labLocations");

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
            sessionStorage.setItem("labLocations", JSON.stringify(json.data));
          }
        })
        .catch((err) => logger(err));
    }
  }, []);

  useEffect(() => {
    setValue("userNote", userData?.u_note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.u_note]);

  useEffect(() => {
    !isUserNoteUpdateButtonShow &&
      userData?.u_note !== values.userNote &&
      setIsUserNoteUpdateButtonShow(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.userNote]);

  const toChoices = (items: string[]) =>
    items.map((item: string) => ({ id: item, name: item }));

  const mobileNoCopyToClipboard = (mobileNo) => {
    if (!mobileNo) return;
    clipboard.copy(mobileNo);
    notify("Mobile no copied to clipboard!", { type: "success" });
  };

  const isAddressConfirmButtonShow =
    rest.record?.userLocation?.isChecked === false;

  values.isAddressConfirmButtonShow = isAddressConfirmButtonShow;
  let requestData;

  if (isLocationEditBtnClick) {
    requestData = {
      userLocationId: mainDataId,
      division: division,
      district: district,
      area: area,
      name: name,
      mobileNumber: mobile,
      type: type,
      address: address,
      ...(subAreaId?.sa_id && { subareaId: subAreaId.sa_id }),
    };
  } else {
    requestData = {
      userLocationId: mainDataId,
    };
  }

  const { refetch } = useRequest(
    `/lab-order/api/v1/admin/orders/${rest.record?.id}/location`,
    {
      method: "PUT",
      body: {
        ...requestData,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => {
        refresh();
        window.location.reload();
      },
    }
  );

  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton />
    </Toolbar>
  );

  return (
    <>
      <SimpleForm onSubmit={refetch} toolbar={<CustomToolbar />}>
        <Grid
          container
          className={classes.profileContainer}
          style={{ width: "100%" }}
        >
          <Grid item sm={12} md={3}>
            {userData?.u_pic_url ? (
              <img
                src={userData.u_pic_url}
                alt="Profile_Photo"
                className={classes.profilePhoto}
              />
            ) : (
              <ProfilePhotoPlaceholderIcon />
            )}
          </Grid>
          <Grid item sm={12} md={9}>
            <Grid container>
              <Grid item md={3}>
                <p className={classes.profileField}>Name:</p>
              </Grid>
              <Grid item>
                <p className={classes.profileFieldResult}>{userData?.u_name}</p>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={3}>
                <p className={classes.profileField}>User ID:</p>
              </Grid>
              <Grid item>
                <p className={classes.profileFieldResult}>{values?.userId}</p>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={3}>
                <p className={classes.profileField}>Mobile No:</p>
              </Grid>
              <Grid item>
                <p className={classes.profileFieldResult}>
                  <span
                    onClick={() => mobileNoCopyToClipboard(userData?.u_mobile)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {userData?.u_mobile}
                  </span>{" "}
                  <AroggaButton
                    label="Send SMS"
                    type="success"
                    onClick={() => setIsSmsDialogOpen(true)}
                  />
                </p>
                <SendSmsDialog
                  pageName="orders"
                  open={isSmsDialogOpen}
                  handleClose={() => setIsSmsDialogOpen(false)}
                  {...rest}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={3}>
                <p className={classes.profileField}>Order Count:</p>
              </Grid>
              <Grid item>
                <p className={classes.profileFieldResult}>
                  {userData?.u_o_count}
                </p>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={3}>
                <p className={classes.profileField}>Deliver Order Count:</p>
              </Grid>
              <Grid item>
                <p className={classes.profileFieldResult}>
                  {userData?.u_d_count}
                </p>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={3}>
                <p className={classes.profileField}>Note about user:</p>
              </Grid>
              <Grid item style={{ position: "relative" }}>
                <TextInput
                  source="userNote"
                  label=""
                  variant="outlined"
                  style={{ width: 217, position: "relative" }}
                  minRows={2}
                  multiline
                />
                {isUserNoteUpdateButtonShow &&
                  userData?.u_note !== values.userNote && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        bottom: -15,
                      }}
                    >
                      <AroggaButton
                        label="Update"
                        type="success"
                        onClick={updateUserNote}
                      />
                    </div>
                  )}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={3}>
                <p className={classes.profileField}>
                  Additional Info (For this order):
                </p>
              </Grid>
              <Grid item>
                <p className={classes.profileFieldResult}>
                  <TextInput
                    source="additionalNotes"
                    label=""
                    variant="outlined"
                    style={{ width: 217 }}
                    minRows={2}
                    multiline
                  />
                </p>
              </Grid>
            </Grid>
          </Grid>
          {locationData?.userLocation?.isChecked && !isLocationEditBtnClick && (
            <Grid item sm={12} md={6}>
              <Box display="flex" alignItems="center">
                <ReferenceInput
                  source="o_ul_id"
                  label="Location"
                  variant="outlined"
                  reference="v1/userLocations"
                  filter={{
                    _orderBy: "ul_default",
                    u_id: values?.userId,
                  }}
                  defaultValue={parseInt(values?.userLocation?.id)}
                  fullWidth
                >
                  <LabUserLocationAutocompleteInput
                    matchSuggestion={() => true}
                    optionValue="ul_id"
                    // helperText={false}
                    setMainData={setMainData}
                    formValues={values}
                    setLocationId={setLocationId}
                    resettable
                  />
                </ReferenceInput>
                {locationData?.userLocation?.isChecked &&
                  locationData?.userLocation?.id === matchId.toString() && (
                    <AroggaButton
                      label="Edit"
                      type="success"
                      onClick={() => setIsLocationEditBtnClick(true)}
                      style={{
                        margin: 10,
                      }}
                    />
                  )}
                <AroggaButton
                  label="Create"
                  type="success"
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                  style={{
                    margin: 10,
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>

        {(!locationData?.userLocation?.isChecked || isLocationEditBtnClick) && (
          <Grid container spacing={2} className={classes.locationArea}>
            <Grid container spacing={2}>
              <Grid item sm={6} md={4}>
                <TextInput
                  source="userLocation.name"
                  label="Shipping Name"
                  variant="outlined"
                  validate={[required()]}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item sm={6} md={4}>
                <TextInput
                  source="userLocation.mobileNumber"
                  value={mobile}
                  label="Shipping Mobile"
                  variant="outlined"
                  onFocus={(e) => {
                    const newValue: string = e.target.value.startsWith("+88")
                      ? e.target.value.replace("+88", "858520939")
                      : `858520939${e.target.value}`;

                    clipboard.copy(newValue);
                    clipboard.isCopied &&
                      notify("Shipping Mobile copied to clipboard!", {
                        type: "success",
                      });
                  }}
                  onChange={(e) => setMobile(e.target.value)}
                  validate={[required()]}
                  fullWidth
                />
              </Grid>
              <Grid item sm={6} md={4}>
                <AddressTypeInput
                  source="userLocation.type"
                  variant="outlined"
                  validate={[required()]}
                  onChange={(e) => setType(e.target.value)}
                  allowEmpty
                  fullWidth
                />
              </Grid>
              <Grid item sm={6} md={4}>
                <SelectInput
                  source="userLocation.division"
                  label="Shipping Division"
                  variant="outlined"
                  choices={!!locations ? toChoices(Object.keys(locations)) : []}
                  validate={[required()]}
                  onChange={(e) => setDivision(e.target.value)}
                  //   allowEmpty
                  fullWidth
                  disabled={values?.userLocation?.isChecked === true}
                />
              </Grid>
              <Grid item sm={6} md={4}>
                <LabDistrictInput
                  source="userLocation.district"
                  label="Shipping City"
                  variant="outlined"
                  validate={[required()]}
                  onChange={(e) => setDistrict(e.target.value)}
                  locations={locations}
                  setLocations={setLocations}
                  allowEmpty
                  fullWidth
                  disabled={values?.userLocation?.isChecked === true}
                />
              </Grid>
              <Grid item sm={6} md={4}>
                <LabAreaInput
                  source="userLocation.area"
                  label="Shipping Area"
                  variant="outlined"
                  validate={[required()]}
                  // onChange={(e) => setArea(e.target.value)}
                  onSelect={(item) => setArea(item.name)}
                  locations={locations}
                  setLocations={setLocations}
                  allowEmpty
                  fullWidth
                  disabled={values?.userLocation?.isChecked === true}
                />
              </Grid>
              <LabTestSubAreaUser
                permissions={permissions}
                setSubAreaId={setSubAreaId}
                hasSubArea={hasSubArea}
                setHasSubArea={setHasSubArea}
                currentSubArea={currentSubArea}
                setCurrentSubArea={setCurrentSubArea}
                page="edit"
              />
              <Grid item sm={6} md={4}>
                <TextInput
                  source="userLocation.address"
                  label="Shipping Home Address"
                  variant="outlined"
                  validate={[required()]}
                  onChange={(e) => setAddress(e.target.value)}
                  minRows={2}
                  multiline
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid item sm={6} md={4}></Grid>
            {isAddressConfirmButtonShow && (
              <>
                <Grid item sm={6} md={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginTop: "-80px",
                    }}
                  >
                    <AroggaButton
                      label="Confirm Address"
                      type="success"
                      onClick={() => setIsShippingDialogOpen(true)}
                    />
                    <FunctionField
                      label="Actions"
                      render={(record: any) => (
                        <Box display="flex">
                          {/* @ts-ignore */}
                          <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation();
                              setOpenDialog(true);
                            }}
                            style={{
                              width: 120,
                              height: 40,
                              marginLeft: 20,
                            }}
                          >
                            Create
                          </Button>{" "}
                        </Box>
                      )}
                    />
                  </div>
                </Grid>

                <ShippingDialog
                  hasSubArea={hasSubArea}
                  subAreaId={subAreaId}
                  formValues={values}
                  open={isShippingDialogOpen}
                  currentSubArea={currentSubArea}
                  handleShippingDialogClose={() =>
                    setIsShippingDialogOpen(false)
                  }
                  setIsLocationEditBtnClick={setIsLocationEditBtnClick}
                  {...rest}
                />
              </>
            )}
          </Grid>
        )}

        {!!values?.redx_tracking_id && (
          <Box mt={3}>
            <Link
              href={`https://redx.com.bd/track-global-parcel/?trackingId=${values.redx_tracking_id}`}
              target="_blank"
              rel="noopener"
            >
              REDX Link
            </Link>
          </Box>
        )}
      </SimpleForm>
      <LabLocationCreateModal open={openDialog} setOpenDialog={setOpenDialog} />
    </>
  );
};

const useStyles = makeStyles(() => ({
  profileContainer: {
    border: "1px solid #EAEBEC",
    borderRadius: 6,
    padding: 25,
    marginTop: 10,
  },
  profilePhoto: {
    width: 241,
    height: 262,
    borderRadius: 10,
  },
  profileField: {
    color: "#7C8AA0",
  },
  profileFieldResult: {
    color: "#112950",
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
    padding: "12px 12px 0px 12px",
    background: "#FFFFFF",
    border: "1px dashed #3ECBA5",
    borderRadius: 6,
  },
}));

export default UserTab;
