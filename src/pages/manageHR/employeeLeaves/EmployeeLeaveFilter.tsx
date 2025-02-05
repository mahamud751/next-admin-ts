import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  TextInput,
} from "react-admin";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";

const EmployeeLeaveFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      label="Search"
      source="_search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <TaxonomiesByVocabularyInput
      fetchKey="leave_status_type"
      source="_status"
      label="Status"
      alwaysOn
    />
    <TaxonomiesByVocabularyInput
      fetchKey="leave_type"
      source="_type"
      label="Type"
      alwaysOn
    />
    <ReferenceInput
      source="_employee_id"
      label="Employee"
      variant="outlined"
      reference="v1/employee"
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionValue="e_id"
        helperText={false}
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
      />
    </ReferenceInput>
  </Filter>
);

export default EmployeeLeaveFilter;
