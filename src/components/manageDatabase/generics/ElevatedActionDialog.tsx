import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { FC } from "react";
import { TextInput, useRedirect } from "react-admin";
import { useWatch } from "react-hook-form";
import { useRequest } from "@/hooks";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type ElevatedActionDialogProps = {
  action: string;
  open: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
};

const ElevatedActionDialog: FC<ElevatedActionDialogProps> = ({
  action,
  open,
  setIsDialogOpen,
}) => {
  const redirect = useRedirect();
  const { values } = useWatch();

  const { g_id = null, reason } = values;

  let body = {
    approval_status: action,
  };
  if (action === "rejected") {
    body["reason"] = reason;
  }

  const { isLoading, refetch } = useRequest(
    `/v1/generics/approval/${g_id}`,
    {
      method: "POST",
      body: body,
    },
    {
      onSuccess: () => {
        onDialogClose();
        redirect("/v1/generics");
      },
    }
  );

  const onDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={open} onClose={onDialogClose}>
      <DialogTitle>
        <Typography>{`Are you sure you want to ${action} this generic? #${g_id}`}</Typography>
      </DialogTitle>
      {action === "rejected" && (
        <DialogContent>
          <TextInput
            source="reason"
            label="Reason"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        </DialogContent>
      )}
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={onDialogClose}
        onConfirm={refetch}
        disabled={action === "rejected" && !reason}
      />
    </Dialog>
  );
};

export default ElevatedActionDialog;
