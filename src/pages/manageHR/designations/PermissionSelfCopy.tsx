import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import { AutocompleteInput, ReferenceInput } from "react-admin";

import { useRequest } from "@/hooks";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const PermissionSelfCopy = ({
  permissionStateSelf,
  setPermissionStateSelf,
  handleCloseDialog,
  permissionStateSelfRemove,
  setPermissionStateRemove,
}) => {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState(null);
  const [, setSelectedPermissionValue] = useState(permissionStateSelf);
  const [, setSelectedPermissionRemoveValue] = useState(
    permissionStateSelfRemove
  );

  const { data: users } = useRequest(
    `/admin/v1/users/${selectedUser?.u_id || ""}`,
    { method: "GET" },
    {
      isBaseUrl: true,
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [selectedUser],
    }
  );
  useEffect(() => {
    setSelectedPermissionValue(permissionStateSelf);
    setSelectedPermissionRemoveValue(permissionStateSelfRemove);
  }, [permissionStateSelf, permissionStateSelfRemove]);

  const handleApprove = () => {
    const permissions = users?.permissions?.self || [];
    setPermissionStateSelf(permissions);
    const permissionsRemove = users?.permissions?.remove || [];
    setPermissionStateRemove(permissionsRemove);

    handleCloseDialog();
  };

  const handleClose = () => {
    setSelectedPermissionValue(permissionStateSelf);
    setSelectedPermissionRemoveValue(permissionStateSelfRemove);
    handleCloseDialog();
  };

  return (
    <div>
      <ReferenceInput
        source="_u_id"
        label="User"
        variant="outlined"
        reference="v1/users"
      >
        <AutocompleteInput
          matchSuggestion={() => true}
          optionValue="u_id"
          helperText={false}
          optionText={<UserEmployeeOptionTextRenderer />}
          inputText={userEmployeeInputTextRenderer}
          onSelect={(item) => {
            setSelectedUser(item);
          }}
          fullWidth
        />
      </ReferenceInput>

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

export default PermissionSelfCopy;
