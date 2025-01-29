import { NotificationType } from "react-admin";

import { aroggaLocalforage } from "@/services";
import { logger } from "@/utils/helpers";

type PurchaseOnSaveProps = {
  notify: (
    message: string,
    type?: NotificationType | (NotificationOptions & { type: NotificationType })
  ) => void;
  redirect: (action: string, url: string) => void;
  mutate: (data: any, options?: any) => void | Promise<any>;
  values: any;
};

export const purchaseOnSave = async ({
  notify,
  redirect,
  mutate,
  values,
}: PurchaseOnSaveProps) => {
  if (!values?.pp_vendor_type)
    return notify("Purchase type must be required!", {
      type: "warning",
    });
  if (
    !values.pp_id &&
    values.pp_vendor_type === "company" &&
    !values?.pp_purchase_order_id
  )
    return notify("Purchase order must be required!", {
      type: "warning",
    });
  if (!values.pp_vendor_id)
    return notify("Vendor must be required!", {
      type: "warning",
    });
  if (values.pp_vat_required && !values.pp_total_vat)
    return notify("Total Vat must be required!", {
      type: "warning",
    });
  if (values.pp_tds_required && !values.pp_tds)
    return notify("TDS must be required!", {
      type: "warning",
    });
  if (values.pp_tds < 0)
    return notify("TDS can't be negative!", {
      type: "warning",
    });
  if (!values.pp_payment_method)
    return notify("Payment Method must be required!", {
      type: "warning",
    });

  let hasAllQty = true;
  let hasAllPurchasePrice = true;
  let hasAllExpiry = true;
  let hasAllBatch = true;

  let notifyMessage = "";

  for (const item of values?.ppi || []) {
    if (hasAllQty && !item?.ppi_qty) {
      hasAllQty = false;
      notifyMessage = "All Qty must be required!";
      break;
    }
    if (hasAllPurchasePrice && !item?.ppi_purchase_price) {
      hasAllPurchasePrice = false;
      notifyMessage = "All TP Price must be required!";
      break;
    }
    if (hasAllBatch && !item?.ppi_batch) {
      hasAllBatch = false;
      notifyMessage = "All Batch must be required!";
      break;
    }
    if (hasAllExpiry && !item?.ppi_expiry) {
      hasAllExpiry = false;
      notifyMessage = "All Expiry must be required!";
      break;
    }
  }

  if (notifyMessage)
    return notify(notifyMessage, {
      type: "warning",
    });

  try {
    const { message } = await mutate(
      {
        type: values.id ? "update" : "create",
        resource: "v1/productPurchase",
        payload: {
          ...(values.id ? { id: values.id } : {}),
          data: {
            pp_warehouse_id: 1,
            pp_vendor_type: values.pp_vendor_type,
            ...(values?.pp_purchase_order_id && {
              pp_purchase_order_id: values?.pp_purchase_order_id,
            }),
            pp_product_company_id: values.pp_product_company_id,
            pp_vendor_id: values.pp_vendor_id,
            pp_inv_price: values.pp_inv_price,
            ppi_vat: values.ppi_vat,
            pp_total_vat: values.pp_total_vat,
            pp_total_discount: values.pp_total_discount,
            pp_tds: values.pp_tds,
            pp_vat_required: values.pp_vat_required,
            pp_tds_required: values.pp_tds_required,
            pp_round: values.pp_round,
            pp_payment_method: values.pp_payment_method,
            pp_payment_term: values.pp_payment_term,
            pp_note: values.pp_note,
            pp_total_purchase_price: values.pp_total_purchase_price,
            attachedFiles_pp_files: values.attachedFiles_pp_files,
            pp_item_count: values.ppi?.length,
            ppi: JSON.stringify(
              values.ppi?.map((item) => ({
                ...(item?.ppi_id && {
                  id: item?.ppi_id,
                  ppi_id: item?.ppi_id,
                }),
                ppi_product_id: item.ppi_product_id,
                ppi_product_variant_id: item.ppi_product_variant_id,
                ppi_unit_id: item.ppi_unit_id,
                ppi_qty: item.ppi_qty,
                ppi_purchase_price: item.ppi_purchase_price,
                ppi_vat: item.ppi_vat,
                ppi_multiplier: item.ppi_multiplier,
                ppi_batch: item.ppi_batch,
                ppi_expiry: item.ppi_expiry,
                ppi_price_with_vat: item.ppi_price_with_vat,
                ppi_discount: item.ppi_discount,
                ppi_is_fixed_discount: item.ppi_is_fixed_discount,
                ppi_mrp: item.ppi_mrp,
              }))
            ),
          },
        },
      },
      { returnPromise: true }
    );

    !values.id && aroggaLocalforage.removeItem("purchase_products");
    !values.id && aroggaLocalforage.removeItem("purchase_product_items");

    notify(message, {
      type: "success",
    });
    redirect("list", "/v1/productPurchase");
  } catch (err: any) {
    logger(err);
    notify(err?.message || "Something went wrong, Please try again!", {
      type: "error",
    });
  }
};
