import { AutocompleteInput, ReferenceInput } from "react-admin";

const UserLocationInput = (props) => (
  <ReferenceInput
    {...props}
    label="Location"
    variant="outlined"
    reference="v1/userLocations"
    filter={{
      _orderBy: "l_area",
      u_id: props.record?.u_id,
    }}
  >
    <AutocompleteInput
      matchSuggestion={() => true}
      optionValue="ul_id"
      helperText={false}
      optionText="ul_location"
    />
  </ReferenceInput>
);

export default UserLocationInput;
