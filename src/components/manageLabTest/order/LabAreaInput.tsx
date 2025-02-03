import { FC } from "react";
import { AutocompleteInput, useRecordContext } from "react-admin";
import { useWatch } from "react-hook-form";

type AreaInputProps = {
  locations: any;
  setLocations: (locations) => void;
  [key: string]: any;
};

const LabAreaInput: FC<AreaInputProps> = ({
  locations,
  setLocations,
  ...rest
}) => {
  const values = useWatch();
  const record = useRecordContext();

  const toChoices = (items) => items?.map((item) => ({ id: item, name: item }));

  if (!locations) return null;

  return (
    <AutocompleteInput
      shouldRenderSuggestions={(value) =>
        !value.trim().length || record?.userLocation?.area !== value.trim()
      }
      choices={
        !!values.userLocation &&
        !!values.userLocation.division &&
        !!values.userLocation.district &&
        !!locations[values.userLocation.division] &&
        !!locations[values.userLocation.division][values.userLocation.district]
          ? toChoices(
              Object.keys(
                locations[values.userLocation.division][
                  values.userLocation.district
                ]
              )
            )
          : []
      }
      {...rest}
    />
  );
};

export default LabAreaInput;
