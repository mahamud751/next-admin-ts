import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { RadioButtonGroupInput, TextInput } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { isValidMobileNo } from "@/utils/helpers";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type WithdrawDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  record?: any;
};

const WithdrawDialog: FC<WithdrawDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  record,
}) => {
  const { setValue } = useFormContext();
  const { values } = useWatch();

  const {
    ut_id,
    ut_withdraw_method,
    ut_withdraw_mobile,
    ut_withdraw_instruction,
  } = record || {};

  useEffect(() => {
    setValue("withdraw_method", "bKash");
    if (isValidMobileNo(ut_withdraw_mobile)) {
      setValue("withdraw_mobile", ut_withdraw_mobile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen, record]);

  const { isLoading, refetch } = useRequest(
    `/general/v1/cashWithdraw/${ut_id}`,
    {
      method: "POST",
      body: {
        withdraw_method: ut_withdraw_method || values.withdraw_method,
        withdraw_mobile: values.withdraw_mobile,
      },
    },
    {
      isBaseUrl: true,
      isRefresh: true,
      onSuccess: () => handleOnClose(),
    }
  );

  const handleOnClose = () => {
    setValue("withdraw_mobile", "");
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Withdraw</DialogTitle>
      <DialogContent>
        {ut_withdraw_method ? (
          <Typography>{ut_withdraw_instruction}</Typography>
        ) : (
          <>
            <Typography>
              Please select your withdraw method to withdraw your fund
            </Typography>
            <RadioButtonGroupInput
              source="withdraw_method"
              label=""
              choices={[{ id: "bKash", name: "bKash" }]}
              helperText={false}
            />
            <TextInput
              source="withdraw_mobile"
              variant="outlined"
              helperText={false}
              placeholder={`Enter your ${values.withdraw_method} number`}
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onConfirm={refetch}
        onDialogClose={handleOnClose}
      />
    </Dialog>
  );
};

export default WithdrawDialog;
