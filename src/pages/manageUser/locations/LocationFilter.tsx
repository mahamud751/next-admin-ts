import { useEffect, useState } from "react";
import { AutocompleteInput, Filter, SelectInput, TextInput } from "react-admin";

import { Status } from "@/utils/enums";
import { isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";

const LocationFilter = ({ ...props }) => {
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    const locationsFromStroage = sessionStorage.getItem("locations");

    if (locationsFromStroage) {
      setLocations(
        isJSONParsable(locationsFromStroage)
          ? JSON.parse(locationsFromStroage)
          : {}
      );
    } else {
      httpClient("/v1/allLocations/", { isBaseUrl: true })
        .then(({ json }: any) => {
          if (json.status === Status.SUCCESS) {
            setLocations(json.data);
            sessionStorage.setItem("locations", JSON.stringify(json.data));
          }
        })
        .catch((err) => logger(err));
    }
  }, []);

  const toChoices = (items = []) =>
    items?.map((item) => ({ id: item, name: item }));

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
        source="_division"
        label="Division"
        variant="outlined"
        choices={!!locations ? toChoices(Object.keys(locations)) : []}
        // allowEmpty
        resettable
      />
      <SelectInput
        source="_district"
        label="District"
        variant="outlined"
        choices={
          !!props.filterValues._division
            ? toChoices(Object.keys(locations[props.filterValues._division]))
            : []
        }
        // allowEmpty
        resettable
      />
      <AutocompleteInput
        source="_area"
        label="Area"
        variant="outlined"
        shouldRenderSuggestions={(value) =>
          !value.trim().length || locations?.area !== value.trim()
        }
        choices={
          !!props.filterValues._division && !!props.filterValues._district
            ? toChoices(
                Object.keys(
                  locations[props.filterValues._division][
                    props.filterValues._district
                  ]
                )
              )
            : []
        }
        // allowEmpty
      />
      <TaxonomiesByVocabularyInput
        fetchKey="courier"
        source="_courier"
        label="Courier"
        alwaysOn
      />
      <TextInput
        source="_postcode"
        label="Postcode"
        variant="outlined"
        resettable
      />
      <TextInput source="_zone" label="Zone" variant="outlined" resettable />
      <TextInput
        source="_redx_area_id"
        label="Redx Area ID"
        variant="outlined"
        resettable
      />
      <TextInput
        source="_pathao_city_id"
        label="Pathao City ID"
        variant="outlined"
        resettable
      />
      <TextInput
        source="_pathao_zone_id"
        label="Pathao Zone ID"
        variant="outlined"
        resettable
      />
      <SelectInput
        source="_status"
        choices={[
          { id: "1", name: "Active" },
          { id: "0", name: "Inactive" },
        ]}
      />
    </Filter>
  );
};

export default LocationFilter;
