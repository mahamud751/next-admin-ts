import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { ReferenceInput, useEditContext } from "react-admin";
import { useFormState } from "react-final-form";

import UserLocationAutocompleteInput from "@/components/manageLabTest/order/UserLocationAutocompleteInput";
import AroggaButton from "@/components/common/AroggaButton";
import ProfilePhotoPlaceholderIcon from "@/components/icons/ProfilePhotoPlaceholder";
import { useRequest } from "@/hooks";
import { makeStyles } from "@mui/styles";

const UserTab = ({ ...rest }) => {
  const classes = useStyles();
  const { values } = useFormState();
  const [isLocationEditBtnClick, setIsLocationEditBtnClick] = useState(false);
  const [isLocationAddBtnClick, setIsLocationAddBtnClick] = useState(false);
  const { record } = useEditContext();
  const { data: userData } = useRequest(
    `/v1/users/${record?.userId}`,
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
              <p className={classes.profileFieldResult}>{record?.name}</p>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={3}>
              <p className={classes.profileField}>User ID:</p>
            </Grid>
            <Grid item>
              <p className={classes.profileFieldResult}>{record.userId}</p>
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
                  {record.mobileNumber}
                </span>{" "}
              </p>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={3}>
              <p className={classes.profileField}>Email:</p>
            </Grid>
            <Grid item>
              <p className={classes.profileFieldResult}>{record?.email}</p>
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
                  u_id: values.u_id,
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
                rest.record?.o_ul_id === values.o_ul_id && (
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
  location: {
    padding: 5,
    width: 205,
    wordWrap: "break-word",
    border: "0.5px solid #DCE0E4",
    background: "#F4F4F4",
    color: "#6C757D",
  },
}));

export default UserTab;
