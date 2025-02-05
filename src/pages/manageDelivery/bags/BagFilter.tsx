import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

const BagFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <SelectInput
      source="_sb_shift_type"
      label="Shift Type"
      variant="outlined"
      choices={[
        { id: "regular", name: "Regular" },
        { id: "express", name: "Express" },
      ]}
      alwaysOn
    />
    <ReferenceInput
      source="_sb_zone_id"
      label="Zone"
      reference="v1/zone"
      variant="outlined"
      filter={{
        _perPage: "100",
      }}
      allowEmpty
      alwaysOn
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionText={(value) => (value && value?.z_name) || ""}
      />
    </ReferenceInput>

    <ReferenceInput
      source="_sb_deliveryman_id"
      label="Delivery Man"
      variant="outlined"
      reference="v1/users/delivery-man"
      filter={{
        shift_type: "all",
      }}
      alwaysOn
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionText={(value) =>
          !!value?.u_name && value?.bag_assigned
            ? `${value?.u_name} (Assigned)`
            : value?.u_name || ""
        }
      />
    </ReferenceInput>
    <SelectInput
      source="_sb_status"
      label="Status"
      variant="outlined"
      choices={[
        { id: "open", name: "Open" },
        { id: "assigned", name: "Assigned" },
        { id: "picked", name: "Picked" },
        { id: "submitted", name: "Submitted" },
        { id: "delivering", name: "Delivering" },
        { id: "closed", name: "Closed" },
      ]}
    />
  </Filter>
);

export default BagFilter;
