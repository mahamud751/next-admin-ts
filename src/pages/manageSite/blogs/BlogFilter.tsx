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

const BlogFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <TaxonomiesByVocabularyInput
      fetchKey="blog_type"
      source="_bp_type"
      label="Type"
      alwaysOn
    />
    <FormatedBooleanInput source="_is_featured" label="Feature" alwaysOn />
    <FormatedBooleanInput source="_bp_is_active" label="Active" alwaysOn />
    <ReferenceInput
      source="_bp_created_by"
      label="Created By"
      variant="outlined"
      reference="v1/users"
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionValue="u_id"
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
      />
    </ReferenceInput>
  </Filter>
);

export default BlogFilter;
