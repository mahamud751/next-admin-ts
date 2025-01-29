import { Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import { ReferenceInput, TextInput, useEditContext } from "react-admin";

import { useRequest } from "@/hooks";

import AroggaButton from "@/components/common/AroggaButton";
import SendSmsDialog from "@/components/common/SendSmsDialog";
import ProfilePhotoPlaceholderIcon from "@/components/icons/ProfilePhotoPlaceholder";
import UserLocationAutocompleteInput from "@/components/manageLabTest/order/UserLocationAutocompleteInput";

const UserTab = ({ setUserCash, ...rest }) => {
  const classes = useStyles();
  const { record } = useEditContext();
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [isLocationEditBtnClick, setIsLocationEditBtnClick] = useState(false);
  const [isLocationAddBtnClick, setIsLocationAddBtnClick] = useState(false);

  const { data: userData } = useRequest(
    `/v1/users/${record.userId}`,
    {},
    { isPreFetching: true }
  );
  return (
    <>
      <Grid container className={classes.profileContainer}>
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
              <p className={classes.profileFieldResult}>{userData?.u_id}</p>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={3}>
              <p className={classes.profileField}>Mobile No:</p>
            </Grid>
            <Grid item>
              <p className={classes.profileFieldResult}>
                <span
                  onClick={() => {}}
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
              {userData?.u_note !== record.userNote && (
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
                    onClick={() => {}}
                  />
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
        {rest.record?.address_checked && !isLocationEditBtnClick && (
          <Grid item sm={12} md={6}>
            <Box display="flex" alignItems="center">
              <ReferenceInput
                source="o_ul_id"
                label="Location"
                variant="outlined"
                reference="v1/userLocations"
                filter={{
                  _orderBy: "ul_default",
                  u_id: record.u_id,
                }}
                fullWidth
              >
                <UserLocationAutocompleteInput
                  matchSuggestion={() => true}
                  optionValue="ul_id"
                  helperText={false}
                  resettable
                />
              </ReferenceInput>
              {rest.record?.address_checked &&
                rest.record?.o_ul_id === record.o_ul_id && (
                  <AroggaButton
                    label="Edit"
                    type="success"
                    onClick={() => setIsLocationEditBtnClick(true)}
                    style={{
                      marginLeft: 10,
                    }}
                  />
                )}
              {!isLocationAddBtnClick && (
                <AroggaButton
                  label="Add"
                  type="success"
                  onClick={() => setIsLocationAddBtnClick(true)}
                  style={{
                    marginLeft: 10,
                  }}
                />
              )}
            </Box>
          </Grid>
        )}
      </Grid>
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
}));

export default UserTab;
