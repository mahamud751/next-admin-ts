import { Box, Button, CircularProgress } from "@mui/material";
import { FC, useState } from "react";
import {
  BooleanField,
  EmailField,
  FileField,
  FunctionField,
  Link,
  NumberField,
  RaRecord as Record,
  Show,
  ShowProps,
  SimpleForm,
  Tab,
  TabbedShowLayout,
  TextField,
  useNotify,
  usePermissions,
  useRedirect,
} from "react-admin";

import CreateTokenDialog from "@/components/manageUser/users/CreateTokenDialog";
import { useClipboard, useDocumentTitle, useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import Orders from "./tabs/Orders";
import ReferralHistory from "./tabs/ReferralHistory";
import TransactionHistory from "./tabs/TransactionHistory";
import AroggaDateField from "@/components/common/AroggaDateField";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const UserShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | User Show");
  const { permissions } = usePermissions();
  const redirect = useRedirect();
  const notify = useNotify();
  const clipboard = useClipboard();
  const classes = useAroggaStyles();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data,
    isLoading,
    refetch: createToken,
  } = useRequest(
    `/v1/users/createToken/${rest.id}`,
    {},
    {
      onSuccess: () => setIsDialogOpen(true),
    }
  );

  const handleCreateEmployee = (userRecord) => {
    redirect("create", "/v1/employee", undefined, undefined, {
      userRecord,
    });
  };

  const copyOTPToClipboard = (otp) => {
    if (!otp) return;

    clipboard.copy(otp);
    notify("OTP copied to clipboard!", { type: "success" });
  };

  return (
    <Show {...rest}>
      <TabbedShowLayout>
        <Tab label="User">
          <ColumnShowLayout simpleShowLayout={false} md={3}>
            <TextField source="u_id" label="ID" />
            <FunctionField
              label="Name"
              render={({ u_name, u_employee_id }: Record) => {
                if (!u_employee_id) return u_name;

                return (
                  <Link to={`/v1/employee/${u_employee_id}/show`}>
                    {u_name}
                  </Link>
                );
              }}
            />
            <TextField source="u_mobile" label="Mobile" />
            <EmailField source="u_email" label="Email" />
            <TextField
              source="u_sex"
              label="Sex"
              className={classes.capitalize}
            />
            <AroggaDateField source="u_dob" label="Date of Birth" />
            <TextField
              source="u_role"
              label="Role"
              className={classes.capitalize}
            />
            <TextField
              source="u_rank"
              label="Rank"
              className={classes.capitalize}
            />
            <NumberField source="u_cash" label="Cash" />
            <NumberField source="u_bonus_balance" label="Bonus Balance" />
            <NumberField source="u_cash_balance" label="Cash Balance" />
            <NumberField source="u_p_cash" label="Pending Cash" />
            <TextField source="u_o_count" label="Total Order" />
            <TextField source="u_d_count" label="Total Delivered Order" />
            <FunctionField
              label="Status"
              render={(record: Record) => (
                <span
                  className={`${classes.capitalize} ${
                    record.u_status === "inactive" && classes.textRed
                  }`}
                >
                  {record?.u_status}
                </span>
              )}
            />
            <TextField source="u_lat" label="Latitude" />
            <TextField source="u_long" label="Longitude" />
            <FunctionField
              label="OTP"
              render={({ u_otp }: Record) => (
                <span
                  style={
                    u_otp
                      ? {
                          padding: 5,
                          cursor: "pointer",
                          border: "1px dotted #EF1962",
                        }
                      : {}
                  }
                  onClick={() => copyOTPToClipboard(u_otp)}
                >
                  {u_otp}
                </span>
              )}
            />
            <AroggaDateField source="u_otp_time" label="OTP Created Time" />
            <TextField source="u_referrer" label="Referrer Code" />
            <TextField source="u_r_uid" label="Referrer ID" />
            <TextField source="i_help_id" label="I Help BD ID" />
            <BooleanField
              source="is_influencer"
              label="Influencer?"
              looseValue
            />
            <TextField source="u_note" label="Note" />
            <AroggaDateField source="u_created" label="User Created" />
            <AroggaDateField source="u_updated" label="User Updated" />
          </ColumnShowLayout>
          <TextField source="fcm_token" label="FCM Token" />
          <FileField
            source="attachedFiles"
            src="src"
            title="title"
            target="_blank"
            label="Related Files"
          />
          {permissions?.includes("employeeMenu") &&
            permissions?.includes("employeeCreate") && (
              <FunctionField
                // addLabel={false}
                render={(record: Record) => {
                  if (record.u_employee_id) return;

                  return (
                    <Box mb={2}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleCreateEmployee(record)}
                      >
                        Create Employee
                      </Button>
                    </Box>
                  );
                }}
              />
            )}
          {permissions?.includes("userTokenCreate") && (
            <>
              <Button color="primary" variant="contained" onClick={createToken}>
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Create Token"
                )}
              </Button>
              <SimpleForm toolbar={false}>
                <CreateTokenDialog
                  open={isDialogOpen}
                  handleClose={() => setIsDialogOpen(false)}
                  data={data}
                />
              </SimpleForm>
            </>
          )}
        </Tab>
        <Tab label="Orders">
          <Orders />
        </Tab>
        <Tab label="Transaction History">
          <TransactionHistory />
        </Tab>
        <Tab label="Referral History">
          <ReferralHistory />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};

export default UserShow;
