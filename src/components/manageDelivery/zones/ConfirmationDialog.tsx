import {
    Dialog,
    IconButton,
    DialogActions as MuiDialogActions,
    DialogContent as MuiDialogContent,
    DialogTitle as MuiDialogTitle,
    Typography,
    makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { FC } from "react";

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogContent: {
        padding: theme.spacing(2),
        borderTop: "none", // Remove top border
        borderBottom: "none", // Remove bottom border
    },
    dialogActions: {
        margin: 0,
        padding: theme.spacing(1),
    },
}));

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    content: React.ReactNode;
    actions: React.ReactNode;
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
    open,
    onClose,
    title,
    content,
    actions,
}) => {
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <MuiDialogTitle disableTypography className={classes.dialogTitle}>
                <Typography variant="h6">{title}</Typography>
                <IconButton className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>
            <MuiDialogContent className={classes.dialogContent} dividers>
                {content}
            </MuiDialogContent>
            <MuiDialogActions className={classes.dialogActions}>
                {actions}
            </MuiDialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
