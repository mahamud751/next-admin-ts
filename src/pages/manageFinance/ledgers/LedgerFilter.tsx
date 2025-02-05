import { FC } from "react";
import {
  AutocompleteInput,
  DateInput,
  Filter,
  FilterProps,
  ReferenceInput,
  TextInput,
} from "react-admin";

import LedgerMethodInput from "@/components/manageFinance/ledgers/LedgerMethodInput";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const LedgerFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      label="Search"
      source="_search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <DateInput source="_created" label="Date" variant="outlined" />
    <DateInput source="_created_end" label="Date End" variant="outlined" />
    <TaxonomiesByVocabularyInput
      fetchKey="ledger_types"
      source="_type"
      optionValue="t_title"
      label="Type"
    />
    <LedgerMethodInput
      source="_method"
      label="Method"
      variant="outlined"
      defaultValue="Cash"
      choices={[
        {
          id: "Payable-paid",
          name: "Payable-paid",
        },
      ]}
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
  </Filter>
);

export default LedgerFilter;
