import { Box, Chip } from "@mui/material";
import { FC } from "react";
import { FunctionField, Labeled, RaRecord } from "react-admin";

import {
  capitalizeFirstLetterOfEachWord,
  isArrayOfTypeString,
  isEmpty,
} from "@/utils/helpers";

type CustomChipFieldProps = {
  source: string;
  label?: string;
  id?: string;
  value?: string;
  page?: "list" | "show";
};

const CustomChipField: FC<CustomChipFieldProps> = ({
  source,
  label = "Label",
  id,
  value,
  page = "show",
}) => {
  const CustomChip = ({ keyIndex, label }) => (
    <Chip
      key={keyIndex}
      label={capitalizeFirstLetterOfEachWord(label)}
      variant="outlined"
      color="primary"
      size="small"
    />
  );

  const Field = () => (
    <FunctionField
      render={(record: RaRecord) => {
        if (isEmpty(record?.[source])) return;

        if (isArrayOfTypeString(record?.[source]))
          return (
            <Box display="flex" flexWrap="wrap" gap={5}>
              {record?.[source]?.map((item, i) => (
                <CustomChip
                  keyIndex={i}
                  label={capitalizeFirstLetterOfEachWord(item)}
                />
              ))}
            </Box>
          );

        return record?.[source]?.map((item, i) => (
          <CustomChip
            keyIndex={item?.[id] || i}
            label={capitalizeFirstLetterOfEachWord(item?.[value])}
          />
        ));
      }}
    />
  );

  if (page === "show")
    return (
      <Labeled label={label}>
        <Field />
      </Labeled>
    );

  return <Field />;
};

export default CustomChipField;
