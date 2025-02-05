import { SelectInput } from "react-admin";

import { useRequest } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";

const UserRoleInput = (props) => {
  const { data } = useRequest("/v1/roles", {}, { isPreFetching: true });

  return (
    <SelectInput
      label="Role"
      choices={!!data?.length ? data : []}
      optionText={(item) => capitalizeFirstLetterOfEachWord(item.role_name)}
      optionValue="role_name"
      {...props}
    />
  );
};

export default UserRoleInput;
