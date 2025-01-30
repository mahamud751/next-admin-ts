import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  TextInput,
} from "react-admin";
import { getProductTextRenderer } from "@/utils/helpers";

const ProductUnitFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <ReferenceInput
      source="_product_id"
      label="Product"
      variant="outlined"
      helperText={false}
      reference="v1/product"
      sort={{ field: "pu_multiplier", order: "ASC" }}
      fullWidth
      alwaysOn
    >
      <AutocompleteInput
        optionValue="p_id"
        optionText={getProductTextRenderer}
        matchSuggestion={() => true}
        // resettable
      />
    </ReferenceInput>
  </Filter>
);

export default ProductUnitFilter;
