import { useEffect, useState } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import { useRequest } from "../../../hooks";

const PermissionCopy = ({
    initialPermissions,
    setInitialPermissions,
    handleCloseDialog,
}) => {
    const classes = useStyles();
    const { data: ranks } = useRequest(
        `/admin/v1/rank?_page=1&_perPage=5000`,
        { method: "GET" },
        {
            isBaseUrl: true,
            isSuccessNotify: false,
            isPreFetching: true,
        }
    );

    const [selectedPermissionValue, setSelectedPermissionValue] =
        useState(initialPermissions);
    const handleAutocompleteChange = (event, value) => {
        const updatedPermissions = value
            ? JSON.parse(value.r_permission || "[]")
            : [];
        setSelectedPermissionValue(updatedPermissions);
    };
    const handleApprove = () => {
        setInitialPermissions(selectedPermissionValue);
        handleCloseDialog();
    };
    const handleClose = () => {
        setSelectedPermissionValue(initialPermissions);
        handleCloseDialog();
    };
    useEffect(() => {}, [selectedPermissionValue]);

    return (
        <div>
            <Autocomplete
                freeSolo
                id="rank-autocomplete"
                options={ranks || []}
                getOptionLabel={(option) => option?.r_title}
                value={ranks?.find(
                    (rank) => selectedPermissionValue === rank?.r_permission
                )}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Designation"
                        margin="normal"
                        variant="outlined"
                    />
                )}
            />

            <div className={classes.approved}>
                <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={handleClose}
                    className={classes.button}
                >
                    Close
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={handleApprove}
                    className={classes.button}
                    style={{ marginLeft: 10 }}
                >
                    Approve
                </Button>
            </div>
            <div>
                <Typography variant="h6">
                    Selected Permission Values:
                </Typography>
                <pre>{JSON.stringify(selectedPermissionValue, null, 2)}</pre>
            </div>
        </div>
    );
};
const useStyles = makeStyles((theme) => ({
    button: {
        width: 120,
        padding: 10,
        marginTop: 20,
    },
    approved: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));
export default PermissionCopy;
