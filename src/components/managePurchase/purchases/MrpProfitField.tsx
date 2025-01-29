import { useWatch } from "react-hook-form";

import { isInfinity } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import {
  getDiscountBasedOnIsDiscountFixed,
  getMrpProfitPercent,
  getSumOfIndividualPpiDiscountForPpiIsFixedDiscount,
  getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount,
} from "./utils";

const MrpProfitField = ({
  tpPrice,
  selectedProductDefaultMultiplier,
  selectedVariant,
}) => {
  const classes = useAroggaStyles();
  const values = useWatch();

  const productPurchaseItemDiscount = getDiscountBasedOnIsDiscountFixed({
    purchasePrice: tpPrice,
    totalPurchasePrice: values.pp_total_purchase_price,
    getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount:
      getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount(values.ppi),
    totalDiscount:
      values.pp_total_discount -
      getSumOfIndividualPpiDiscountForPpiIsFixedDiscount(values.ppi),
    pp_round: values.pp_round || 0,
  });

  const commonConfig = {
    ppi_qty: values.ppi_qty * selectedProductDefaultMultiplier,
    ppi_purchase_price: tpPrice,
    ppi_vat: values.ppi_vat,
    ppi_discount: productPurchaseItemDiscount,
  };

  const b2cMrpPercent = getMrpProfitPercent({
    isMrpPercent: true,
    ppi_mrp: selectedVariant?.pv_mrp,
    ...commonConfig,
  });

  const b2bMrpPercent = getMrpProfitPercent({
    isMrpPercent: true,
    ppi_mrp:
      selectedVariant?.pv_b2b_mrp /
      selectedVariant?.pu_b2b_base_unit_multiplier,
    ...commonConfig,
  });

  const b2cProfitPercent = getMrpProfitPercent({
    isMrpPercent: false,
    discountPrice: selectedVariant?.pv_b2c_discounted_price,
    ...commonConfig,
  });

  const b2bProfitPercent = getMrpProfitPercent({
    isMrpPercent: false,
    discountPrice: selectedVariant?.pv_b2b_discounted_price,
    ...commonConfig,
  });

  const Field = ({ value, label }) => {
    if (isInfinity(value)) return;

    let className;

    if (label.toLowerCase().trim().includes("profit")) {
      if (value < 0) {
        className = classes.textRed;
      } else if (value > 50) {
        className = classes.textOrange;
      } else {
        className = classes.textGreen;
      }
    } else {
      className = value < 0 || value > 50 ? classes.textRed : classes.textGreen;
    }

    return (
      <div className={className}>
        {label}: {value}%
      </div>
    );
  };

  return (
    <>
      <Field value={b2cMrpPercent} label="MRP (B2C)" />
      <Field value={b2bMrpPercent} label="MRP (B2B)" />
      <Field value={b2cProfitPercent} label="Profit (B2C)" />
      <Field value={b2bProfitPercent} label="Profit (B2B)" />
    </>
  );
};

export default MrpProfitField;
