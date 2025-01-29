export const getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount = (
    productPurchaseItems = []
) => {
    return productPurchaseItems?.reduce((prevValue, currentValue) => {
        if (currentValue?.ppi_is_fixed_discount) {
            return prevValue + +currentValue.ppi_purchase_price;
        }
        return prevValue;
    }, 0);
};

export const getSumOfIndividualPpiDiscountForPpiIsFixedDiscount = (
    productPurchaseItems = []
) => {
    return productPurchaseItems?.reduce((prevValue, currentValue) => {
        if (currentValue?.ppi_is_fixed_discount) {
            return prevValue + +currentValue.ppi_discount;
        }
        return prevValue;
    }, 0);
};

export const mutateShapedDiscount = (newProductPurchaseItems = [], values) => {
    return newProductPurchaseItems.forEach((item) => {
        if (item.isFixedDiscount && !item.isDiscountChanged) {
            item.ppi_discount = 0;
        } else if (!item.ppi_is_fixed_discount) {
            item.ppi_discount = getDiscountBasedOnIsDiscountFixed({
                purchasePrice: item.ppi_purchase_price,
                totalPurchasePrice: values.pp_total_purchase_price,
                getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount:
                    getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount(
                        newProductPurchaseItems
                    ),
                totalDiscount:
                    (values.pp_total_discount || 0) -
                    getSumOfIndividualPpiDiscountForPpiIsFixedDiscount(
                        newProductPurchaseItems
                    ),
                pp_round: values.pp_round,
            });

            item.ppi_price_with_vat =
                +item.ppi_purchase_price + +item.ppi_vat - item.ppi_discount;
        }
    });
};

export const getDiscountBasedOnIsDiscountFixed = ({
    purchasePrice = 0,
    totalPurchasePrice = 0,
    getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount = 0,
    totalDiscount = 0,
    pp_round = 0,
}) => {
    return (
        ((totalDiscount - pp_round) * purchasePrice) /
            (totalPurchasePrice -
                getSumOfIndividualPpiPurchasePriceForPpiIsFixedDiscount) || 0
    );
};

// If isMrpPercent true, it returns MRP Percentage otherwise, Profit Percentage
export const getMrpProfitPercent = ({
    isMrpPercent,
    ppi_qty = 0,
    ppi_mrp = 0,
    discountPrice = 0,
    ppi_purchase_price = 0,
    ppi_vat = 0,
    ppi_discount = 0,
}) => {
    return Math.round(
        ((ppi_qty * (isMrpPercent ? +ppi_mrp : +discountPrice) -
            (+ppi_purchase_price + +ppi_vat - +ppi_discount)) /
            (ppi_qty * (isMrpPercent ? +ppi_mrp : +discountPrice))) *
            100
    );
};
