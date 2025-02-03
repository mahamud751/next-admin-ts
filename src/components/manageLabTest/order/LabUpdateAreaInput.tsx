import { FC } from "react";
import { AutocompleteInput, useRecordContext } from "react-admin";
import { useFormState } from "react-final-form";

type AreaInputProps = {
  locations: any;
  actionType?: any;
  setLocations: (locations) => void;
  [key: string]: any;
};

const LabUpdateAreaInput: FC<AreaInputProps> = ({
  locations,
  actionType = "edit",
  setLocations,
  ...rest
}) => {
  const { values } = useFormState();
  const record = useRecordContext();

  if (!locations) return null;

  const toChoices = (items) => items?.map((item) => ({ id: item, name: item }));

  const division =
    actionType === "create"
      ? values?.l_division
      : values?.full_shipping_address?.l_division;
  const district =
    actionType === "create"
      ? values?.l_district
      : values?.full_shipping_address?.l_district;

  return (
    <AutocompleteInput
      shouldRenderSuggestions={(value) =>
        !value.trim().length ||
        record?.full_shipping_address?.area !== value.trim()
      }
      choices={
        !!division &&
        !!district &&
        !!locations[division] &&
        !!locations[division][district]
          ? toChoices(Object.keys(locations[division][district]))
          : []
      }
      // resettable
      {...rest}
    />
  );
};

export default LabUpdateAreaInput;
