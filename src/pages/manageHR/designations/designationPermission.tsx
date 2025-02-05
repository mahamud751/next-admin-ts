import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Paper,
    makeStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { Title, useRefresh } from "react-admin";
import { useParams } from "react-router-dom";

import PermissionCard from "../../../components/PermissionCard";
import { useDocumentTitle, useRequest } from "../../../hooks";
import PermissionCopy from "./PermissionCopy";

const DesignationPermission = () => {
    useDocumentTitle("Arogga | Designation Permissions");
    const classes = useStyles();
    const refresh = useRefresh();
    const { designationId } = useParams<{ designationId: string }>();
    // const { refetch: fetchSwitchTo } = useSwitchTo(currentUser.u_id);
    const [permissionState, setPermissionState] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const { data: permissionsData } = useRequest(
        "/v1/roles/permissions",
        {},
        { isPreFetching: true }
    );

    const {
        data: designationPermissionData,
        refetch: refetchDesignationPermission,
    } = useRequest(
        `/v1/getRankPermission/${designationId}`,
        {},
        {
            isPreFetching: true,
        }
    );
    const [initialPermissions, setInitialPermissions] = useState([]);
    useEffect(() => {
        if (
            designationPermissionData &&
            designationPermissionData.permissions
        ) {
            setInitialPermissions(designationPermissionData.permissions);
        }
    }, [designationPermissionData]);

    const { isLoading, refetch: updatePermission } = useRequest(
        "",
        {
            method: "POST",
        },
        {
            successNotify: "Successfully updated!",
            onSuccess: () => {
                refetchDesignationPermission();
                refresh();
                handleCloseDialog();
                // process.env.REACT_APP_NODE_ENV === "development" &&
                //     fetchSwitchTo();
            },
        }
    );
    useEffect(() => {
        if (permissionsData && designationPermissionData?.permissions) {
            const formattedPermissionState = permissionsData.map(
                ({ perm_id, perm_name, perm_desc }) => ({
                    id: perm_id,
                    isChecked: initialPermissions.includes(perm_name),
                    permName: perm_name,
                    permDesc: perm_desc,
                })
            );
            setPermissionState(formattedPermissionState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissionsData, initialPermissions]);

    const handleAll = (param) => {
        if (!permissionState?.length) return;

        const modifiedPermissionState = permissionState
            .filter(({ permName }) => permName !== "onlyGET")
            .map((permission) => ({
                ...permission,
                isChecked: param === "selectAll",
            }));

        setPermissionState(modifiedPermissionState);
    };

    const handlePermissionChange = ({ permId }) => {
        const findPermissionStateIndex = permissionState?.findIndex(
            (item) => item.id === permId
        );
        const newPermissionState = [...permissionState];

        newPermissionState[findPermissionStateIndex].isChecked =
            !newPermissionState[findPermissionStateIndex].isChecked;

        setPermissionState(newPermissionState);
    };

    const handleUpdatePermission = () => {
        const formattedCheckedPermissions = permissionState
            ?.filter((permission) => permission.isChecked)
            ?.map((permission) => permission.permName);

        updatePermission({
            endpoint: `/v1/rank/${designationId}`,
            body: {
                r_permission: formattedCheckedPermissions.length
                    ? formattedCheckedPermissions
                    : [""],
            },
        });
    };

    return (
        <Paper style={{ padding: 20, marginTop: 25 }}>
            <div className={classes.AddBtn}>
                <Box display="flex">
                    {/* @ts-ignore */}
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        className={classes.button}
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            //@ts-ignore
                            handleOpenDialog();
                        }}
                    >
                        Copy From
                    </Button>{" "}
                </Box>
            </div>
            <Title title="Designation Permission" />
            <PermissionCard
                id={designationId}
                title={
                    designationPermissionData?.name
                        ? `Permission as ${designationPermissionData?.name}`
                        : ""
                }
                isLoading={isLoading}
                permissionState={permissionState}
                handlePermissionChange={handlePermissionChange}
                handleUpdatePermission={handleUpdatePermission}
                handleAll={handleAll}
            />
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
                <DialogContent>
                    <PermissionCopy
                        initialPermissions={initialPermissions}
                        setInitialPermissions={setInitialPermissions}
                        handleCloseDialog={handleCloseDialog}
                    />
                </DialogContent>
            </Dialog>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: 10,
        textTransform: "capitalize",
    },
    AddBtn: {
        margin: "20px 0px",
        display: "flex",
        justifyContent: "end",
    },
}));

export default DesignationPermission;
