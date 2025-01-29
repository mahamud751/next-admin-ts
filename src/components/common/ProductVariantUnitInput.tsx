import { FC } from "react";
import { AutocompleteInput } from "react-admin";

import {
  getDefaultPurchaseUnit,
  getDefaultVariant,
  getReadableSKU,
  getSalesUnitByB2BUser,
  getSalesUnitByB2CUser,
} from "@/utils/helpers";

type ProductVariantUnitInputProps = {
  source: string;
  label: "Variant" | "Unit";
  data: any[];
  isB2BUser?: boolean;
  isB2CUser?: boolean;
  inputRef?: any;
  multiline?: boolean;
  disabled?: boolean;
  [key: string]: any;
};

const ProductVariantUnitInput: FC<ProductVariantUnitInputProps> = ({
  source,
  label,
  data = [],
  isB2BUser,
  isB2CUser,
  inputRef,
  multiline = true,
  disabled = false,
  ...rest
}) => {
  const isVariant = label.toLowerCase()?.includes("variant");

  let initialData;
  let formattedData = isVariant
    ? data?.filter((item) => item?.pv_deleted_at === "0000-00-00 00:00:00")
    : data;

  if (isVariant) {
    initialData =
      formattedData?.length === 1
        ? formattedData?.[0]
        : getDefaultVariant(formattedData);
  } else if (isB2BUser) {
    initialData = getSalesUnitByB2BUser(formattedData);
  } else if (isB2CUser) {
    initialData = getSalesUnitByB2CUser(formattedData);
  } else {
    initialData = getDefaultPurchaseUnit(formattedData);
  }

  return (
    <AutocompleteInput
      source={source}
      label={label}
      variant="outlined"
      helperText={false}
      initialValue={initialData?.[isVariant ? "pv_id" : "pu_id"]}
      choices={formattedData}
      optionValue={isVariant ? "pv_id" : "pu_id"}
      optionText={(item) => {
        if (isVariant) {
          const readableSKU = getReadableSKU(item?.pv_attribute);
          return item?.pv_stock_qty
            ? `${readableSKU} (Stock: ${item?.pv_stock_qty})`
            : readableSKU;
        }
        return item?.pu_label;
      }}
      options={{
        InputProps: {
          inputRef,
        },
      }}
      disabled={
        disabled || !formattedData?.length || formattedData?.length === 1
      }
      fullWidth
      resettable
      {...rest}
    />
  );
};

export default ProductVariantUnitInput;
