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

const NotificationFilter: FC<FilterProps> = (props) => (
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
        { id: "promotional", name: "Promotional" },
        { id: "transactional", name: "Transactional" },
      ]}
      alwaysOn
    />
    <TextInput source="_title" label="Title" variant="outlined" resettable />
    <ReferenceInput
      source="_created_by"
      label="Created By"
      variant="outlined"
      reference="v1/users"
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionValue="u_id"
        helperText={false}
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
      />
    </ReferenceInput>
  </Filter>
);

export default NotificationFilter;
