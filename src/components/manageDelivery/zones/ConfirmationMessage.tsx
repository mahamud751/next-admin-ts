import { Box, Button, Typography } from "@material-ui/core";
import { FC } from "react";
import { useRequest } from "../../../hooks";
import Confirmation from "../../icons/Confirmation";
import ConfirmationDialog from "./ConfirmationDialog";

interface ConfirmationMessageProps {
    open: boolean;
    onClose: (val: boolean) => void;
    shippingArea?: any;
    refetchAfterSuccess: () => void;
}

const ConfirmationMessage: FC<ConfirmationMessageProps> = ({
    open,
    onClose,
    shippingArea,
    refetchAfterSuccess,
}) => {
    const handleClose = () => {
        onClose(false);
    };

    const { isLoading, refetch: handleSubmit } = useRequest(
        `/v1/location/${shippingArea?.l_id}`,
        {
            method: "POST",
            body: {
                l_status: 0,
            },
        },
        {
            onSuccess: () => {
                onClose(false);
                refetchAfterSuccess();
            },
        }
    );

    const content = (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <Confirmation />
            <Typography
                style={{ fontWeight: 600, fontSize: 20, paddingTop: 10 }}
            >
                Are you sure ?
            </Typography>
            <Typography style={{ color: "##475467", fontSize: 14 }}>
                Do you want to Inactive Shipping area?
            </Typography>
        </div>
    );

    const actions = (
        <Box
            style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                padding: 10,
            }}
        >
            <Button
                size="large"
                onClick={handleClose}
                color="primary"
                variant="outlined"
                disabled={isLoading}
                style={{
                    width: "48%",
                    marginRight: 20,
                    color: "red",
                    border: "1px solid red",
                }}
            >
                Close
            </Button>
            <Button
                autoFocus
                size="large"
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={isLoading}
                style={{ width: "48%" }}
            >
                Confirm
            </Button>
        </Box>
    );

    return (
        <ConfirmationDialog
            open={open}
            onClose={handleClose}
            content={content}
            actions={actions}
        />
    );
};

export default ConfirmationMessage;
