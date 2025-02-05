import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const VendorFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <SelectInput
      source="_type"
      label="Type"
      variant="outlined"
      choices={[
        {
          id: "company",
          name: "Official",
        },
        { id: "local", name: "Local" },
        {
          id: "foreign",
          name: "Foreign",
        },
      ]}
      alwaysOn
    />
    <ReferenceInput
      source="_kam_user_id"
      label="KAM"
      variant="outlined"
      reference="v1/users"
      alwaysOn
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
      />
    </ReferenceInput>
    <SelectInput
      source="_status"
      label="Status"
      variant="outlined"
      choices={[
        { id: "active", name: "Active" },
        {
          id: "inactive",
          name: "Inactive",
        },
      ]}
      alwaysOn
    />
    <TextInput source="_name" label="Name" variant="outlined" />
    <TextInput source="_phone" label="Phone" variant="outlined" />
  </Filter>
);

export default VendorFilter;
