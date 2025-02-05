import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FC } from "react";
import { TextInput, useRedirect } from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type BonusDialogProps = {
  open: boolean;
  bonusAmount: number;
  handleClose: () => void;
  record?: any;
  [key: string]: any;
};

const BonusDialog: FC<BonusDialogProps> = ({
  record,
  open,
  bonusAmount,
  handleClose,
  ...rest
}) => {
  const redirect = useRedirect();
  const { values } = useWatch();

  const { bonusMessage } = values;

  const { isLoading, refetch } = useRequest(
    `/${rest.resource}/addBonus/${record?.u_id}/`,
    {
      method: "POST",
      body: { amount: bonusAmount, message: bonusMessage },
    },
    {
      onSuccess: () => {
        handleClose();
        redirect("/v1/users");
      },
    }
  );

  const defaultMessage = `আরোগ্য এপ ডাউনলোড করে উপভোগ করুন ৫০ টাকা ডিস্কাউন্ট সাথে ফ্রী ডেলিভারি এবং ১০০ টাকা পর্যন্ত ক্যাশব্যাক। ডাউনলোড লিংকঃ www.arogga.com/share`;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {`Are you sure you want to give this user ${bonusAmount}TK bonus?`}
      </DialogTitle>
      <DialogContent>
        <TextInput
          source="bonusMessage"
          label="Message"
          variant="outlined"
          helperText={false}
          defaultValue={bonusAmount === 50 ? defaultMessage : ""}
          minRows={2}
          multiline
          fullWidth
        />
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={handleClose}
        onConfirm={refetch}
      />
    </Dialog>
  );
};

export default BonusDialog;
