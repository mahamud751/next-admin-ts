import { FC } from "react";
import { SelectInput } from "react-admin";
import { useWatch } from "react-hook-form";

type DistrictInputProps = {
  locations: any;
  actionType?: any;
  setLocations: (locations) => void;
  [key: string]: any;
};

const DistrictInput: FC<DistrictInputProps> = ({
  locations,
  actionType = "edit",
  setLocations,
  ...rest
}) => {
  const values = useWatch();

  if (!locations) return null;

  const toChoices = (items = []) =>
    items?.map((item) => ({ id: item, name: item }));

  const division =
    actionType === "create"
      ? values?.l_division
      : values?.full_shipping_address?.l_division;

  return (
    <SelectInput
      choices={!!division ? toChoices(Object.keys(locations[division])) : []}
      {...rest}
    />
  );
};

export default DistrictInput;
