import { Button } from "@mui/material";
import { FC, useCallback } from "react";
import { SaveButton, Toolbar } from "react-admin";
import { useForm, useWatch } from "react-hook-form";

type PurchaseToolbarProps = {
  setTpPrice?: (tpPrice: number) => void;
  productPurchaseItems?: object[];
  setProductPurchaseItems?: (productPurchaseItems) => void;
  [key: string]: any;
};

const PurchaseToolbar: FC<PurchaseToolbarProps> = ({
  setTpPrice,
  setSelectedProductVariantSalesVat,
  productPurchaseItems,
  setProductPurchaseItems,
  ...rest
}) => {
  const form = useForm();
  const values = useWatch();

  let hasB2CMrpProfitPercentNegative = false;

  if (values.pp_vendor_type === "company" && values.pp_purchase_order_id) {
    hasB2CMrpProfitPercentNegative = productPurchaseItems?.some(
      // @ts-ignore
      (item) => item?.mrpPercent < 0 || item?.profitPercent < 0
    );
  }

  const handleClear = useCallback(() => {
    [
      "pp_vendor_type",
      "pp_purchase_order_id",
      "pp_product_company_id",
      "pp_vendor_id",
      "pp_total_purchase_price",
      "pp_total_vat",
      "pp_total_discount",
      "pp_tds",
      "pp_tds_required",
      "pp_vat_required",
      "pp_round",
      // "pp_payment_method",
      "pp_payment_term",
      "pp_note",
      "ppi_product_id",
      "ppi_product_variant_id",
      "ppi_qty",
      "ppi_unit_id",
      "selectedProductDefaultPurchaseUnit",
      "ppi_batch",
    ].forEach((key) =>
      form.change(
        key,
        ["pp_vat_required", "pp_tds_required"].includes(key) ? 1 : undefined
      )
    );
    setTpPrice(0);
    setSelectedProductVariantSalesVat(0);
    setProductPurchaseItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <Toolbar {...rest}>
      {!values.id && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClear}
          style={{ marginRight: 5 }}
        >
          Clear
        </Button>
      )}
      <SaveButton
        disabled={
          (!values.id && !productPurchaseItems?.length) ||
          !!values.isAmountMismatched ||
          hasB2CMrpProfitPercentNegative
        }
      />
    </Toolbar>
  );
};

export default PurchaseToolbar;
