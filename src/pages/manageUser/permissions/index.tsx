import { Paper } from "@mui/material";
import { FC, Fragment, useEffect, useState } from "react";
import { Title } from "react-admin";

import {
  useDocumentTitle,
  useGetCurrentUser,
  useRequest,
  useSwitchTo,
} from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  isJSONParsable,
} from "@/utils/helpers";
import PermissionCard from "@/components/common/PermissionCard";
import Header from "@/components/manageUser/permissions/Header";

const PermissionsPage: FC = ({ ...rest }) => {
  useDocumentTitle("Arogga | Permissions");
  const currentUser = useGetCurrentUser();
  //@ts-ignore
  const location = rest?.location;
  const queryParams = location?.search;
  const userValue = queryParams ? queryParams.substring(1).split("=")[0] : null;
  const [permissionState, setPermissionState] = useState([]);
  const [filterListByRole, setFilterListByRole] = useState([]);

  const { refetch: fetchSwitchTo } = useSwitchTo(currentUser.u_id);

  const { data: permissionsData, refetch: refetchPermissions } = useRequest(
    "/v1/roles/permissions",
    {},
    { isPreFetching: true }
  );

  const { data: rolesData, refetch: refetchRolesWithPermissions } = useRequest(
    "/v1/roles?permissions=1",
    {},
    { isPreFetching: true }
  );

  const { isLoading: isUpdateRoleLoading, refetch: updateRole } = useRequest(
    "",
    {
      method: "POST",
    },
    {
      successNotify: "Successfully updated!",
      onSuccess: () => {
        refetchRolesWithPermissions();
        process.env.REACT_APP_NODE_ENV === "development" && fetchSwitchTo();
      },
    }
  );

  useEffect(() => {
    if (!permissionsData?.length || !rolesData?.length) return;
    const modifiedPermissionState = rolesData.map(
      ({ role_permissions, ...rest }) => {
        const permissions = isJSONParsable(role_permissions)
          ? JSON.parse(role_permissions)
          : [];
        const modifiedRolePermissions = permissionsData.map(
          ({ perm_id, perm_name, perm_desc }) => ({
            id: perm_id,
            isChecked: permissions?.includes(perm_name),
            permName: perm_name,
            permDesc: perm_desc,
          })
        );

        return {
          ...rest,
          role_permissions: modifiedRolePermissions,
        };
      }
    );
    setPermissionState(modifiedPermissionState);
  }, [permissionsData, rolesData]);

  const handleAll = (param, roleId) => {
    if (!permissionState?.length) return;

    const findRoleStateIndex = permissionState.findIndex(
      (role) => role.role_id === roleId
    );
    const newRolesState = [...permissionState];
    const { role_permissions } = newRolesState[findRoleStateIndex];
    const modifiedRolePermissions = role_permissions
      ?.filter(({ permName }) => permName !== "onlyGET")
      ?.map((permission) => ({
        ...permission,
        isChecked: param === "selectAll",
      }));
    newRolesState[findRoleStateIndex].role_permissions =
      modifiedRolePermissions;
    setPermissionState(newRolesState);
  };

  const handlePermissionChange = ({ roleId, permId }) => {
    const findRoleStateIndex = permissionState?.findIndex(
      (role) => role.role_id === roleId
    );

    const newPermissionState = [...permissionState];
    const { role_permissions } = newPermissionState[findRoleStateIndex];
    const findRolePermissionIndex = role_permissions?.findIndex(
      (rolePermission) => rolePermission.id === permId
    );
    role_permissions[findRolePermissionIndex].isChecked =
      !role_permissions[findRolePermissionIndex].isChecked;
    newPermissionState[findRoleStateIndex].role_permissions = role_permissions;

    setPermissionState(newPermissionState);
  };

  const handleUpdatePermission = ({ roleId, roleName, permissions }) => {
    const formattedCheckedRolePermissions = permissions
      ?.filter((permission) => permission.isChecked)
      ?.map((permission) => permission.permName);

    updateRole({
      endpoint: `/v1/roles/${roleId}`,
      body: {
        role_name: roleName,
        role_permissions: formattedCheckedRolePermissions.length
          ? formattedCheckedRolePermissions
          : [""],
      },
    });
  };

  return (
    <Paper style={{ padding: 20, marginTop: 25 }}>
      <Title title="List of Role Permissions" />
      <Header
        permissionState={permissionState}
        rolesData={rolesData}
        refetchPermissions={refetchPermissions}
        refetchRolesWithPermissions={refetchRolesWithPermissions}
        setFilterListByRole={setFilterListByRole}
        path={userValue}
      />
      {(!!filterListByRole?.length ? filterListByRole : permissionState).map(
        (item, i) => (
          <Fragment key={i}>
            <PermissionCard
              id={item.role_id}
              roleId={item.role_id}
              roleName={item.role_name}
              title={`Role Permission as ${capitalizeFirstLetterOfEachWord(
                item.role_name
              )}`}
              isLoading={isUpdateRoleLoading}
              permissionState={item.role_permissions}
              handlePermissionChange={handlePermissionChange}
              handleUpdatePermission={handleUpdatePermission}
              handleAll={handleAll}
            />
          </Fragment>
        )
      )}
    </Paper>
  );
};

export default PermissionsPage;
