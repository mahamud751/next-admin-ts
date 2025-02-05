import { FC } from "react";
import { AutocompleteInput, useRecordContext } from "react-admin";
import { useWatch } from "react-hook-form";

type AreaDistrictInputProps = {
  locations: any;
  setLocations: (locations) => void;
  [key: string]: any;
  onChange?: (value: string) => void;
};

const AreaLocationInputProps: FC<AreaDistrictInputProps> = ({
  locations,
  onChange,
  setLocations,
  ...rest
}) => {
  const record = useRecordContext();
  const values = useWatch();

  const toChoices = (items = []) =>
    items?.map((item) => ({ id: item, name: item }));

  if (!locations) return null;

  return (
    <>
      <AutocompleteInput
        shouldRenderSuggestions={(value) =>
          !value.trim().length || record?.s_address?.area !== value.trim()
        }
        choices={
          !!values &&
          !!values.l_division &&
          !!values.l_district &&
          !!locations[values.l_division] &&
          !!locations[values.l_division][values.l_district]
            ? toChoices(
                Object.keys(locations[values.l_division][values.l_district])
              )
            : []
        }
        {...rest}
        onChange={onChange}
      />
    </>
  );
};

export default AreaLocationInputProps;
