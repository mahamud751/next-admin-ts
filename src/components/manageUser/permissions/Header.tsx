import { Box, Button, TextField, Autocomplete } from "@mui/material";

import { FC, useEffect, useState } from "react";
import { Confirm, usePermissions } from "react-admin";

import { useRequest } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import Dialog from "./Dialog";

type HeaderProps = {
  permissionState: any[];
  path: string;
  rolesData: any[];
  refetchPermissions: () => void;
  refetchRolesWithPermissions: () => void;
  setFilterListByRole: (state: any[]) => void;
};

const Header: FC<HeaderProps> = ({
  path,
  permissionState,
  rolesData,
  refetchPermissions,
  refetchRolesWithPermissions,
  setFilterListByRole,
}) => {
  const { permissions } = usePermissions();

  const [target, setTarget] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const { isLoading, refetch: refetchReset } = useRequest(
    "/v1/roles/reset",
    {},
    {
      onSuccess: () => setIsResetDialogOpen(false),
    }
  );

  const handleRoleChange = (roleId) => {
    const roleState = permissionState.filter((role) => role.role_id === roleId);
    setFilterListByRole(roleState ? roleState : permissionState);
  };

  const options = rolesData?.map(({ role_id, role_name }) => ({
    id: role_id,
    name: role_name,
  }));

  useEffect(() => {
    if (path?.length) {
      const roleState = permissionState.filter(
        (role) => role.role_name === path
      );
      setFilterListByRole(roleState ? roleState : permissionState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, permissionState]);

  return (
    <>
      <Box display="flex" justifyContent="flex-end" gap={5}>
        {permissions?.includes("permissionCreate") && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              setTarget("createPermission");
              setIsDialogOpen(true);
            }}
          >
            Create Permission
          </Button>
        )}
        {permissions?.includes("roleCreate") && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              setTarget("createRole");
              setIsDialogOpen(true);
            }}
            style={{
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            Create Role
          </Button>
        )}
        {permissions?.includes("roleReset") && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setIsResetDialogOpen(true)}
            style={{
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            Reset
          </Button>
        )}
        {!path?.length && (
          <Autocomplete
            size="small"
            options={!!options ? options : []}
            getOptionLabel={(option: any) =>
              capitalizeFirstLetterOfEachWord(option.name) || ""
            }
            onChange={(_, newValue: any) => handleRoleChange(newValue?.id)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Role"
                color="primary"
                variant="outlined"
                style={{ width: 200 }}
              />
            )}
          />
        )}
      </Box>
      <Dialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        target={target}
        refresh={
          target === "createPermission"
            ? refetchPermissions
            : refetchRolesWithPermissions
        }
      />
      <Confirm
        title="Reset Permission"
        content="Are you sure you want to reset permission?"
        isOpen={isResetDialogOpen}
        loading={isLoading}
        onConfirm={refetchReset}
        onClose={() => setIsResetDialogOpen(false)}
      />
    </>
  );
};

export default Header;
