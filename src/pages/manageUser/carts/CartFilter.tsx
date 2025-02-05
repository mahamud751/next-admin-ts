import { FC } from "react";
import {
  AutocompleteInput,
  DateInput,
  Filter,
  FilterProps,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import UserLocationInput from "@/components/common/UserLocationInput";

const CartFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <ReferenceInput
      source="_user"
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
    <SelectInput
      source="_status"
      label="Status"
      variant="outlined"
      choices={[
        { id: "current", name: "Current" },
        { id: "ordered", name: "Ordered" },
      ]}
      alwaysOn
    />
    <UserLocationInput
      source="_user_location"
      label="Location"
      variant="outlined"
    />
    <DateInput
      source="_created_at"
      label="Cart Date Start"
      variant="outlined"
    />
    <DateInput
      source="_created_at_end"
      label="Cart Date End"
      variant="outlined"
    />
    <DateInput
      source="_modified_at"
      label="Cart Modified Start"
      variant="outlined"
    />
    <DateInput
      source="_modified_at_end"
      label="Cart Modified End"
      variant="outlined"
    />
  </Filter>
);

export default CartFilter;
