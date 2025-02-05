import {
  AutocompleteInput,
  Filter,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import YearSelectInput from "@/components/common/YearSelectInput";
import { monthsWithId } from "@/utils/constants";

const SalaryFilter = ({ children, ...props }) => (
  <Filter {...props}>
    <TextInput
      label="Search"
      source="_search"
      variant="outlined"
      resettable
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
        optionText={<UserEmployeeOptionTextRenderer isEmployee />}
        inputText={(record: { e_name: string; e_mobile: string }) =>
          !!record ? `${record.e_name} (${record.e_mobile})` : ""
        }
      />
    </ReferenceInput>
    <TreeDropdownInput
      reference="/v1/taxonomiesByVocabulary/department"
      source="_department"
      label="Department"
      variant="outlined"
      keyId="t_id"
      keyParent="t_parent_id"
      optionValue="t_machine_name"
      optionTextValue="t_title"
      alwaysOn
    />
    {props?.filterValues?._department && (
      <FormatedBooleanInput
        source="_include_child_department"
        label="Include Child Department"
        alwaysOn
      />
    )}
    <TreeDropdownInput
      reference="/v1/rank"
      filter={{ _page: 1, _perPage: 5000 }}
      source="_designation"
      label="Designation"
      variant="outlined"
      keyId="r_id"
      keyParent="r_parent"
      keyWeight="r_weight"
      optionTextValue="r_title"
    />
    <YearSelectInput source="_year" variant="outlined" />
    <SelectInput
      source="_month"
      label="Month"
      variant="outlined"
      choices={monthsWithId}
    />
    <TaxonomiesByVocabularyInput
      fetchKey="salary_status_type"
      source="_status"
      label="Status"
    />
    <TaxonomiesByVocabularyInput
      fetchKey="payment_mode"
      source="_payment_mode"
      label="Payment Mode"
    />
  </Filter>
);

export default SalaryFilter;
