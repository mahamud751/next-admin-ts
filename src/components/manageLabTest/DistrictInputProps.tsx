import { FC } from "react";
import { SelectInput } from "react-admin";
import { useWatch } from "react-hook-form";

type DistrictInputProps = {
  locations: any;
  setLocations: (locations) => void;
  [key: string]: any;
};

const DistrictInput: FC<DistrictInputProps> = ({
  locations,
  setLocations,
  ...rest
}) => {
  const values = useWatch();
  const toChoices = (items = []) =>
    items?.map((item) => ({ id: item, name: item }));
  if (!locations) return null;
  return (
    <SelectInput
      choices={
        !!values.userLocation && !!values.userLocation.division
          ? toChoices(Object.keys(locations[values.userLocation.division]))
          : []
      }
      {...rest}
    />
  );
};

export default DistrictInput;
