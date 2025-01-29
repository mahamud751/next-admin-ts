/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField as MuiTextField,
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";

import { FC, useEffect, useState } from "react";
import {
  AutocompleteInput,
  Confirm,
  FileField,
  FileInput,
  Labeled,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
  minValue,
  useNotify,
  usePermissions,
} from "react-admin";

import { useForm, useWatch } from "react-hook-form";

import {
  useClipboard,
  useEffectOnDependencyChange,
  useInputRef,
  useRequest,
} from "@/hooks";
import { aroggaLocalforage } from "@/services";
import { FILE_MAX_SIZE, monthsWithId } from "@/utils/constants";
import {
  capitalizeFirstLetter,
  getChunkData,
  getDefaultPurchaseUnit,
  getDefaultVariant,
  getProductTextRenderer,
  getQuantityLabel,
  getReadableSKU,
  groupAndNestBy,
  groupBy,
  isEmpty,
  logger,
  toFixedNumber,
} from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

import CreditPaidReceivableDialog from "./CreditPaidReceivableDialog";
import MrpProfitField from "./MrpProfitField";
import {
  getDiscountBasedOnIsDiscountFixed,
  getMrpProfitPercent,
  getSumOfIndividualPpiDiscountForPpiIsFixedDiscount,
  getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount,
  mutateShapedDiscount,
} from "./utils";
import CustomField from "@/components/common/CustomField";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import ProductVariantUnitInput from "@/components/common/ProductVariantUnitInput";

type PurchaseFormProps = {
  tpPrice: number;
  setTpPrice: (tpPrice: number) => void;
  selectedProductVariantSalesVat: number;
  setSelectedProductVariantSalesVat: (
    selectedProductVariantSalesVat: number
  ) => void;
  productPurchaseItems: any[];
  setProductPurchaseItems: (ppi) => void;
  [key: string]: any;
};

