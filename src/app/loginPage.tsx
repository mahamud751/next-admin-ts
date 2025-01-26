import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  createTheme,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import Fingerprint from "@mui/icons-material/Fingerprint";
import HttpIcon from "@mui/icons-material/Http";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Phone from "@mui/icons-material/Phone";
import stringify from "query-string";
import { useState } from "react";
import { Notification, useLogin, useNotify } from "react-admin";

import { useDocumentTitle } from "../hooks";
import { Status } from "../utils/enums";
import {
  getApiBaseUrl,
  isValidMobileNo,
  logger,
  setBaseApiUrl,
} from "../utils/helpers";

const LoginPage = () => {
  useDocumentTitle("Arogga ERP - Sign in");

  const classes = useStyles();
  const notify = useNotify();
  const login = useLogin();

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiUrl, setLocalApiUrl] = useState(getApiBaseUrl());

  const handleSubmit = (e) => {
    e.preventDefault();

    const mobile = e.target.mobile.value;

    if (!isValidMobileNo(mobile)) {
      return notify("Invalid mobile number!", { type: "warning" });
    }

    setIsLoading(true);

    if (isVerifying) {
      const otp = e.target.otp.value;

      login({ mobile, otp })
        .then(() => notify("Successfully signed in!", { type: "success" }))
        .catch((err) => notify(err?.message, { type: "error" }))
        .finally(() => setIsLoading(false));
    } else {
      const url = `${
        getApiBaseUrl().split("/admin")[0]
      }/auth/v1/sms/send?f=admin`;

      fetch(url, {
        method: "POST",
        body: stringify.stringify({ mobile }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => res?.json())
        .then((res) => {
          if (res?.status === Status.SUCCESS) {
            setIsVerifying(true);
            notify(res?.message, { type: "success" });
          } else {
            notify(res?.message || "Something went wrong! Please try again!", {
              type: "error",
            });
          }

          return res;
        })
        .catch((err) => {
          logger(err);
          notify(err?.message || "Something went wrong! Please try again!", {
            type: "error",
          });
        })
        .finally(() => setIsLoading(false));
    }

    if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      setBaseApiUrl(apiUrl);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={400}
      padding={3}
      margin="0 auto"
      marginTop={12}
      borderRadius={8}
      bgcolor="#eee"
    >
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" style={{ margin: "15px 0" }}>
        Sign into Arogga ERP
      </Typography>
      <Box component="form" onSubmit={handleSubmit} width="100%">
        {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
          <Box mt={2}>
            <TextField
              label="API URL"
              value={apiUrl}
              variant="outlined"
              placeholder="https://api.arogga.com"
              onChange={(e) => setLocalApiUrl(e.target.value)}
              onBlur={() => setBaseApiUrl(apiUrl)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpIcon />
                  </InputAdornment>
                ),
              }}
              multiline
              fullWidth
            />
          </Box>
        )}
        <Box mt={2} />
        <TextField
          label="Mobile No"
          id="mobile"
          type="text"
          defaultValue="+88"
          variant="outlined"
          placeholder="+88***********"
          disabled={isVerifying || isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
          autoFocus
          fullWidth
        />
        {isVerifying && (
          <Box mt={2}>
            <TextField
              label="OTP"
              id="otp"
              type="number"
              variant="outlined"
              placeholder="******"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Fingerprint />
                  </InputAdornment>
                ),
              }}
              autoFocus
              fullWidth
            />
          </Box>
        )}
        <Box mt={2} />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ backgroundColor: "#008069" }}
          disabled={isLoading}
          fullWidth
        >
          {!isLoading && !isVerifying && "Next"}
          {!isLoading && isVerifying && "Sign in"}
          {isLoading && (
            <CircularProgress
              size={25}
              thickness={2}
              style={{ color: "white" }}
            />
          )}
        </Button>
      </Box>
      <Notification />
    </Box>
  );
};

export default LoginPage;

const theme = createTheme({
  spacing: 8,
});

const useStyles = makeStyles(() => ({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    backgroundColor: "#008069",
  },
}));
