import {
  Box,
  DialogContent,
  DialogTitle,
  Dialog as MDialog,
  TextField,
} from "@mui/material";
import { ChangeEvent, FC, useState } from "react";

import { useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  target: string;
  refresh: () => void;
};

const Dialog: FC<DialogProps> = ({ open, handleClose, target, refresh }) => {
  const classes = useAroggaStyles();

  const initialDialogState = {
    name: "",
    description: "",
    order: "",
  };

  const [state, setState] = useState(initialDialogState);

  const { name, description, order } = state;

  const { isLoading, refetch } = useRequest(
    target === "createPermission" ? "/v1/roles/permissions" : "/v1/roles",
    {
      method: "POST",
      body:
        target === "createPermission"
          ? {
              perm_name: name?.trim(),
              perm_desc: description,
            }
          : {
              role_name: name?.trim(),
              role_order: order,
              role_permissions: JSON.stringify([]),
            },
    },
    {
      successNotify: "Successfully created!",
      onSuccess: () => {
        handleClose();
        refresh();
      },
      onFinally: () => clearState(),
    }
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const clearState = () => {
    setState(initialDialogState);
  };

  const handleCloseOrCancel = () => {
    clearState();
    handleClose();
  };

  return (
    <MDialog open={open} onClose={handleCloseOrCancel}>
      <DialogTitle>
        {target === "createPermission" ? "Create Permission" : "Create Role"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={name}
          onChange={handleChange}
          className={classes.block}
          multiline
        />
        <Box mt={2} />
        {target === "createPermission" && (
          <TextField
            label="Description"
            variant="outlined"
            name="description"
            value={description}
            onChange={handleChange}
            className={classes.block}
            multiline
          />
        )}
        {target === "createRole" && (
          <TextField
            label="Sort Order"
            variant="outlined"
            type="number"
            name="order"
            value={order}
            onChange={handleChange}
            className={classes.block}
          />
        )}
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        confirmLabel="SEND"
        disabled={!name}
        onDialogClose={handleCloseOrCancel}
        onConfirm={refetch}
      />
    </MDialog>
  );
};

export default Dialog;
