import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import UserRoleInput from "@/components/manageUser/users/UserRoleInput";
import UserStatusInput from "@/components/manageUser/users/UserStatusInput";
import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  NumberInput,
  ReferenceInput,
  TextInput,
} from "react-admin";

const UserFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <FormatedBooleanInput source="_isEmployee" label="Employee" alwaysOn />
    <FormatedBooleanInput source="_u_pharmacy_id" label="B2B User" alwaysOn />
    <ReferenceInput
      source="_refPartner"
      label="Partner"
      variant="outlined"
      reference="v1/users"
      filter={{ _role: "partner" }}
    >
      <AutocompleteInput optionValue="u_id" optionText="u_name" />
    </ReferenceInput>
    <UserRoleInput source="_role" label="Role" variant="outlined" />
    <UserStatusInput source="_status" variant="outlined" />
    <TextInput
      source="_referrer"
      label="Refer Code"
      variant="outlined"
      resettable
    />
    <NumberInput source="_r_uid" label="Refer User ID" variant="outlined" />
  </Filter>
);

export default UserFilter;
