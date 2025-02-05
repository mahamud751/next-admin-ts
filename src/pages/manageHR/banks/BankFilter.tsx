import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

const BankFilter: FC<FilterProps> = (props) => {
  return (
    <Filter {...props}>
      <TextInput
        source="_search"
        label="Search by ID"
        variant="outlined"
        resettable
        alwaysOn
      />
      <TextInput
        source="_name"
        label="Bank Name"
        variant="outlined"
        resettable
        alwaysOn
      />
      <TextInput
        source="_branch"
        label="Branch"
        variant="outlined"
        resettable
        alwaysOn
      />
      <FormatedBooleanInput source="_active" label="Active" />
    </Filter>
  );
};

export default BankFilter;
