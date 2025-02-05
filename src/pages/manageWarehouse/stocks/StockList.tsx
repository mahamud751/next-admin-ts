import AcUnitIcon from "@mui/icons-material/AcUnit";
import { FC } from "react";
import {
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import {
  getQuantityLabel,
  getReadableSKU,
  toFixedNumber,
} from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import StockExpand from "./StockExpand";
import StockFilter from "./StockFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const StockList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Stock List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();

  const getPriceWithPercentage = (mrp, price) => {
    const percentage = toFixedNumber(((mrp - price) / mrp) * 100);

    return price && percentage ? (
      <span
        className={classes.whitespaceNowrap}
      >{`${price} (${percentage}%)`}</span>
    ) : (
      price
    );
  };

  return (
    <List
      {...rest}
      title="List of Stock"
      filters={<StockFilter children={""} />}
      perPage={25}
      sort={{ field: "s_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        expand={permissions?.includes("stockView") ? <StockExpand /> : null}
        classes={{ expandedPanel: classes.expandedPanel }}
        hideableColumns={[
          "s_created_at",
          "s_created_by",
          "s_modified_at",
          "s_modified_by",
        ]}
        bulkActionButtons={false}
      >
        <TextField source="s_id" label="Stock ID" />
        <ReferenceField
          source="s_product_id"
          label="Product"
          reference="v1/product"
          link="show"
        >
          <TextField source="p_name" />
        </ReferenceField>
        <TextField source="s_product_id" label="Product ID" />
        <ReferenceField
          source="s_product_variant_id"
          label="Variant"
          reference="v1/productVariant"
          link={false}
        >
          <FunctionField
            render={(record: Record) => getReadableSKU(record.pv_attribute)}
          />
        </ReferenceField>
        <TextField source="s_product_variant_id" label="Variant ID" />
        <ReferenceField
          source="s_product_id"
          label="Form"
          reference="v1/product"
          link={false}
        >
          <TextField source="p_form" />
        </ReferenceField>
        <ReferenceField
          source="s_product_id"
          label="Strength"
          reference="v1/product"
          link={false}
        >
          <TextField source="p_strength" />
        </ReferenceField>
        <ReferenceField
          source="s_product_id"
          label="Cold"
          reference="v1/product"
          link={false}
        >
          <FunctionField
            render={(record: Record) => {
              if (!record?.p_cold) return;
              return <AcUnitIcon />;
            }}
          />
        </ReferenceField>
        <FunctionField
          source="s_total_qty"
          label="Total Qty"
          sortBy="s_total_qty"
          className={classes.whitespaceNowrap}
          render={({
            s_total_qty: qty,
            product_base_unit: baseUnit,
            product_base_multiplier: salesUnitMultiplier,
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
          source="s_total_qty_reserved"
          label="Total Reserved Qty"
          sortBy="s_total_qty_reserved"
          className={classes.whitespaceNowrap}
          render={({
            s_total_qty_reserved: qty,
            product_base_unit: baseUnit,
            product_base_multiplier: salesUnitMultiplier,
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
          source="s_weekly_requirement"
          label="Weekly Req"
          sortBy="s_weekly_requirement"
          className={classes.whitespaceNowrap}
          render={({
            s_weekly_requirement: qty,
            product_base_unit: baseUnit,
            product_base_multiplier: salesUnitMultiplier,
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
          source="s_weekly_requirement"
          label="Daily Req"
          sortBy="s_weekly_requirement"
          className={classes.whitespaceNowrap}
          render={({
            s_weekly_requirement = 0,
            product_base_unit: baseUnit,
            product_base_multiplier: salesUnitMultiplier,
          }: Record) =>
            getQuantityLabel({
              qty: Math.ceil(s_weekly_requirement / 7),
              salesUnit: baseUnit,
              baseUnit,
              salesUnitMultiplier,
            })
          }
        />
        <ReferenceField
          source="s_product_variant_id"
          label="MRP"
          reference="v1/productVariant"
          link={false}
        >
          <TextField source="pv_mrp" />
        </ReferenceField>
        <ReferenceField
          source="s_product_variant_id"
          label="B2C Price"
          reference="v1/productVariant"
          link={false}
        >
          <FunctionField
            render={({ pv_mrp, pv_b2c_discounted_price }: Record) =>
              getPriceWithPercentage(pv_mrp, pv_b2c_discounted_price)
            }
          />
        </ReferenceField>
        <ReferenceField
          source="s_product_variant_id"
          label="B2B Price"
          reference="v1/productVariant"
          link={false}
        >
          <FunctionField
            render={({ pv_mrp, pv_b2b_discounted_price }: Record) =>
              getPriceWithPercentage(pv_mrp, pv_b2b_discounted_price)
            }
          />
        </ReferenceField>
        <AroggaDateField source="s_created_at" label="Created At" />
        <ReferenceField
          source="s_created_by"
          label="Created By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <AroggaDateField source="s_modified_at" label="Modified At" />
        <ReferenceField
          source="s_modified_by"
          label="Modified By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default StockList;
