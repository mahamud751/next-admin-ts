import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  ReferenceInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const AuditSystemFilter: FC = ({ tabValue, ...rest }: any) => (
  <Filter {...rest}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <ReferenceInput
      source="_brand"
      label="Brand"
      variant="outlined"
      reference="v1/productBrand"
      alwaysOn
    >
      <AutocompleteInput
        optionText="pb_name"
        // options={{
        //     InputProps: {
        //         multiline: true,
        //     },
        // }}
      />
    </ReferenceInput>
    <TaxonomiesByVocabularyInput
      fetchKey="product_type"
      source="_p_type"
      label="Category (L1)"
      alwaysOn
    />
    <TextInput
      source="_rack"
      label="Rack ID"
      variant="outlined"
      resettable
      alwaysOn
    />
    {tabValue !== "createAudit" && (
      <ReferenceInput
        source="_audited_by"
        label="Audited By"
        variant="outlined"
        reference="v1/users"
        alwaysOn
      >
        <AutocompleteInput
          matchSuggestion={() => true}
          optionText={<UserEmployeeOptionTextRenderer />}
          inputText={userEmployeeInputTextRenderer}
        />
      </ReferenceInput>
    )}
    {tabValue !== "createAudit" && (
      <ReferenceInput
        source="_approved_by"
        label="Verified By"
        variant="outlined"
        reference="v1/users"
        alwaysOn
      >
        <AutocompleteInput
          matchSuggestion={() => true}
          optionText={<UserEmployeeOptionTextRenderer />}
          inputText={userEmployeeInputTextRenderer}
        />
      </ReferenceInput>
    )}
  </Filter>
);

export default AuditSystemFilter;
