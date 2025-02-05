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
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const StockExpand = () => {
  const classes = useAroggaStyles();

  return (
    <ReferenceManyField
      reference="v1/stockDetail"
      target="_stock_id"
      pagination={<Pagination />}
      sort={{ field: "sd_id", order: "DESC" }}
    >
      <Datagrid>
        <TextField source="sd_id" label="Details ID" />
        <ReferenceField
          source="sd_product_variant_id"
          label="Variant"
          reference="v1/productVariant"
          link={false}
          sortable={false}
        >
          <FunctionField
            render={(record: Record) => getReadableSKU(record.pv_attribute)}
          />
        </ReferenceField>
        <TextField source="sd_product_variant_id" label="Variant ID" />
        <TextField source="sd_batch_no" label="Batch" />
        <AroggaDateField source="sd_expiry_date" label="Expiry" />
        <FunctionField
          source="sd_qty"
          label="Qty"
          sortBy="sd_qty"
          className={classes.whitespaceNowrap}
          render={({
            sd_qty: qty,
            product_base_unit: baseUnit,
            sd_multiplier: salesUnitMultiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit: baseUnit,
              baseUnit,
              salesUnitMultiplier,
            })
          }
        />
        <FunctionField
          source="sd_qty_reserved"
          label="Reserved Qty"
          sortBy="sd_qty_reserved"
          className={classes.whitespaceNowrap}
          render={({
            sd_qty_reserved: qty,
            product_base_unit: baseUnit,
            sd_multiplier: salesUnitMultiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit: baseUnit,
              baseUnit,
              salesUnitMultiplier,
            })
          }
        />
        <FunctionField
          source="sd_qty_damage"
          label="Qty Damage"
          sortBy="sd_qty_damage"
          className={classes.whitespaceNowrap}
          render={({
            sd_qty_damage: qty,
            product_base_unit: baseUnit,
            sd_multiplier: salesUnitMultiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit: baseUnit,
              baseUnit,
              salesUnitMultiplier,
            })
          }
        />
        <FunctionField
          source="sd_qty_lost"
          label="Qty Lost"
          sortBy="sd_qty_lost"
          className={classes.whitespaceNowrap}
          render={({
            sd_qty_lost: qty,
            product_base_unit: baseUnit,
            sd_multiplier: salesUnitMultiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit: baseUnit,
              baseUnit,
              salesUnitMultiplier,
            })
          }
        />
        <FunctionField
          source="sd_qty_found"
          label="Qty Extra Found"
          sortBy="sd_qty_found"
          className={classes.whitespaceNowrap}
          render={({
            sd_qty_found: qty,
            product_base_unit: baseUnit,
            sd_multiplier: salesUnitMultiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit: baseUnit,
              baseUnit,
              salesUnitMultiplier,
            })
          }
        />
        <FunctionField
          source="sd_qty_correction"
          label="Qty Correction"
          sortBy="sd_qty_correction"
          className={classes.whitespaceNowrap}
          render={({
            sd_qty_correction: qty,
            product_base_unit: baseUnit,
            sd_multiplier: salesUnitMultiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit: baseUnit,
              baseUnit,
              salesUnitMultiplier,
            })
          }
        />
        <TextField source="sd_multiplier" label="Multiplier" />
        <NumberField source="sd_purchase_price" label="Purchase Price" />
        <NumberField source="sd_mrp" label="MRP" />
        <TextField source="sd_rack_no" label="Rack No" />
      </Datagrid>
    </ReferenceManyField>
  );
};

export default StockExpand;
