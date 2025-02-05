import {
  AutocompleteInput,
  Filter,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

const SubAreaFilter = ({ ...props }) => {
  return (
    <Filter {...props}>
      <TextInput
        source="_search"
        label="Search"
        variant="outlined"
        resettable
        alwaysOn
      />

      <SelectInput
        source="_is_free_delivery"
        label="Free Delivery"
        variant="outlined"
        choices={[
          { id: "1", name: "Yes" },
          { id: "0", name: "No" },
        ]}
      />
      <SelectInput
        source="_status"
        label="Status"
        variant="outlined"
        choices={[
          { id: "1", name: "Active" },
          { id: "0", name: "InActive" },
        ]}
      />
      <ReferenceInput
        source="_zone_id"
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
    </Filter>
  );
};

export default SubAreaFilter;
