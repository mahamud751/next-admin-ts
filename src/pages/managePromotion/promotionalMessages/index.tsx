import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { SimpleForm, TextInput, Title, useNotify } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useDocumentTitle, useRequest } from "@/hooks";
import { isValidMobileNo, required } from "@/utils/helpers";
import AroggaButton from "@/components/common/AroggaButton";

const PromotionalMessagePage: FC = () => {
  useDocumentTitle("Arogga | Promotional Message");

  const [lastFiveUser, setLastFiveUser] = useState<any>([]);

  const { data, isLoading, isSuccess, reset, refetch } = useRequest(
    `/v1/users/promo-user/`,
    {},
    {
      successNotify: "Successfully sent promotional message!",
    }
  );

  useEffect(() => {
    if (!isSuccess) return;

    setLastFiveUser((prev) => [
      {
        id: prev.length + 1,
        name: data.u_name,
        phone: data.u_mobile,
        balance: data.u_cash,
        isNewuser: data.isNewUser,
        created_at: data.u_created,
      },
      ...prev.slice(0, 4),
    ]);
    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <div style={{ marginTop: 20 }}>
      <Title title="Promotional Message" />
      <Typography variant="h5">Send Promotional Message & Bonus</Typography>
      <Paper style={{ marginTop: 10, padding: 30 }}>
        <SimpleForm toolbar={null}>
          <PromotionalMessageForm
            isSuccess={isSuccess}
            isLoading={isLoading}
            refetch={refetch}
          />
        </SimpleForm>
        {!!lastFiveUser?.length && (
          <>
            <div
              style={{
                width: "100%",
                height: 1,
                margin: "20px 0",
                background: "#E5E5E5",
              }}
            />
            <Typography variant="h6">Last 5 User</Typography>
            <TableContainer component={Paper} style={{ marginTop: 10 }}>
              <Table aria-label="last_five_user" size="medium">
                <TableHead style={{ background: "#F8F9FC" }}>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Phone</TableCell>
                    <TableCell align="left">New User</TableCell>
                    <TableCell align="left">Balance</TableCell>
                    <TableCell align="left">Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lastFiveUser.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {user.name}
                      </TableCell>
                      <TableCell align="left">{user.phone}</TableCell>
                      <TableCell align="left">
                        {user.isNewuser ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="left">{user.balance}</TableCell>
                      <TableCell align="left">{user.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </div>
  );
};

const PromotionalMessageForm = ({ isSuccess, isLoading, refetch }) => {
  const { setValue } = useFormContext();
  const notify = useNotify();
  const { values, errors, hasValidationErrors } = useWatch();

  const handleSend = () => {
    if (hasValidationErrors) {
      Object.keys(errors).forEach((key) =>
        notify(errors[key], { type: "warning" })
      );
      if (!isValidMobileNo(values.u_mobile)) {
        notify("Mobile number is not valid!", { type: "warning" });
      }
      return;
    }

    if (!isValidMobileNo(values.u_mobile)) {
      notify("Mobile number is not valid!", { type: "warning" });
      return;
    }

    refetch({
      endpoint: `/v1/users/promo-user/${values.u_mobile}`,
      method: "POST",
      body: { ...values },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setValue("u_mobile", "+88");
      setValue("amount", "50");
      setValue(
        "message",
        "আরোগ্য এপ ডাউনলোড করে উপভোগ করুন ৫০ টাকা ডিস্কাউন্ট সাথে ফ্রী ডেলিভারি এবং ১০০ টাকা পর্যন্ত ক্যাশব্যাক ডাউনলোড লিংকঃ www.arogga.com/share"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: 10,
        }}
      >
        <TextInput
          source="u_mobile"
          label="Mobile Number"
          variant="outlined"
          defaultValue="+88"
          validate={[required("Phone number is required!")]}
          fullWidth
        />
        <TextInput
          source="amount"
          label="Amount"
          variant="outlined"
          defaultValue="50"
          fullWidth
        />
        <TextInput
          source="message"
          label="Message"
          variant="outlined"
          defaultValue="আরোগ্য এপ ডাউনলোড করে উপভোগ করুন ৫০ টাকা ডিস্কাউন্ট সাথে ফ্রী ডেলিভারি এবং ১০০ টাকা পর্যন্ত ক্যাশব্যাক ডাউনলোড লিংকঃ www.arogga.com/share"
          minRows={2}
          validate={[required()]}
          fullWidth
          multiline
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <AroggaButton
          label="Send"
          type="success"
          onClick={handleSend}
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default PromotionalMessagePage;