const PurchaseForm: FC<PurchaseFormProps> = ({
  tpPrice,
  setTpPrice,
  selectedProductVariantSalesVat,
  setSelectedProductVariantSalesVat,
  productPurchaseItems,
  setProductPurchaseItems,
  ...rest
}) => {
  const notify = useNotify();
  const clipboard = useClipboard();

  const form = useForm();

  const classes = useAroggaStyles();
  const values = useWatch();
  const { permissions } = usePermissions();

  const inputRefs = {
    purchaseType: useInputRef(),
    purchaseOrder: useInputRef(),
    company: useInputRef(),
    vendor: useInputRef(),
    totalTP: useInputRef(),
    totalVAT: useInputRef(),
    totalDiscount: useInputRef(),
    round: useInputRef(),
    paymentMethod: useInputRef(),
    paymentTerm: useInputRef(),
    note: useInputRef(),
    product: useInputRef(),
    variant: useInputRef(),
    qty: useInputRef(),
    unit: useInputRef(),
    tpPrice: useInputRef(),
    vat: useInputRef(),
    tds: useInputRef(),
    multiplier: useInputRef(),
    expMonth: useInputRef(),
    expYear: useInputRef(),
    batch: useInputRef(),
  };

  const [
    isCreditPaidReceivableDialogOpen,
    setIsCreditPaidReceivableDialogOpen,
  ] = useState(false);
  const [isProductReceivedDialogOpen, setIsProductReceivedDialogOpen] =
    useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [isCheckedUnitTpPrice, setIsCheckedUnitTpPrice] = useState(false);
  const [isCheckedUnitVat, setIsCheckedUnitVat] = useState(false);
  const [
    selectedPurchaseOrderGroupByProductId,
    setSelectedPurchaseOrderGroupByProductId,
  ] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [
    selectedProductDefaultMultiplier,
    setSelectedProductDefaultMultiplier,
  ] = useState(0);

  const { refetch: fetchProductByIDS } = useRequest(
    "",
    {},
    {
      onSuccess: ({ data }) => setProductPurchaseItemsByPurchaseOrder(data),
    }
  );

  const { isLoading, refetch } = useRequest(
    `/v1/productPurchaseAction/${values.pp_id}/receivableProductReceivedAction`,
    {
      method: "POST",
    },
    {
      onSuccess: () => setIsProductReceivedDialogOpen(false),
    }
  );

  const storeKeys = [
    "pp_vendor_type",
    "pp_purchase_order_id",
    // "pp_warehouse_id",
    "pp_product_company_id",
    "pp_total_purchase_price",
    "pp_total_vat",
    "pp_total_discount",
    "pp_tds",
    "pp_vat_required",
    "pp_tds_required",
    "pp_round",
    // "pp_payment_method",
    "pp_payment_term",
    "pp_note",
  ];

  useEffect(() => {
    if (values.id) return;

    aroggaLocalforage.getItem("purchase_products").then((value) =>
      storeKeys.forEach((key) => {
        form.setValue(
          key,
          ["pp_vat_required", "pp_tds_required"].includes(key)
            ? 1
            : value?.[key]
        );
      })
    );
    aroggaLocalforage
      .getItem("purchase_product_items")
      .then((value: any) =>
        setProductPurchaseItems(!!value?.length ? value : [])
      )
      .catch((err) => logger(err));
  }, []);

  useEffect(() => {
    if (values.id) return;

    const storePurchaseProducts = {};

    storeKeys.forEach((key) => (storePurchaseProducts[key] = values[key]));
    aroggaLocalforage.setItem("purchase_products", storePurchaseProducts);
  }, [values]);

  useEffect(() => {
    if (values.id) return;
    aroggaLocalforage.setItem(
      "purchase_product_items",
      !!productPurchaseItems?.length ? productPurchaseItems : []
    );
  }, [productPurchaseItems]);

  useEffect(() => {
    if (values.id && rest?.record?.ppi?.length) {
      const modifiedProductPurchaseItems = rest.record.ppi.map((item) => {
        const defaultPpiPurchasePrice =
          item?.ppi_purchase_price / item?.ppi_qty;
        const defaultB2CPpiMRP = item?.ppi_mrp / item?.ppi_qty;
        const defaultB2BPpiMRP = item?.ppi_b2b_mrp;
        const b2cDiscountPrice = item?.b2c_discounted_price;
        const b2bDiscountPrice = item?.b2b_discounted_price;

        return {
          ...item,
          defaultPpiPurchasePrice,
          defaultB2CPpiMRP,
          defaultB2BPpiMRP,
          b2cDiscountPrice,
          b2bDiscountPrice,
        };
      });
      setProductPurchaseItems(modifiedProductPurchaseItems);
    }
  }, [rest?.record?.ppi]);

  useEffect(() => {
    if (!productPurchaseItems?.length) return;
    const newProductPurchaseItems = [...productPurchaseItems];
    mutateShapedDiscount(newProductPurchaseItems, values);
    setProductPurchaseItems(newProductPurchaseItems);
  }, [productPurchaseItems?.length, values.pp_round, values.pp_total_discount]);

  useEffect(() => {
    if (!values.id) {
      form.setValue("pp_tds", getTDS());
    }
  }, [values.pp_total_purchase_price, values.pp_total_discount]);

  const getTDS = () => {
    const PERCENTAGE = 5;
    const baseValue =
      (values.pp_total_purchase_price || 0) - (values.pp_total_discount || 0);

    return toFixedNumber((baseValue * PERCENTAGE) / 100);
  };

  useEffectOnDependencyChange(() => {
    !values.pp_purchase_order_id && clearPurchaseOrder();
  }, [values.pp_purchase_order_id]);

  useEffectOnDependencyChange(() => {
    if (!values.ppi_product_id) {
      form.setValue("ppi_qty", undefined);
      form.setValue("ppi_batch", "");
      setSelectedProduct({});
      setTpPrice(0);
      setSelectedProductVariantSalesVat(0);
      setSelectedProductDefaultMultiplier(0);
    }
  }, [values.ppi_product_id]);

  const selectedVariant = selectedProduct?.pv?.find(
    (item) => item.pv_id === values?.ppi_product_variant_id
  );
  const baseUnit = selectedVariant?.pu_base_unit_label;
  const salesUnitMultiplier =
    values.selectedProductDefaultPurchaseUnit?.pu_multiplier;

  const handleOnKeyDown = (): void => {
    // TODO: Have to add in future
    // if (
    //     selectedVariant?.pv_b2c_price === 0 ||
    //     selectedVariant?.pv_b2c_mrp === 0
    // )
    //     return notify("Price error!", {
    //         type: "warning",
    //     });

    // if (selectedProductDefaultMultiplier <= 0)
    //     return notify("Multiplier should be start from 1!", {
    //         type: "warning",
    //     });

    const { p_name, p_form, p_strength } = selectedProduct;

    const {
      pp_total_purchase_price,
      pp_payment_method,
      ppi_product_id,
      ppi_product_variant_id,
      ppi_qty,
      ppi_unit_id,
      ppi_batch,
      expMonth,
      expYear,
    } = values;

    const readableSKU = getReadableSKU(selectedVariant?.pv_attribute);

    // TODO: Have to fix in future
    // if (!isEmpty(product))
    //     return notify(
    //         `Variant (${readableSKU}) already added!`,
    //         {
    //             type: "warning",
    //         },
    //         { type: "warning" }
    //     );

    if (!pp_total_purchase_price)
      return notify("Total TP is required field!", {
        type: "warning",
      });
    if (!pp_total_purchase_price)
      return notify("Total TP is required field!", {
        type: "warning",
      });
    if (!pp_payment_method)
      return notify("Payment method is required field!", {
        type: "warning",
      });
    if (!ppi_product_id)
      return notify("Product is required field!", { type: "warning" });
    if (!ppi_product_variant_id)
      return notify("Variant is required field!", { type: "warning" });
    if (!ppi_qty) return notify("Qty is required field!", { type: "warning" });
    if (!ppi_unit_id)
      return notify("Unit is required field!", { type: "warning" });
    if (!tpPrice)
      return notify("TP Price is required field!", { type: "warning" });
    if (!ppi_batch)
      return notify("Batch is required field!", { type: "warning" });
    if (!expMonth)
      return notify("Exp month is required field!", { type: "warning" });
    if (!expYear)
      return notify("Exp year is required field!", { type: "warning" });
    if (!(expYear >= 2000 && expYear <= 3000))
      return notify("Exp year must be between 2000 to 3000!", {
        type: "warning",
      });

    if (values.pp_vendor_type === "company") {
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

      const b2cMrpPercent = getMrpProfitPercent({
        isMrpPercent: true,
        ppi_qty: values.ppi_qty * selectedProductDefaultMultiplier,
        ppi_mrp: selectedVariant?.pv_mrp,
        ppi_purchase_price: tpPrice,
        ppi_vat: values.ppi_vat,
        ppi_discount: productPurchaseItemDiscount,
      });

      const b2cProfitPercent = getMrpProfitPercent({
        isMrpPercent: false,
        ppi_qty: values.ppi_qty * selectedProductDefaultMultiplier,
        discountPrice: selectedVariant?.pv_b2c_discounted_price,
        ppi_purchase_price: tpPrice,
        ppi_vat: values.ppi_vat,
        ppi_discount: productPurchaseItemDiscount,
      });

      if (+b2cMrpPercent < 0 || +b2cProfitPercent < 0)
        return notify("MRP / Profit Percentage is negative!", {
          type: "warning",
        });
    }

    const defaultB2CPpiMRP =
      selectedVariant?.pv_mrp * selectedProductDefaultMultiplier;

    const defaultB2BPpiMRP =
      (selectedVariant?.pv_b2b_mrp /
        selectedVariant?.pu_b2b_base_unit_multiplier) *
      selectedProductDefaultMultiplier;

    setProductPurchaseItems((prevState) => [
      {
        ppi_product_id,
        ppi_product_variant_id,
        p_name,
        productVariant: readableSKU,
        productUnit: values.selectedProductDefaultPurchaseUnit?.pu_label,
        p_form,
        p_strength,
        ppi_qty,
        ppi_unit_id,
        baseUnit,
        salesUnitMultiplier,
        tpPrice,
        ppi_purchase_price: +tpPrice || 0,
        defaultPpiPurchasePrice: tpPrice / ppi_qty,
        ppi_vat: isCheckedUnitVat
          ? ppi_qty * +selectedProductVariantSalesVat
          : +selectedProductVariantSalesVat,
        ppi_multiplier: selectedProductDefaultMultiplier,
        ppi_batch,
        ppi_expiry: !!expMonth && !!expYear ? `${expYear}-${expMonth}-01` : "",
        ppi_mrp: ppi_qty * defaultB2CPpiMRP,
        ppi_b2b_mrp: ppi_qty * defaultB2BPpiMRP,
        defaultB2CPpiMRP,
        defaultB2BPpiMRP,
        ppi_price_with_vat: +tpPrice + +selectedProductVariantSalesVat,
        ppi_discount: 0,
        b2cDiscountPrice: selectedVariant?.pv_b2c_discounted_price,
        b2bDiscountPrice: selectedVariant?.pv_b2b_discounted_price,
        isFixedDiscount: false,
        ppi_is_fixed_discount: 0,
        isDiscountChanged: false,
      },
      ...prevState,
    ]);

    values.selectedProductDefaultPurchaseUnit = undefined;
    setSelectedProduct({});

    values.ppi_product_id = undefined;
    values.ppi_product_variant_id = undefined;
    values.ppi_qty = undefined;
    values.ppi_unit_id = undefined;
    setTpPrice(0);
    setSelectedProductVariantSalesVat(0);
    setSelectedProductDefaultMultiplier(0);
    values.ppi_batch = "";
    // TODO: Have to remove in future
    // values.expMonth = undefined;
    // values.expYear = undefined;

    // Focus Product input
    setTimeout(() => {
      inputRefs.product.current?.focus();
    }, 0);
  };

  const handleOnSelectPurchaseOrder = (selectedData) => {
    form.setValue("pp_payment_term", selectedData?.po_payment_terms);
    form.setValue(
      "attachedFiles_pp_files",
      selectedData?.attachedFiles_po_attachment
    );

    const processChunks = async (ids) => {
      const chunks = getChunkData(ids);

      for (let chunk of chunks) {
        await fetchProductByIDS({
          endpoint: `/v1/product?_details=1&ids=${chunk?.join(",")}`,
        });
      }
    };

    selectedData?.poi?.length &&
      processChunks(selectedData?.poi?.map((item) => item?.poi_product_id));
  };

  const clearPurchaseOrder = () => {
    // form.setValue("pp_payment_method", undefined);
    form.setValue("pp_payment_term", undefined);
    form.setValue("attachedFiles_pp_files", []);
    setSelectedPurchaseOrderGroupByProductId(null);
    setProductPurchaseItems([]);
  };

  const setProductPurchaseItemsByPurchaseOrder = (data) => {
    const groupedProductByIDS = groupAndNestBy({
      data,
      nestKeys: ["pu", "pv"],
    });

    const productPurchaseItems = data?.map((singleData) => {
      const item =
        selectedPurchaseOrderGroupByProductId?.[singleData?.p_id]?.[0];

      const foundProduct = groupedProductByIDS?.[item?.poi_product_id]?.[0];
      // FIXME:
      const foundProductUnit = foundProduct?.pu?.[item?.poi_unit];
      const foundProductVariant =
        foundProduct?.pv?.[item?.poi_product_variant_id];

      const defaultPpiPurchasePrice =
        (item?.poi_purchase_price || 0) * foundProductUnit?.pu_multiplier;
      const tpPrice = defaultPpiPurchasePrice * item?.poi_quantity || 0;
      const defaultB2CPpiMRP =
        foundProductVariant?.pv_mrp * foundProductUnit?.pu_multiplier;
      const defaultB2BPpiMRP =
        (foundProductVariant?.pv_b2b_mrp /
          foundProductVariant?.pu_b2b_base_unit_multiplier) *
        foundProductUnit?.pu_multiplier;

      return {
        ppi_product_id: item?.poi_product_id,
        ppi_product_variant_id: item?.poi_product_variant_id,
        p_name: foundProduct?.p_name,
        productVariant: getReadableSKU(foundProductVariant?.pv_attribute),
        productUnit: foundProductUnit?.pu_label,
        p_form: foundProduct?.p_form,
        p_strength: foundProduct?.p_strength,
        ppi_qty: item?.poi_quantity,
        ppi_unit_id: item?.poi_unit,
        baseUnit: foundProductVariant?.pu_base_unit_label,
        salesUnitMultiplier: foundProductUnit?.pu_multiplier,
        // TOOD: ppi_purchase_price = qty * purchase_price * unit ???
        tpPrice,
        ppi_purchase_price: tpPrice,
        defaultPpiPurchasePrice,
        ppi_vat: isCheckedUnitVat
          ? item?.poi_quantity * item?.poi_vat
          : item?.poi_vat,
        ppi_multiplier: foundProductUnit?.pu_multiplier,
        ppi_batch: `TEMP-${item?.poi_product_variant_id}`,
        ppi_expiry:
          !!values.expMonth && !!values.expYear
            ? `${values.expYear}-${values.expMonth}-01`
            : "",
        ppi_mrp: item?.poi_quantity * defaultB2CPpiMRP,
        ppi_b2b_mrp: item?.poi_quantity * defaultB2BPpiMRP,
        defaultB2CPpiMRP,
        defaultB2BPpiMRP,
        // TOOD: ppi_price_with_vat = qty * purchase_price * unit + vat???
        ppi_price_with_vat: item?.poi_purchase_price + item?.poi_vat,
        ppi_discount: 0,
        b2cDiscountPrice: foundProductVariant?.pv_b2c_discounted_price,
        b2bDiscountPrice: foundProductVariant?.pv_b2b_discounted_price,
        isFixedDiscount: false,
        ppi_is_fixed_discount: 0,
        isDiscountChanged: false,
      };
    });
    setProductPurchaseItems((prev) => [...prev, ...productPurchaseItems]);
  };

  const handleOnSelectProduct = (selectedItem) => {
    const defaultVariant = getDefaultVariant(selectedItem?.pv);
    const defaultPurchaseUnit = getDefaultPurchaseUnit(selectedItem?.pu);

    setSelectedProduct(selectedItem);
    values.selectedProductDefaultPurchaseUnit = defaultPurchaseUnit;
    values.ppi_qty = undefined;

    setTpPrice(
      defaultPurchaseUnit?.pu_multiplier *
        (defaultVariant?.pv_purchase_price || 0)
    );
    setSelectedProductDefaultMultiplier(defaultPurchaseUnit?.pu_multiplier);
    form.setValue("ppi_batch", `TEMP-${defaultVariant?.pv_id}`);

    if (isEmpty(defaultVariant)) {
      inputRefs.variant.current?.focus();
    } else {
      inputRefs.qty.current?.focus();
    }
  };

  const handleOnSelectVariant = (selectedItem) => {
    const selectedVariant = selectedProduct?.pv?.find(
      (item) => item.pv_id === selectedItem.pv_id
    );

    let tpPrice;

    if (isCheckedUnitTpPrice) {
      tpPrice =
        selectedProductDefaultMultiplier *
        (selectedVariant?.pv_purchase_price || 0);
    } else {
      tpPrice =
        (values.ppi_qty || 1) *
        selectedProductDefaultMultiplier *
        (selectedVariant?.pv_purchase_price || 0);
    }

    setTpPrice(tpPrice);

    form.setValue("ppi_batch", `TEMP-${selectedVariant?.pv_id}`);
    inputRefs.qty.current?.focus();
  };

  const handleOnChangeQuantity = (e) => {
    const selectedVariant = selectedProduct?.pv?.find(
      (item) => item.pv_id === values.ppi_product_variant_id
    );

    setTpPrice(
      (isCheckedUnitTpPrice ? 1 : e.target.value || 1) *
        selectedProductDefaultMultiplier *
        (selectedVariant?.pv_purchase_price || 0)
    );
  };

  const handleCopySelectedProduct = () => {
    clipboard.copy(getProductTextRenderer(selectedProduct));
    notify("Selected product copied to clipboard!", {
      type: "success",
    });
  };

  // const handleOnChangeUnit = (unitId) => {
  //     setSelectedProductDefaultMultiplier(
  //         selectedProduct?.pu?.find((item) => item.pu_id === unitId)
  //             ?.pu_multiplier
  //     );
  // };

  const totalItem = productPurchaseItems?.reduce(
    (acc, current) => {
      acc.totalItemTPPrice += +current.ppi_purchase_price;
      acc.totalItemVat += +current.ppi_vat;
      acc.totalItemDiscount += +current.ppi_discount;
      acc.totalItemPurchasePrice += +current.ppi_price_with_vat;
      acc.totalItemMRP += +current.ppi_mrp;

      return acc;
    },
    {
      totalItemTPPrice: 0,
      totalItemVat: 0,
      totalItemDiscount: 0,
      totalItemPurchasePrice: 0,
      totalItemMRP: 0,
    }
  );

  const {
    totalItemTPPrice,
    totalItemVat,
    totalItemDiscount,
    totalItemPurchasePrice,
    totalItemMRP,
  } = totalItem || {};

  const invoicePrice = toFixedNumber(
    toFixedNumber(values.pp_total_purchase_price || 0) +
      (values.pp_total_vat || 0) -
      (values.pp_total_discount || 0) +
      (values.pp_round || 0)
  );

  values.totalItemTPPrice = toFixedNumber(totalItemTPPrice);
  values.totalItemVat = toFixedNumber(totalItemVat);
  values.totalItemDiscount = toFixedNumber(totalItemDiscount);
  values.totalItemPurchasePrice = toFixedNumber(totalItemPurchasePrice);
  values.totalItemMRP = toFixedNumber(totalItemMRP);
  values.isAmountMismatched =
    values.pp_total_purchase_price !== toFixedNumber(totalItemTPPrice) ||
    (values.pp_total_vat || 0) !== toFixedNumber(totalItemVat) ||
    (values.pp_total_discount || 0) - (values.pp_round || 0) !==
      toFixedNumber(totalItemDiscount) ||
    invoicePrice !== toFixedNumber(totalItemPurchasePrice);

  values.pp_inv_price = invoicePrice;
  values.ppi_vat = +selectedProductVariantSalesVat || 0;
  values.ppi = productPurchaseItems;

  return (
    <>
      <Box display="flex" gap={40} marginBottom={2}>
        {values.id && (
          <CustomField
            label="Status"
            value={values.pp_status}
            className={`${classes.capitalize} ${
              values.pp_status === "pending" && classes.textRed
            }`}
          />
        )}
        {!!values.pp_paid_by && (
          <Labeled label="Credit Paid By">
            <ReferenceField
              source="pp_paid_by"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
          </Labeled>
        )}
        {!!values.pp_product_received_by && (
          <Labeled label="Product Received By">
            <ReferenceField
              source="pp_product_received_by"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
          </Labeled>
        )}
      </Box>
      <Grid container spacing={1}>
        {values.id && (
          <Grid item xs={1}>
            <TextInput
              source="pp_id"
              label="ID"
              variant="outlined"
              helperText={false}
              fullWidth
              disabled
            />
          </Grid>
        )}
        <Grid item xs={1}>
          <AutocompleteInput
            source="pp_vendor_type"
            label="Purchase Type *"
            variant="outlined"
            helperText={false}
            options={{
              InputProps: { inputRef: inputRefs.purchaseType },
            }}
            choices={[
              { id: "local", name: "Local" },
              { id: "company", name: "Official" },
            ]}
            onSelect={() => inputRefs.purchaseOrder.current?.focus()}
            fullWidth
          />
        </Grid>
        {!values.id && values.pp_vendor_type && (
          <Grid item xs={2}>
            <ReferenceInput
              source="pp_purchase_order_id"
              label={
                values.pp_vendor_type === "company"
                  ? "Purchase Order *"
                  : "Purchase Order"
              }
              variant="outlined"
              helperText={false}
              reference="v1/purchaseOrder"
              filter={{
                _details: 1,
              }}
              filterToQuery={(searchText) =>
                searchText
                  ? {
                      _po_id: searchText,
                    }
                  : {}
              }
              fullWidth
            >
              <AutocompleteInput
                optionText={(record) =>
                  `ID #${record?.po_id} :: ${
                    record?.po_created_at?.split(" ")?.[0]
                  }${
                    record?.po_vendor_name ? `, ${record?.po_vendor_name}` : ""
                  } (${capitalizeFirstLetter(record?.po_vendor_type)})`
                }
                options={{
                  InputProps: {
                    inputRef: inputRefs.purchaseOrder,
                    multiline: true,
                  },
                }}
                onSelect={(data) => {
                  setSelectedPurchaseOrderGroupByProductId(
                    groupBy(data?.poi, (data) => data?.poi_product_id)
                  );
                  handleOnSelectPurchaseOrder(data);
                }}
                resettable
              />
            </ReferenceInput>
          </Grid>
        )}
        <Grid item xs={2}>
          <ReferenceInput
            source="pp_product_company_id"
            label="Brand"
            variant="outlined"
            helperText={false}
            reference="v1/productBrand"
            onSelect={() => inputRefs.vendor.current?.focus()}
            sort={{ field: "pb_name", order: "ASC" }}
            allowEmpty
            fullWidth
          >
            <AutocompleteInput
              options={{
                InputProps: {
                  inputRef: inputRefs.company,
                },
              }}
              optionValue="pb_id"
              optionText="pb_name"
              resettable
            />
          </ReferenceInput>
        </Grid>
        <Grid item xs={2}>
          <ReferenceInput
            source="pp_vendor_id"
            label="Vendor *"
            variant="outlined"
            reference="v1/vendor"
            helperText={false}
            onSelect={() => inputRefs.totalTP.current?.focus()}
            filter={{
              _status: "active",
              _type: values.pp_vendor_type,
            }}
            filterToQuery={(searchText) => ({
              _name: searchText,
            })}
            fullWidth
          >
            <AutocompleteInput
              optionText="v_name"
              options={{
                InputProps: {
                  inputRef: inputRefs.vendor,
                  multiline: true,
                },
              }}
              resettable
            />
          </ReferenceInput>
        </Grid>
        <Grid item xs={2}>
          <NumberInput
            source="pp_total_purchase_price"
            label="Total TP *"
            variant="outlined"
            helperText={false}
            inputRef={inputRefs.totalTP}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRefs.totalVAT.current?.focus();
            }}
            min={0}
            fullWidth
          />
        </Grid>
        <Grid item xs={1}>
          <NumberInput
            source="pp_total_vat"
            label="Total Vat"
            variant="outlined"
            helperText={false}
            validate={minValue(0, "Total vat can't be negative")}
            inputRef={inputRefs.totalVAT}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRefs.round.current?.focus();
            }}
            min={0}
            fullWidth
          />
          <FormatedBooleanInput
            source="pp_vat_required"
            label="Required?"
            helperText={false}
          />
        </Grid>
        <Grid item xs={1}>
          <NumberInput
            source="pp_total_discount"
            label="Total Discount"
            variant="outlined"
            helperText={false}
            validate={minValue(0, "Total discount can't be negative")}
            inputRef={inputRefs.totalDiscount}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRefs.tds.current?.focus();
            }}
            min={0}
            fullWidth
          />
        </Grid>
        <Grid item xs={1}>
          <NumberInput
            source="pp_tds"
            label="TDS"
            variant="outlined"
            helperText={false}
            validate={minValue(0, "TDS can't be negative")}
            inputRef={inputRefs.tds}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRefs.round.current?.focus();
            }}
            min={0}
            fullWidth
          />

          <FormatedBooleanInput
            source="pp_tds_required"
            label="Required?"
            helperText={false}
          />
        </Grid>
        <Grid item xs={2}>
          <NumberInput
            source="pp_round"
            label="Round"
            variant="outlined"
            helperText={false}
            inputRef={inputRefs.round}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRefs.paymentTerm.current?.focus();
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <AutocompleteInput
            source="pp_payment_method"
            label="Payment Method *"
            variant="outlined"
            helperText={false}
            options={{
              InputProps: { inputRef: inputRefs.paymentMethod },
            }}
            choices={[
              { id: "payable", name: "Payable" },
              { id: "receivable", name: "Receivable" },
            ]}
            defaultValue="payable"
            // Keep it for future use
            // onSelect={({ id }) => {
            //     values.pp_payment_term = id;
            //     inputRefs.paymentTerm.current?.focus();
            // }}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          {/* TODO: Make a reuseable component for payment method & term */}
          <AutocompleteInput
            source="pp_payment_term"
            label="Payment Term"
            variant="outlined"
            helperText={false}
            options={{
              InputProps: { inputRef: inputRefs.paymentTerm },
            }}
            choices={[
              { id: "advance_payment", name: "Advance Payment" },
              { id: "instant_payment", name: "Instant Payment" },
              {
                id: "short_term_credit",
                name: "Short Term Credit",
              },
              {
                id: "long_term_credit",
                name: "Long Term Credit",
              },
            ]}
            onSelect={() => inputRefs.note.current?.focus()}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextInput
            source="pp_note"
            label="Note"
            variant="outlined"
            helperText={false}
            inputRef={inputRefs.note}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRefs.product.current?.focus();
            }}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <ReferenceInput
            source="ppi_product_id"
            label="Product *"
            variant="outlined"
            helperText={false}
            // reference="general/v3/search"
            reference="v1/product"
            enableGetChoices={({ q }) => !!q && q.trim().length > 0}
            filter={{
              _details: 1,
              ...(values.pp_product_company_id && {
                _brand_id: values.pp_product_company_id,
              }),
            }}
            sort={{ field: "p_name", order: "ASC" }}
            fullWidth
          >
            <AutocompleteInput
              optionValue="p_id"
              optionText={getProductTextRenderer}
              matchSuggestion={() => true}
              options={{
                InputProps: {
                  inputRef: inputRefs.product,
                  multiline: true,
                  startAdornment: !!values.ppi_product_id ? (
                    <InputAdornment
                      position="start"
                      onClick={handleCopySelectedProduct}
                    >
                      <FileCopyIcon
                        style={{
                          cursor: "pointer",
                          color: "#CED4DA",
                        }}
                      />
                    </InputAdornment>
                  ) : null,
                },
              }}
              onSelect={(selectedProduct) =>
                handleOnSelectProduct(selectedProduct)
              }
              resettable
            />
          </ReferenceInput>
        </Grid>
        <Grid item xs={1}>
          <ProductVariantUnitInput
            source="ppi_product_variant_id"
            label="Variant"
            data={selectedProduct?.pv}
            inputRef={inputRefs.variant}
            onSelect={(selectedItem) => handleOnSelectVariant(selectedItem)}
            resettable={false}
          />
        </Grid>
        <Grid item xs={1}>
          <NumberInput
            source="ppi_qty"
            label="Qty *"
            variant="outlined"
            helperText={false}
            inputRef={inputRefs.qty}
            onChange={handleOnChangeQuantity}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || !values.ppi_qty) return;

              inputRefs.tpPrice.current?.focus();
              inputRefs.tpPrice.current?.select();
            }}
            min={1}
            fullWidth
          />
          <span className={classes.whitespaceNowrap}>
            {getQuantityLabel({
              qty: values.ppi_qty,
              salesUnit: values.selectedProductDefaultPurchaseUnit?.pu_label,
              baseUnit,
              salesUnitMultiplier,
            })}
          </span>
        </Grid>
        <Grid item xs={1}>
          <ProductVariantUnitInput
            source="ppi_unit_id"
            label="Unit"
            data={selectedProduct?.pu}
            inputRef={inputRefs.unit}
            onSelect={() => {
              inputRefs.tpPrice.current?.focus();
              inputRefs.tpPrice.current?.select();
            }}
            // NOTE: No need to change unit & focus to next field. Keep it for future use
            // onChange={handleOnChangeUnit}
            disabled
          />
        </Grid>
        <Grid item xs={1}>
          <MuiTextField
            label="TP Price *"
            variant="outlined"
            value={+tpPrice || ""}
            type="number"
            size="small"
            inputRef={inputRefs.tpPrice}
            style={{ marginTop: 8 }}
            onChange={(e) => setTpPrice(+e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || !tpPrice) return;

              inputRefs.vat.current?.select();
              inputRefs.vat.current?.focus();
            }}
            disabled={isEmpty(selectedProduct)}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedUnitTpPrice}
                onChange={(e) => setIsCheckedUnitTpPrice(e.target.checked)}
              />
            }
            label="Unit TP Price?"
            className={classes.whitespaceNowrap}
          />
          <Box mt={3}>
            {/* {!!(
                            selectedVariant?.pv_b2c_price === 0 ||
                            selectedVariant?.pv_b2c_mrp === 0
                        ) && <div className={classes.textRed}>Price Error</div>} */}
            {!!(
              values.ppi_qty &&
              tpPrice &&
              (selectedVariant?.pv_b2c_mrp || selectedVariant?.pv_b2b_mrp)
            ) && (
              <MrpProfitField
                tpPrice={tpPrice}
                selectedProductDefaultMultiplier={
                  selectedProductDefaultMultiplier
                }
                selectedVariant={selectedVariant}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <MuiTextField
            label="Vat"
            variant="outlined"
            value={+selectedProductVariantSalesVat || ""}
            type="number"
            size="small"
            inputRef={inputRefs.vat}
            style={{ marginTop: 8 }}
            onChange={(e) => setSelectedProductVariantSalesVat(+e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && inputRefs.batch.current?.focus()
            }
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedUnitVat}
                onChange={(e) => setIsCheckedUnitVat(e.target.checked)}
              />
            }
            label="Unit VAT?"
          />
        </Grid>
        <Grid item xs={1}>
          <MuiTextField
            label="Multiplier"
            variant="outlined"
            value={
              selectedProductDefaultMultiplier === 0
                ? ""
                : selectedProductDefaultMultiplier
            }
            type="number"
            size="small"
            inputRef={inputRefs.multiplier}
            style={{ marginTop: 8 }}
            // NOTE: No need to change selectedProductDefaultMultiplier & focus to next field. Keep it for future use
            onChange={(e) =>
              setSelectedProductDefaultMultiplier(+e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key !== "Enter" || !selectedProductDefaultMultiplier)
                return;

              inputRefs.batch.current?.focus();
            }}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={1}>
          <AutocompleteInput
            source="expMonth"
            label="Exp Month *"
            variant="outlined"
            helperText={false}
            options={{
              InputProps: { inputRef: inputRefs.expMonth },
            }}
            choices={monthsWithId}
            initialValue={
              new Date().getMonth() + 1 < 10
                ? `0${new Date().getMonth() + 1}`
                : (new Date().getMonth() + 1).toString()
            }
            onSelect={() => {
              inputRefs.expYear.current?.focus();
              inputRefs.expYear.current?.select();
            }}
            fullWidth
            resettable
          />
        </Grid>
        <Grid item xs={1}>
          <NumberInput
            source="expYear"
            label="Exp Year *"
            variant="outlined"
            helperText={false}
            inputRef={inputRefs.expYear}
            initialValue={new Date().getFullYear() + 5}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              values.expYear &&
              inputRefs.batch.current?.select()
            }
          />
        </Grid>
        <Grid item xs={1}>
          <TextInput
            source="ppi_batch"
            label="Batch *"
            variant="outlined"
            helperText={false}
            inputRef={inputRefs.batch}
            initialValue={
              values?.ppi_product_variant_id
                ? `TEMP-${values.ppi_product_variant_id}`
                : ""
            }
            onKeyDown={(e) =>
              e.key === "Enter" && values.ppi_batch && handleOnKeyDown()
            }
            fullWidth
          />
        </Grid>
      </Grid>
      {values.id && rest?.record?.pp_status === "approved" && (
        <Box display="flex" gridGap={8} mb={2}>
          {rest?.record?.pp_payment_method === "payable" &&
            !rest?.record?.pp_paid_by &&
            permissions?.includes("purchaseInvoiceCreditPayment") && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  setDialogAction("creditPaid");
                  setIsCreditPaidReceivableDialogOpen(true);
                }}
                disableElevation
              >
                Credit Paid
              </Button>
            )}
          {rest?.record?.pp_payment_method === "receivable" &&
            permissions?.includes("purchaseInvoiceReceivablePayment") && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  setDialogAction("receivablePaid");
                  setIsCreditPaidReceivableDialogOpen(true);
                }}
                disableElevation
              >
                Receivable Paid
              </Button>
            )}
          {!rest?.record?.pp_product_received_by && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setIsProductReceivedDialogOpen(true)}
              disableElevation
            >
              Product Recieved
            </Button>
          )}
          <CreditPaidReceivableDialog
            open={isCreditPaidReceivableDialogOpen}
            handleClose={() => setIsCreditPaidReceivableDialogOpen(false)}
            dialogAction={dialogAction}
            permissions={permissions}
          />
          <Confirm
            isOpen={isProductReceivedDialogOpen}
            loading={isLoading}
            title="Are you sure you want to recieved product?"
            content={false}
            onConfirm={refetch}
            onClose={() => setIsProductReceivedDialogOpen(false)}
          />
        </Box>
      )}
      {!!values.id && (
        <FileInput
          source="attachedFiles_pp_files"
          label="Attached Files *"
          accept="image/*, application/pdf"
          maxSize={FILE_MAX_SIZE}
          multiple
        >
          <FileField source="src" title="title" target="_blank" />
        </FileInput>
      )}
    </>
  );
};

export default PurchaseForm;
