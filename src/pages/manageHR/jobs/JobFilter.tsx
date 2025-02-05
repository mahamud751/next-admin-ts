import { Filter, TextInput } from "react-admin";

import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";

const JobFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_search" label="Search" variant="outlined" alwaysOn />
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
    {props.filterValues._department && (
      <FormatedBooleanInput
        source="_include_child_department"
        label="Include Child Department"
        alwaysOn
      />
    )}
  </Filter>
);

export default JobFilter;
