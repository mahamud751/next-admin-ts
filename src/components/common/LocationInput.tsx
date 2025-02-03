import { AutocompleteInput, RaRecord, ReferenceInput } from "react-admin";

const OptionTextRenderer = ({ record }: { record?: RaRecord }) => {
  if (!record.l_id) return;

  return (
    <span>
      {!!record
        ? `${record.l_division} -> ${record.l_district} -> ${record.l_area}`
        : ""}
    </span>
  );
};

const LocationInput = (props) => (
  <ReferenceInput
    label="Location"
    reference="v1/location"
    filter={{ _status: 1, _orderBy: "l_area" }}
    {...props}
  >
    <AutocompleteInput
      matchSuggestion={() => true}
      optionValue="l_id"
      optionText={<OptionTextRenderer />}
      inputText={(record: {
        l_division: string;
        l_district: string;
        l_area: string;
      }) =>
        !!record
          ? `${record.l_division} -> ${record.l_district} -> ${record.l_area}`
          : ""
      }
      //   options={{
      //     InputProps: { multiline: true },
      //   }}
    />
  </ReferenceInput>
);

export default LocationInput;
