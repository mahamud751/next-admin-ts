import {
  Datagrid,
  FunctionField,
  NumberField,
  Pagination,
  RaRecord as Record,
  ReferenceField,
  ReferenceManyField,
  TextField,
} from "react-admin";

import { getQuantityLabel, getReadableSKU } from "@/utils/helpers";

const CartExpand = () => (
  <ReferenceManyField
    reference="v1/userCartDetail"
    target="_cart_id"
    pagination={<Pagination />}
  >
    <Datagrid>
      <TextField source="ucd_id" label="ID" />
      <ReferenceField
        source="ucd_product_id"
        label="Product"
        reference="v1/product"
      >
        <TextField source="p_name" />
      </ReferenceField>
      <ReferenceField
        source="ucd_variant_id"
        label="Variant"
        reference="v1/productVariant"
        link={false}
        sortable={false}
      >
        <FunctionField
          render={(record: Record) => getReadableSKU(record.pv_attribute)}
        />
      </ReferenceField>
      <ReferenceField
        source="ucd_product_id"
        label="From"
        reference="v1/product"
        link={false}
      >
        <TextField source="p_form" />
      </ReferenceField>
      <ReferenceField
        source="ucd_product_id"
        label="Strength"
        reference="v1/product"
        link={false}
      >
        <TextField source="p_strength" />
      </ReferenceField>
      <FunctionField
        source="ucd_qty"
        label="Qty"
        sortBy="ucd_qty"
        render={({ ucd_qty: qty, product_base_unit: baseUnit }: Record) => (
          <ReferenceField
            source="ucd_unit_id"
            reference="v1/productUnit"
            link={false}
          >
            <FunctionField
              render={({
                pu_label: salesUnit,
                pu_multiplier: salesUnitMultiplier,
              }: Record) =>
                getQuantityLabel({
                  qty,
                  salesUnit,
                  baseUnit,
                  salesUnitMultiplier,
                })
              }
            />
          </ReferenceField>
        )}
      />
      <NumberField source="ucd_total_price" label="Total Price" />
    </Datagrid>
  </ReferenceManyField>
);

export default CartExpand;
