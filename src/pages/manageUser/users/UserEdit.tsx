import { Box, Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import {
  Edit,
  EditProps,
  FileField,
  FileInput,
  FormDataConsumer,
  FormTab,
  NumberInput,
  SaveButton,
  SimpleForm,
  TabbedForm,
  TextInput,
  Toolbar,
  email,
  maxLength,
  minLength,
  useNotify,
  useRefresh,
} from "react-admin";
import { useParams } from "react-router-dom";

import BonusDialog from "@/components/manageUser/users/BonusDialog";
import PermissionsTab from "@/components/manageUser/users/PermissionsTab";
import UserRoleInput from "@/components/manageUser/users/UserRoleInput";
import UserStatusInput from "@/components/manageUser/users/UserStatusInput";
import { uploadDataProvider } from "@/dataProvider";
import { useDocumentTitle } from "@/hooks";
import { FILE_MAX_SIZE } from "@/utils/constants";
import { required } from "@/utils/helpers";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import SendSmsDialog from "@/components/common/SendSmsDialog";

const UserEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | User Edit");
  const { id } = useParams<any>();
  const classes = useStyles();
  const refresh = useRefresh();
  const notify = useNotify();
  const [openSendSmsDialog, setOpenSendSmsDialog] = useState(false);
  const [openBonusDialog, setOpenBonusDialog] = useState(false);
  const [bonusAmount] = useState(0);
  const isRoleAdministrator = permissions?.includes("role:administrator");
  const onSave = async (data) => {
    const payload = {
      u_id: data.u_id,
      u_name: data.u_name,
      u_mobile: data.u_mobile,
      u_email: data.u_email,
      u_token: data.u_token,
      fcm_token: data.fcm_token,
      u_lat: data.u_lat,
      u_long: data.u_long,
      u_created: data.u_created,
      u_updated: data.u_updated,
      u_role: data.u_role,
      u_rank: data.u_rank,
      u_status: data.u_status,
      u_cash: data.u_cash,
      u_bonus_balance: data.u_bonus_balance,
      u_cash_balance: data.u_cash_balance,
      u_p_cash: data.u_p_cash,
      u_otp: data.u_otp,
      u_otp_time: data.u_otp_time,
      u_referrer: data.u_referrer,
      u_r_uid: data.u_r_uid,
      u_o_count: data.u_o_count,
      u_d_count: data.u_d_count,
      u_employee_id: data.u_employee_id,
      u_pharmacy_id: data.u_pharmacy_id,
      u_locale: data.u_locale,
      u_dob: data.u_dob,
      u_sex: data.u_sex,
      u_note: data.u_note,
      id: data.id,
      attachedFiles: data.attachedFiles,
      u_pic_url: data.u_pic_url,
      i_help_id: data.i_help_id,
      is_influencer: data.is_influencer,
    };
    try {
      await uploadDataProvider.create(`v1/users/${id}`, {
        data: payload,
      });
      notify("Successfully Updated!", { type: "success" });
      refresh();
      window.location.reload();
    } catch (err: any) {
      notify(err.message || "Failed!", { type: "warning" });
    }
  };

  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton />
    </Toolbar>
  );
  const CustomToolbar2 = (props) => (
    <Toolbar {...props}>
      <SaveButton />
    </Toolbar>
  );
  const onSavePermission = async (data) => {
    const payload = {
      permissions_add: data.permissions_add,
      permissions_remove: data.permissions_remove,
    };
    try {
      await uploadDataProvider.create(`v1/saveOnlyPermission/${id}`, {
        data: payload,
      });
      notify("Successfully Updated!", { type: "success" });
      refresh();
      window.location.reload();
    } catch (err: any) {
      notify(err.message || "Failed!", { type: "warning" });
    }
  };
  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
    >
      <TabbedForm toolbar={null}>
        <FormTab label="User">
          <>
            <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar />}>
              <TextInput
                source="u_id"
                label="ID"
                variant="outlined"
                helperText={false}
                readOnly
              />
              <TextInput
                source="u_name"
                label="Name"
                variant="outlined"
                helperText={false}
                validate={[required()]}
              />
              <Grid container style={{ width: "100%" }}>
                <Grid item sm={2}>
                  <TextInput
                    source="u_mobile"
                    label="Mobile"
                    variant="outlined"
                    helperText={false}
                    style={{ width: 256 }}
                    fullWidth
                  />
                </Grid>
                <Grid item sm={2}>
                  <Button
                    variant="contained"
                    className={classes.btn}
                    onClick={() => setOpenSendSmsDialog(true)}
                    disableElevation
                  >
                    Send SMS
                  </Button>
                </Grid>
              </Grid>
              <SendSmsDialog
                open={openSendSmsDialog}
                handleClose={() => setOpenSendSmsDialog(false)}
              />
              <TextInput
                source="u_email"
                label="Email"
                variant="outlined"
                helperText={false}
                validate={email("Invalid email address")}
              />
              <TextInput
                source="u_token"
                label="Token"
                variant="outlined"
                helperText={false}
              />
              <TextInput
                source="u_lat"
                label="Latitude"
                variant="outlined"
                helperText={false}
              />
              <TextInput
                source="u_long"
                label="Longitude"
                variant="outlined"
                helperText={false}
              />
              <TextInput
                source="u_created"
                label="Created"
                variant="outlined"
                helperText={false}
              />
              <TextInput
                source="u_updated"
                label="Updated"
                variant="outlined"
                helperText={false}
                readOnly
              />
              <NumberInput
                source="u_cash"
                label="Arogga Cash"
                variant="outlined"
                helperText={false}
                readOnly
              />
              <NumberInput
                source="u_cash_balance"
                label="Cash Balance"
                variant="outlined"
                helperText={false}
                readOnly={!isRoleAdministrator}
              />
              <NumberInput
                source="u_bonus_balance"
                label="Bonus Balance"
                variant="outlined"
                helperText={false}
                readOnly={!isRoleAdministrator}
              />
              {/* <Grid container style={{ width: "100%" }}>
                                <Grid item sm={2}>
                                    <NumberInput
                                        source="u_cash"
                                        label="Cash"
                                        variant="outlined"
                                        helperText={false}
                                        style={{ width: 256 }}
                                        readOnly={!isRoleAdministrator}
                                    />
                                </Grid>
                                <Grid item sm={1}>
                                    <Button
                                        variant="contained"
                                        className={classes.btn}
                                        onClick={() => {
                                            setBonusAmount(20);
                                            setOpenBonusDialog(true);
                                        }}
                                        disableElevation
                                    >
                                        Bonus 20
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        className={classes.btn}
                                        onClick={() => {
                                            setBonusAmount(50);
                                            setOpenBonusDialog(true);
                                        }}
                                        disableElevation
                                    >
                                        Bonus 50
                                    </Button>
                                </Grid>
                            </Grid> */}
              <BonusDialog
                open={openBonusDialog}
                handleClose={() => setOpenBonusDialog(false)}
                bonusAmount={bonusAmount}
              />
              <NumberInput
                source="u_p_cash"
                label="Pending Cash"
                variant="outlined"
                helperText={false}
                readOnly
              />
              <NumberInput
                source="u_otp"
                label="OTP"
                variant="outlined"
                helperText={false}
              />
              <TextInput
                source="u_otp_time"
                label="OTP Time"
                variant="outlined"
                helperText={false}
              />
              <TextInput
                source="u_referrer"
                label="Referrer Code"
                variant="outlined"
                helperText={false}
                validate={[minLength(4), maxLength(20)]}
              />
              <FormDataConsumer>
                {({ formData }) => {
                  if (!formData.is_influencer || !formData.u_referrer)
                    return null;
                  return (
                    <Box mb={3}>
                      {`https://www.arogga.com/s/${formData.u_referrer}/ari`}
                    </Box>
                  );
                }}
              </FormDataConsumer>
              <NumberInput
                source="u_r_uid"
                label="Referrer ID"
                variant="outlined"
                helperText={false}
              />
              <TextInput
                source="i_help_id"
                label="I Help BD ID"
                variant="outlined"
                helperText={false}
              />
              {permissions?.includes("userChangeRole") && (
                <UserRoleInput
                  source="u_role"
                  label="Role"
                  variant="outlined"
                  helperText={false}
                />
              )}
              <UserStatusInput
                source="u_status"
                variant="outlined"
                helperText={false}
              />
              <TextInput
                source="u_note"
                label="Note"
                variant="outlined"
                helperText={false}
                minRows={2}
                multiline
              />
              {permissions?.includes("addInfluencer") && (
                <FormatedBooleanInput
                  source="is_influencer"
                  label="Is Influencer?"
                />
              )}
              <FileInput
                source="attachedFiles"
                label="Related Files"
                helperText={false}
                accept={{
                  "application/pdf": [".pdf"],
                  "image/*": [".jpg", ".jpeg", ".png", ".gif"],
                }}
                maxSize={FILE_MAX_SIZE}
                options={{ maxSize: 5 }}
                multiple
              >
                <FileField source="src" title="title" />
              </FileInput>
            </SimpleForm>
          </>
        </FormTab>
        {permissions?.includes("permissionMenu") && (
          <FormTab label="Permissions" path="permissions">
            <>
              <SimpleForm
                onSubmit={onSavePermission}
                toolbar={<CustomToolbar2 />}
              >
                <PermissionsTab />
              </SimpleForm>
            </>
          </FormTab>
        )}
      </TabbedForm>
    </Edit>
  );
};

const useStyles = makeStyles(() => ({
  btn: {
    width: 100,
    height: 38,
    marginTop: 9,
    padding: 8,
  },
}));

export default UserEdit;
