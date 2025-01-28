import { Button, CircularProgress, DialogActions } from "@mui/material";
import { FC, ReactNode } from "react";

type AroggaDialogActionsProps = {
  isLoading: boolean;
  isChildrenLoading?: boolean;
  hasCancelBtn?: boolean;
  cancelLabel?: string;
  hasConfirmBtn?: boolean;
  confirmLabel?: string;
  children?: ReactNode;
  childrenPosition?: "left" | "center" | "right";
  disabled?: boolean;
  onDialogClose: () => void;
  onConfirm: () => void;
};

const AroggaDialogActions: FC<AroggaDialogActionsProps> = ({
  isLoading,
  isChildrenLoading,
  hasCancelBtn = true,
  cancelLabel = "Cancel",
  hasConfirmBtn = true,
  confirmLabel = "Confirm",
  children,
  childrenPosition = "left",
  disabled = false,
  onDialogClose,
  onConfirm,
}) => {
  const renderChildren = isChildrenLoading ? (
    <CircularProgress size={20} />
  ) : (
    children
  );

  return (
    <DialogActions>
      {childrenPosition === "left" && renderChildren}
      {hasCancelBtn && (
        <Button
          color="primary"
          variant="outlined"
          onClick={onDialogClose}
          style={{
            border: "1px solid #6C757D",
            fontWeight: 600,
            fontSize: 16,
            color: "#6C757D",
          }}
        >
          {cancelLabel}
        </Button>
      )}
      {childrenPosition === "center" && renderChildren}
      {hasConfirmBtn && isLoading ? (
        <CircularProgress size={20} />
      ) : (
        hasConfirmBtn && (
          <Button
            color="primary"
            variant="contained"
            onClick={onConfirm}
            style={{
              fontWeight: 600,
              fontSize: 16,
            }}
            disabled={disabled}
          >
            {confirmLabel}
          </Button>
        )
      )}
      {childrenPosition === "right" && renderChildren}
    </DialogActions>
  );
};

export default AroggaDialogActions;
