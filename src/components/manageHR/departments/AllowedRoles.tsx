import { Checkbox, FormControlLabel } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";

type AllowedRolesProps = {
  isChecked?: boolean;
  allowedRolesFromRecord: string[];
};

const AllowedRoles: FC<AllowedRolesProps> = ({
  isChecked = false,
  allowedRolesFromRecord = [],
}) => {
  const { values } = useWatch();
  const [roles, setRoles] = useState([]);

  const { data } = useRequest("/v1/roles", {}, { isPreFetching: true });

  useEffect(() => {
    if (!data?.length) return;

    const modifiedData = data.map(({ role_id, role_name }) => ({
      id: role_id,
      isChecked: isChecked ? true : allowedRolesFromRecord?.includes(role_name),
      roleName: role_name,
    }));
    setRoles(modifiedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChange = (id) => {
    const findIndex = roles?.findIndex((item) => item.id === id);
    const newRoles = [...roles];
    newRoles[findIndex].isChecked = !newRoles[findIndex].isChecked;
    setRoles(newRoles);
  };

  values.t_allowed_roles = roles
    ?.filter(({ isChecked }) => isChecked)
    ?.map((item) => item.roleName);

  return (
    <>
      {!!roles?.length &&
        roles.map(({ id, isChecked, roleName }) => (
          <FormControlLabel
            label={capitalizeFirstLetterOfEachWord(roleName)}
            control={
              <Checkbox
                checked={isChecked}
                onChange={() => handleChange(id)}
                inputProps={{
                  "aria-label": "primary checkbox",
                }}
              />
            }
            key={id}
          />
        ))}
    </>
  );
};

export default AllowedRoles;
