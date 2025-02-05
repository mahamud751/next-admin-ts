import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  NumberInput,
  ReferenceInput,
} from "react-admin";

import { getProductTextRenderer } from "@/utils/helpers";

const StockFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <NumberInput
      source="_search"
      label="Search By Stock ID"
      variant="outlined"
      alwaysOn
    />
    <ReferenceInput
      source="_brand_id"
      label="Brand"
      variant="outlined"
      reference="v1/productBrand"
      alwaysOn
    >
      <AutocompleteInput
        optionText="pb_name"
        // options={{
        //     InputProps: {
        //         multiline: true,
        //     },
        // }}
      />
    </ReferenceInput>
    <ReferenceInput
      source="_product_id"
      label="Product"
      variant="outlined"
      reference="v1/product"
      sort={{ field: "p_name", order: "ASC" }}
      alwaysOn
    >
      <AutocompleteInput
        optionText={getProductTextRenderer}
        // options={{
        //   InputProps: {
        //     multiline: true,
        //   },
        // }}
        matchSuggestion={() => true}
      />
    </ReferenceInput>
    <ReferenceInput
      source="_vendor_local"
      label="Local Vendor"
      variant="outlined"
      reference="v1/vendor"
      filter={{
        _status: "active",
        _type: "local",
      }}
      filterToQuery={(searchText) => ({
        _name: searchText,
      })}
    >
      <AutocompleteInput
        optionText="v_name"
        // options={{
        //   InputProps: {
        //     multiline: true,
        //   },
        // }}
      />
    </ReferenceInput>
    <ReferenceInput
      source="_vendor_official"
      label="Official Vendor"
      variant="outlined"
      reference="v1/vendor"
      filter={{
        _status: "active",
        _type: "company",
      }}
      filterToQuery={(searchText) => ({
        _name: searchText,
      })}
    >
      <AutocompleteInput
        optionText="v_name"
        // options={{
        //   InputProps: {
        //     multiline: true,
        //   },
        // }}
      />
    </ReferenceInput>
    <ReferenceInput
      source="_warehouse_id"
      label="Warehouse"
      variant="outlined"
      reference="v1/warehouse"
    >
      <AutocompleteInput optionText="w_title" />
    </ReferenceInput>
  </Filter>
);

export default StockFilter;
