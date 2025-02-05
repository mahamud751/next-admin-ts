import { DateTime } from "luxon";
import {
  AutocompleteInput,
  DateInput,
  Filter,
  ReferenceInput,
  TextInput,
} from "react-admin";

import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";

const EmployeeFilter = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <FormatedBooleanInput
      source="_requireRelease"
      label="Require Release"
      alwaysOn
    />
    <FormatedBooleanInput
      source="_currentEmployee"
      label="Current Employee"
      alwaysOn
    />
    <FormatedBooleanInput
      source="_releaseEmployee"
      label="Release Employee"
      alwaysOn
    />
    <ReferenceInput
      source="_u_id"
      label="User"
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
    <TaxonomiesByVocabularyInput
      fetchKey="shift_type"
      source="_shiftType"
      label="Shift Type"
    />

    <DateInput
      label="Confirmation"
      source="_confimration_date"
      variant="outlined"
      defaultValue={DateTime.now().toFormat("yyyy-MM")}
      //   disableDay
    />
    <TreeDropdownInput
      reference="/v1/taxonomiesByVocabulary/department"
      source="_department"
      label="Department"
      variant="outlined"
      keyId="t_id"
      keyParent="t_parent_id"
      optionValue="t_machine_name"
      optionTextValue="t_title"
    />
    {props.filterValues?._department && (
      <FormatedBooleanInput
        source="_include_child_department"
        label="Include Child Department"
        alwaysOn
      />
    )}
  </Filter>
);

export default EmployeeFilter;
