import { Box, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useEffect } from "react";
import { TextInput, required, useNotify } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { isEmpty } from "@/utils/helpers";
import LoaderOrButton from "../common/LoaderOrButton";

type PopulateUserInfoProps = {
  isUserChecked: boolean;
  setIsUserChecked: (isUserChecked: boolean) => void;
  setHasLocationField: (hasLocationField: boolean) => void;
  receiveUserData: (receiveUserData: any) => void;
};

const LabPopulateUserInfo: FC<PopulateUserInfoProps> = ({
  isUserChecked,
  setIsUserChecked,
  setHasLocationField,
  receiveUserData,
}) => {
  const classes = useStyles();
  const notify = useNotify();
  const { setValue } = useFormContext();
  const values = useWatch();
  const { data, isLoading, refetch } = useRequest(
    `/v1/users?_mobile=${values.u_mobile?.split("+")[1]}`,
    {},
    {
      onFinally: () => setIsUserChecked(true),
    }
  );
  useEffect(() => {
    receiveUserData(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    setValue("u_name", data?.[0]?.u_name || undefined);
    setValue("u_id", data?.[0]?.u_id || undefined);
    setValue("u_o_count", data?.[0]?.u_o_count || undefined);
    setValue("u_d_count", data?.[0]?.u_d_count || undefined);
    setValue("user", data?.[0] || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    !isEmpty(values.user) && setValue("user", undefined);
    setValue("o_ul_id", undefined);
    values.u_name && setValue("u_name", undefined);
    setValue("s_address.name", values.u_name);
    setValue("s_address.mobile", values.u_mobile);
    setIsUserChecked(false);
    setHasLocationField(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.u_mobile]);
  useEffect(() => {
    setValue("s_address.name", values.u_name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.u_name]);
  useEffect(() => {
    if (!values.o_ul_id) {
      setValue("s_address.name", data?.[0]?.u_name);
      setValue("s_address.mobile", data?.[0]?.u_mobile);
      setValue("s_address.division", undefined);
      setValue("s_address.district", undefined);
      setValue("s_address.area", undefined);
      setValue("s_address.homeAddress", undefined);
      setValue("s_address.addressType", "Home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.o_ul_id]);
  useEffect(() => {
    if (!isEmpty(values.user)) {
      setValue("s_address.name", values.u_name);
      setValue("s_address.mobile", values.u_mobile);
      setValue("s_address.division", undefined);
      setValue("s_address.district", undefined);
      setValue("s_address.area", undefined);
      setValue("s_address.homeAddress", undefined);
      setValue("s_address.addressType", "Home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.user]);
  const handleCheckUser = () => {
    if (!/(^(\+8801|8801|008801))(\d){9}$/.test(values.u_mobile))
      return notify("Invalid mobile number!", { type: "error" });
    refetch();
  };
  return (
    <Box display="flex" width="100%">
      <TextInput
        source="u_mobile"
        label="Mobile No"
        variant="outlined"
        // initialValue="+88"
        style={{ width: "256px" }}
        validate={[required()]}
      />
      {!isUserChecked && (
        <LoaderOrButton
          label="Check User"
          isLoadingLabel={isLoading}
          btnVariant="contained"
          btnColor="primary"
          btnStyle={classes.checkUserBtn}
          onClick={handleCheckUser}
        />
      )}
    </Box>
  );
};
const theme = createTheme({});
const useStyles = makeStyles(() => ({
  checkUserBtn: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    height: "40px",
    width: "125px",
    marginLeft: 8,
  },
}));

export default LabPopulateUserInfo;
