import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import LocationInput from "@/components/common/LocationInput";
import AddressTypeInput from "@/components/common/AddressTypeInput";

const AddressFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <ReferenceInput
      source="u_id"
      label="User"
      variant="outlined"
      reference="v1/users"
      alwaysOn
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        helperText={false}
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
      />
    </ReferenceInput>
    <LocationInput source="l_id" label="Location" variant="outlined" />
    <AddressTypeInput
      source="_ul_type"
      label="Address Type"
      variant="outlined"
    />
  </Filter>
);

export default AddressFilter;
