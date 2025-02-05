import { FC } from "react";
import { AutocompleteArrayInput, AutocompleteInput } from "react-admin";
import { useFormContext } from "react-hook-form";

type ZoneInputProps = {
  inputType?: "autocompleteInput" | "autocompleteArrayInput";
  [key: string]: any;
};

const ZoneInput: FC<ZoneInputProps> = ({ inputType, ...rest }) => {
  const { setValue } = useFormContext();

  if (inputType === "autocompleteArrayInput") {
    return (
      <AutocompleteArrayInput
        source="sb_zone_id"
        label="Zone"
        helperText={false}
        onChange={() => setValue("shipmentId", undefined)}
        {...rest}
      />
    );
  }

  return (
    <AutocompleteInput
      source="sb_zone_id"
      label="Zone"
      helperText={false}
      onChange={() => setValue("shipmentId", undefined)}
      {...rest}
    />
  );
};

export default ZoneInput;
