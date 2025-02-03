import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import LocationInput from "@/components/common/LocationInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const PharmacyFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <ReferenceInput
      source="_user_id"
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
        // resettable
      />
    </ReferenceInput>
    <SelectInput
      source="_status"
      label="Status"
      variant="outlined"
      choices={[
        { id: "pending", name: "Pending" },
        { id: "approved", name: "Approved" },
        { id: "rejected", name: "Rejected" },
        { id: "blocked", name: "Blocked" },
      ]}
      alwaysOn
    />
    <SelectInput
      source="_business_type"
      label="Business Type"
      variant="outlined"
      choices={[
        { id: "pharmacy", name: "Pharmacy" },
        { id: "others", name: "Others" },
      ]}
      alwaysOn
    />
    <TextInput source="_name" label="Name" variant="outlined" resettable />
    <LocationInput source="_location_id" label="Location" variant="outlined" />
    <NumberInput
      source="_trade_license_no"
      label="Trade License No"
      variant="outlined"
      //   resettable
    />
    <NumberInput
      source="_drug_license_no"
      label="Drug License No"
      variant="outlined"
      //   resettable
    />
  </Filter>
);

export default PharmacyFilter;
