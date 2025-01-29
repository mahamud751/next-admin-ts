import { useEffect, useState } from "react";
import { AutocompleteInput, Filter, SelectInput, TextInput } from "react-admin";

import { Status } from "@/utils/enums";
import { isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";

const LabLocationFilter = ({ ...props }) => {
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    const locationsFromStroage = sessionStorage.getItem("labLocations");

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
            sessionStorage.setItem("labLocations", JSON.stringify(json.data));
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
        allowEmpty
        resettable
        alwaysOn
      />
      <SelectInput
        source="_district"
        label="District"
        variant="outlined"
        choices={
          !!props?.filterValues?._division
            ? toChoices(
                locations
                  ? Object.keys(locations[props?.filterValues?._division])
                  : []
              )
            : []
        }
        allowEmpty
        resettable
        alwaysOn
      />
      <AutocompleteInput
        source="_area"
        label="Area"
        variant="outlined"
        shouldRenderSuggestions={(value) =>
          !value.trim().length || locations?.area !== value.trim()
        }
        choices={
          !!props?.filterValues?._division &&
          !!props?.filterValues?._district &&
          locations &&
          locations[props?.filterValues?._division] &&
          locations[props?.filterValues?._division][
            props?.filterValues?._district
          ]
            ? toChoices(
                Object.keys(
                  locations[props?.filterValues?._division][
                    props?.filterValues?._district
                  ]
                )
              )
            : []
        }
        allowEmpty
        resettable
        alwaysOn
      />

      <TextInput
        source="_zone"
        label="Zone"
        variant="outlined"
        resettable
        alwaysOn
      />
    </Filter>
  );
};

export default LabLocationFilter;
