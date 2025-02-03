import { FC, useEffect, useState } from "react";
import { AutocompleteInput, RaRecord } from "react-admin";

const OptionTextRenderer = ({ record }: { record?: RaRecord }) => (
  <span style={{ color: !record?.ul_id ? "#EF1962" : "" }}>
    {!!record?.ul_id
      ? `${record.ul_location} (${record.ul_name}, ${record.ul_mobile})`
      : "Add New Location"}
  </span>
);

type UserLocationAutocompleteInputProps = {
  setHasLocationField?: (hasLocationField: boolean) => void;
  [key: string]: any;
};
const LabUserLocationAutocompleteInput: FC<
  UserLocationAutocompleteInputProps
> = ({
  setHasLocationField,
  setMainData,
  formValues,
  setLocationId,
  ...rest
}) => {
  const [userLocationId, setUserLocationId] = useState(
    formValues?.userLocation?.id
  );

  useEffect(() => {
    if (!setHasLocationField) return;
    if (rest?.choices?.length) {
      setHasLocationField(true);
    } else {
      setHasLocationField(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest?.choices?.length]);

  useEffect(() => {
    setUserLocationId(rest?.choices?.[0]?.ul_id);
    if (setMainData) {
      setMainData(
        rest?.choices?.find((choice) => choice?.ul_id === userLocationId)
      );
      setLocationId(userLocationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest?.choices?.[0]?.ul_id]);

  const handleSelect = (record) => {
    setUserLocationId(record?.ul_id || "");
    if (setMainData) {
      setMainData(record);
      setLocationId(userLocationId);
    }
  };
  return (
    <AutocompleteInput
      {...rest}
      defaultValue={parseInt(formValues?.userLocation?.id)}
      optionText={<OptionTextRenderer />}
      inputText={(record) =>
        !!record && record.ul_id
          ? `${record.ul_location} (${record.ul_name}, ${record.ul_mobile})`
          : "Add New Location"
      }
      //   options={{
      //     InputProps: { multiline: true },
      //   }}
      onSelect={handleSelect}
    />
  );
};

export default LabUserLocationAutocompleteInput;
