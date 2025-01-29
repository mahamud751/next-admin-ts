import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const BrandFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <TaxonomiesByVocabularyInput
      fetchKey="product_type"
      source="_product_type"
      label="Product Type"
      alwaysOn
    />
    <FormatedBooleanInput source="_pb_is_feature" label="Feature" alwaysOn />
    <ReferenceInput
      source="_created_by"
      label="Created By"
      variant="outlined"
      reference="v1/users"
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionValue="u_id"
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
        // resettable
      />
    </ReferenceInput>
  </Filter>
);

export default BrandFilter;
