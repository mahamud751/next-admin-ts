import { FC } from "react";
import { FunctionField, Labeled, RaRecord } from "react-admin";

import { getFormattedDateString } from "@/utils/helpers";

type AroggaDateFieldProps = {
  source: string;
  label?: string;
  basePath?: string;
  addLabel?: boolean;
  [key: string]: any;
};

const AroggaDateField: FC<AroggaDateFieldProps> = ({
  source,
  label = source,
  basePath,
  addLabel = true,
}) => {
  const Field = () => (
    <FunctionField
      render={(record: RaRecord) => {
        if (
          ["0000-00-00 00:00:00", "0000-00-00", "00:00:00"].includes(
            record?.[source]
          )
        )
          return;

        return getFormattedDateString(record[source]);
      }}
    />
  );

  if (basePath || !addLabel) return <Field />;

  return (
    <Labeled label={label}>
      <Field />
    </Labeled>
  );
};

export default AroggaDateField;
