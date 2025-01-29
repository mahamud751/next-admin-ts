import { FC, useEffect, useState } from "react";
import { AutocompleteInput, RaRecord } from "react-admin";

const OptionTextRenderer = ({ record }: { record?: RaRecord }) => (
  <span style={{ color: !record?.ul_id ? "#EF1962" : "" }}>
    {!!record?.ul_id &&
      `${record.ul_location} (${record.ul_name}, ${record.ul_mobile})`}
  </span>
);

type UserLocationAutocompleteInputProps = {
  setHasLocationField?: (hasLocationField: boolean) => void;
  [key: string]: any;
};

const UserLocationAutocompleteInput: FC<UserLocationAutocompleteInputProps> = ({
  setHasLocationField,
  ...rest
}) => {
  const [userLocationId, setUserLocationId] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest?.choices?.[0]?.ul_id]);

  return (
    <AutocompleteInput
      {...rest}
      initialValue={userLocationId}
      optionText={<OptionTextRenderer />}
      inputText={(record) =>
        !!record &&
        record.ul_id &&
        `${record.ul_location} (${record.ul_name}, ${record.ul_mobile})`
      }
      options={{
        InputProps: { multiline: true },
      }}
    />
  );
};

export default UserLocationAutocompleteInput;
