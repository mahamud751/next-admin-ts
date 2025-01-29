import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FC, useState } from "react";
import { Button, Confirm, Link } from "react-admin";
import { useWatch } from "react-hook-form";

import {
  getQuantityLabel,
  getReadableSKU,
  isInfinity,
  numberFormat,
  toFixedNumber,
} from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import { getMrpProfitPercent, mutateShapedDiscount } from "../utils";
import TableFooter from "./TableFooter";
import TableHeader from "./TableHeader";

type PurchaseTableProps = {
  isKeyboardPressed?: boolean;
  setIsKeyboardPressed?: (isKeyboardPressed: boolean) => void;
  productPurchaseItems: any[];
  setProductPurchaseItems: (productPurchaseItems) => void;
};

const PurchaseTable: FC<PurchaseTableProps> = ({
  isKeyboardPressed,
  setIsKeyboardPressed,
  productPurchaseItems,
  setProductPurchaseItems,
}) => {
  const classes = useAroggaStyles();
  const values = useWatch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // TODO: Remove this in future
  // const { isLoading, refetch } = useRequest(
  //     "",
  //     {},
  //     {
  //         onSuccess: ({ data }) => {
  //             redirect(
  //                 `/v1/product/create?source=${encodeURIComponent(
  //                     JSON.stringify({
  //                         ...data,
  //                         pv: data?.pv?.filter(
  //                             (item) =>
  //                                 item.pv_deleted_at === "0000-00-00 00:00:00"
  //                         ),
  //                         cloneActionFrom: "purchase",
  //                     })
  //                 )}`
  //             );
  //         },
  //     }
  // );

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    } else if (
      !["Backspace", "ArrowLeft", "ArrowRight", "."].includes(e.key) &&
      isNaN(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleOnBlur = ({ index, value, field }) => {
    const copiedProductPurchaseItems = [...productPurchaseItems];

    copiedProductPurchaseItems[index][field] = value;

    const {
      ppi_purchase_price,
      defaultPpiPurchasePrice,
      ppi_vat,
      ppi_discount,
      defaultB2CPpiMRP,
      defaultB2BPpiMRP,
    } = copiedProductPurchaseItems[index];

    if (field === "ppi_qty") {
      copiedProductPurchaseItems[index].ppi_purchase_price =
        value * defaultPpiPurchasePrice;
      copiedProductPurchaseItems[index].ppi_price_with_vat =
        value * defaultPpiPurchasePrice + ppi_vat - ppi_discount;
      copiedProductPurchaseItems[index].ppi_mrp = value * defaultB2CPpiMRP;
      copiedProductPurchaseItems[index].ppi_b2b_mrp = value * defaultB2BPpiMRP;
    }
    if (field === "ppi_purchase_price") {
      copiedProductPurchaseItems[index].ppi_price_with_vat =
        value + ppi_vat - ppi_discount;
    }
    if (field === "ppi_vat" || field === "ppi_discount") {
      copiedProductPurchaseItems[index].ppi_price_with_vat =
        +ppi_purchase_price + +ppi_vat - +ppi_discount;
    }
    if (field === "ppi_discount") {
      copiedProductPurchaseItems[index]["isDiscountChanged"] = true;
      mutateShapedDiscount(copiedProductPurchaseItems, values);
    }

    setProductPurchaseItems(copiedProductPurchaseItems);
  };

  const handleDiscountFixed = ({ index, event, field }) => {
    const copiedProductPurchaseItems = [...productPurchaseItems];

    copiedProductPurchaseItems[index][field] = event.target.checked ? 1 : 0;
    copiedProductPurchaseItems[index]["isFixedDiscount"] = event.target.checked;

    if (!event.target.checked) {
      copiedProductPurchaseItems[index]["isDiscountChanged"] = false;
    }

    mutateShapedDiscount(copiedProductPurchaseItems, values);
    setProductPurchaseItems(copiedProductPurchaseItems);
    values.id && !isKeyboardPressed && setIsKeyboardPressed(true);
  };

  // TODO: Remove this in future
  // const handleChangeMRP = (productId) => {
  //     refetch({
  //         endpoint: `/v1/product/${productId}`,
  //     });
  // };

  const handleClone = (index, cloneItem) => {
    const newProductPurchaseItems = [
      ...productPurchaseItems?.slice(0, index + 1),
      { ...cloneItem, ppi_batch: "", ppi_expiry: "" },
      ...productPurchaseItems?.slice(index + 1),
    ];
    setProductPurchaseItems(newProductPurchaseItems);
  };

  const handleRemove = (index) => {
    setProductPurchaseItems(productPurchaseItems.toSpliced(index, 1));
    values.id && !isKeyboardPressed && setIsKeyboardPressed(true);
  };

  return (
    <TableContainer>
      {!values.id && (
        <Box mb={3} textAlign="right">
          <Button
            label="Remove all items"
            variant="contained"
            className={classes.bgRed}
            onClick={() => setIsDialogOpen(true)}
          />
          <Confirm
            title="Confirmation"
            content="Are you sure you want to remove all items?"
            isOpen={isDialogOpen}
            loading={false}
            onConfirm={() => setProductPurchaseItems([])}
            onClose={() => setIsDialogOpen(false)}
          />
        </Box>
      )}
      <Table size="small">
        <TableHeader />
        <TableBody>
          {!!productPurchaseItems?.length &&
            productPurchaseItems.map((item, index) => {
              const commonConfig = {
                ppi_qty: item.ppi_qty * item.ppi_multiplier,
                ppi_purchase_price: item.ppi_purchase_price,
                ppi_vat: item.ppi_vat,
                ppi_discount: item.ppi_discount,
              };

              const b2cMrpPercent = getMrpProfitPercent({
                isMrpPercent: true,
                ppi_mrp: item.defaultB2CPpiMRP / item.ppi_multiplier,
                ...commonConfig,
              });
              const b2bMrpPercent = getMrpProfitPercent({
                isMrpPercent: true,
                ppi_mrp: item.defaultB2BPpiMRP / item.ppi_multiplier,
                ...commonConfig,
              });
              const b2cProfitPercent = getMrpProfitPercent({
                isMrpPercent: false,
                discountPrice: item?.b2cDiscountPrice,
                ...commonConfig,
              });
              const b2bProfitPercent = getMrpProfitPercent({
                isMrpPercent: false,
                discountPrice: item?.b2bDiscountPrice,
                ...commonConfig,
              });

              if (
                values.pp_vendor_type === "company" &&
                values.pp_purchase_order_id
              ) {
                item["mrpPercent"] = b2cMrpPercent || 0;
                item["profitPercent"] = b2cProfitPercent || 0;
              }

              return (
                <TableRow key={index}>
                  <TableCell>{productPurchaseItems.length - index}</TableCell>
                  <TableCell>
                    <Link
                      to={`/v1/product/${item.ppi_product_id}/edit`}
                      target="_blank"
                    >
                      {item.p_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {item.productVariant || getReadableSKU(item.pv_attribute)}
                  </TableCell>
                  <TableCell className={classes.capitalize}>
                    {item.p_form}
                  </TableCell>
                  <TableCell>{item.p_strength}</TableCell>
                  <TableCell
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onKeyDown={handleOnKeyDown}
                    onBlur={(e) =>
                      handleOnBlur({
                        index,
                        value: +e.currentTarget.innerText.trim(),
                        field: "ppi_qty",
                      })
                    }
                  >
                    {item.ppi_qty}
                  </TableCell>
                  <TableCell className={classes.whitespaceNowrap}>
                    {getQuantityLabel({
                      qty: item.ppi_qty,
                      salesUnit: item.productUnit || item.pu_label,
                      baseUnit: item.baseUnit || item.product_base_unit,
                      salesUnitMultiplier:
                        item.salesUnitMultiplier || item.ppi_multiplier,
                    })}
                  </TableCell>
                  <TableCell
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onKeyDown={handleOnKeyDown}
                    onBlur={(e) =>
                      handleOnBlur({
                        index,
                        value: +e.currentTarget.innerText.trim(),
                        field: "ppi_purchase_price",
                      })
                    }
                  >
                    {toFixedNumber(item.ppi_purchase_price)}
                  </TableCell>
                  <TableCell
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onKeyDown={handleOnKeyDown}
                    onBlur={(e) =>
                      handleOnBlur({
                        index,
                        value: +e.currentTarget.innerText.trim(),
                        field: "ppi_vat",
                      })
                    }
                  >
                    {toFixedNumber(item.ppi_vat)}
                  </TableCell>
                  <TableCell
                    contentEditable={!!item.ppi_is_fixed_discount}
                    suppressContentEditableWarning={true}
                    onKeyDown={handleOnKeyDown}
                    onBlur={(e) =>
                      handleOnBlur({
                        index,
                        value: +e.currentTarget.innerText.trim(),
                        field: "ppi_discount",
                      })
                    }
                  >
                    {toFixedNumber(item.ppi_discount)}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={!!item.ppi_is_fixed_discount}
                      onChange={(e) =>
                        handleDiscountFixed({
                          index,
                          event: e,
                          field: "ppi_is_fixed_discount",
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {numberFormat(toFixedNumber(item.ppi_price_with_vat))}
                  </TableCell>
                  <TableCell>
                    {numberFormat(toFixedNumber(item.ppi_mrp))}
                  </TableCell>
                  <TableRow
                    style={{
                      borderTop: index !== 0 && "1px solid rgb(234 235 236)",
                    }}
                  >
                    <TableCell
                      style={{
                        border: "none",
                      }}
                    >
                      <div
                        className={
                          b2cMrpPercent < 0 || b2cMrpPercent > 50
                            ? classes.textRed
                            : classes.textGreen
                        }
                      >
                        {!isInfinity(b2cMrpPercent)
                          ? `MRP: ${b2cMrpPercent}`
                          : ""}
                      </div>
                      <div
                        className={
                          b2cProfitPercent < 0
                            ? classes.textRed
                            : b2cProfitPercent > 50
                            ? classes.textOrange
                            : classes.textGreen
                        }
                      >
                        {!isInfinity(b2cProfitPercent)
                          ? `Profit: ${b2cProfitPercent}`
                          : ""}
                      </div>
                    </TableCell>
                    <TableCell style={{ border: "none" }}>
                      <div
                        className={
                          b2bMrpPercent < 0 || b2bMrpPercent > 50
                            ? classes.textRed
                            : classes.textGreen
                        }
                      >
                        {!isInfinity(b2bMrpPercent)
                          ? `MRP: ${b2bMrpPercent}`
                          : ""}
                      </div>
                      <div
                        className={
                          b2bProfitPercent < 0
                            ? classes.textRed
                            : b2bProfitPercent > 50
                            ? classes.textOrange
                            : classes.textGreen
                        }
                      >
                        {!isInfinity(b2bProfitPercent)
                          ? `Profit: ${b2bProfitPercent}`
                          : ""}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableCell>
                    {!!item.ppi_multiplier && item.ppi_multiplier}
                  </TableCell>
                  <TableCell
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      handleOnBlur({
                        index,
                        value: e.currentTarget.innerText.trim(),
                        field: "ppi_batch",
                      })
                    }
                  >
                    {item.ppi_batch}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      variant="outlined"
                      size="small"
                      value={item.ppi_expiry}
                      onChange={(e) =>
                        handleOnBlur({
                          index,
                          value: e.target.value,
                          field: "ppi_expiry",
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {/* TODO: Remove this in future */}
                      {/* <Button
                                                label="Change MRP"
                                                variant="contained"
                                                className={
                                                    classes.whitespaceNowrap
                                                }
                                                onClick={() =>
                                                    handleChangeMRP(
                                                        item.ppi_product_id
                                                    )
                                                }
                                                disabled={isLoading}
                                            /> */}
                      <span
                        className={classes.cursorPointer}
                        onClick={() => handleClone(index, item)}
                      >
                        <AddCircleOutlineIcon />
                      </span>
                      <span
                        className={classes.cursorPointer}
                        onClick={() => handleRemove(index)}
                      >
                        <HighlightOffIcon />
                      </span>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
        <TableFooter />
      </Table>
    </TableContainer>
  );
};

export default PurchaseTable;
