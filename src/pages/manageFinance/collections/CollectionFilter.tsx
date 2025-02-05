import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  SelectInput,
} from "react-admin";

const CollectionFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <ReferenceInput
      source="_from_id"
      label="From User"
      variant="outlined"
      reference="v1/users"
      filter={{ _role: "warehouse,delivery,employee" }}
    >
      <AutocompleteInput optionValue="u_id" optionText="u_name" />
    </ReferenceInput>
    <ReferenceInput
      source="_to_id"
      label="To User"
      variant="outlined"
      reference="v1/users"
      filter={{ _role: "warehouse,delivery,employee" }}
    >
      <AutocompleteInput optionValue="u_id" optionText="u_name" />
    </ReferenceInput>
    <SelectInput
      source="_status"
      variant="outlined"
      choices={[
        { id: "pending", name: "Pending" },
        { id: "confirmed", name: "Confirmed" },
      ]}
    />
  </Filter>
);

export default CollectionFilter;
