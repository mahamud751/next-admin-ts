import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const GenericFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <SelectInput
      source="_status"
      label="Status"
      variant="outlined"
      choices={[
        { id: "suggested", name: "Suggested" },
        { id: "inactive", name: "Inactive" },
        { id: "active", name: "Active" },
      ]}
      alwaysOn
    />
    <SelectInput
      source="_approval_status"
      label="Approval Status"
      variant="outlined"
      choices={[
        { id: "new,edited", name: "Approval Request" },
        { id: "rejected", name: "Change Needed" },
        {
          id: "new",
          name: "New",
        },
        {
          id: "approved",
          name: "Approved",
        },
        {
          id: "edited",
          name: "Edited",
        },
        {
          id: "cancelled",
          name: "Cancelled",
        },
        {
          id: "rejected",
          name: "Rejected",
        },
      ]}
      alwaysOn
    />
    <FormatedBooleanInput
      source="_is_antibiotics"
      label="Antibiotics"
      resettable
      alwaysOn
    />
    <FormatedBooleanInput
      source="_is_controlled"
      label="Controlled"
      resettable
      alwaysOn
    />
  </Filter>
);

export default GenericFilter;
