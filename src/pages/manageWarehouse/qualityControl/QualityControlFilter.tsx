import { FC } from "react";
import {
  AutocompleteInput,
  DateInput,
  Filter,
  FilterProps,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const QualityControlFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <SelectInput
      source="_entity"
      label="Entity"
      variant="outlined"
      choices={[
        { id: "purchase", name: "Purchase" },
        { id: "shipment", name: "Shipment" },
      ]}
      alwaysOn
    />
    <SelectInput
      source="_issue_type"
      label="Issue Type"
      variant="outlined"
      choices={[
        { id: "missing", name: "Missing" },
        { id: "replacement", name: "Replacement" },
        { id: "return", name: "Return" },
      ]}
      alwaysOn
    />
    <FormatedBooleanInput
      source="_approve_full_refund"
      label="Approve Full Refund?"
    />
    <DateInput source="_created_at" label="Created At" variant="outlined" />
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
      />
    </ReferenceInput>
  </Filter>
);

export default QualityControlFilter;
