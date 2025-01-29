import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FC } from "react";
import { SelectInput, TextInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { HOTLINE_NUMBER } from "@/utils/constants";
import { required } from "@/utils/helpers";
import AroggaDialogActions from "./AroggaDialogActions";

type SendSmsDialogProps = {
  open: boolean;
  handleClose: () => void;
  [key: string]: any;
};

const SendSmsDialog: FC<SendSmsDialogProps> = ({
  open,
  handleClose,
  ...rest
}) => {
  const values = useWatch();

  const { smsMessage, to } = values;

  const { isLoading, refetch } = useRequest(
    rest?.record?.po_id
      ? `/v1/sendUserSMS/${rest?.record?.po_id}/`
      : `/v1/users/sendUserSMS/${rest?.record?.u_id}/`,
    {
      method: "POST",
      body: rest?.record?.po_id
        ? { message: smsMessage, to }
        : { message: smsMessage },
    },
    {
      onSuccess: () => handleClose(),
    }
  );

  const defaultMessage = `Greetings from Arogga customer care. We tried to reach you regarding your order ID ${rest?.record?.po_id}. Please call ${HOTLINE_NUMBER} or send us a message on fb.com/arogga`;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Send SMS</DialogTitle>
      <DialogContent>
        <TextInput
          source="smsMessage"
          label="Message"
          variant="outlined"
          helperText={false}
          initialValue={rest?.record?.po_id ? defaultMessage : ""}
          validate={[required()]}
          minRows={2}
          multiline
          fullWidth
        />
        {rest?.record?.po_id && (
          <SelectInput
            source="to"
            variant="outlined"
            helperText={false}
            initialValue="billing"
            choices={[
              { id: "billing", name: "Billing" },
              { id: "shipping", name: "Shipping" },
            ]}
            fullWidth
          />
        )}
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        confirmLabel="SEND"
        disabled={!smsMessage}
        onDialogClose={handleClose}
        onConfirm={refetch}
      />
    </Dialog>
  );
};

export default SendSmsDialog;
