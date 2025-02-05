import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const VariantFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <FormatedBooleanInput source="_vt_status" label="Status" alwaysOn />
    <TextInput source="_vt_title" label="Title" variant="outlined" resettable />
    <TaxonomiesByVocabularyInput
      fetchKey="product_type"
      source="_allowedProductType"
      label="Type"
    />
    <ReferenceInput
      source="_vt_created_by"
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

export default VariantFilter;
