import { Box } from "@mui/material";
import { FC, useCallback, useState } from "react";
import {
  Create,
  CreateProps,
  SimpleForm,
  //   useMutation,
  useNotify,
  useRedirect,
} from "react-admin";

import AmountMismatchedAlert from "@/components/managePurchase/purchases/AmountMismatchedAlert";

import SummaryTable from "@/components/managePurchase/purchases/SummaryTable";
import PurchaseTable from "@/components/managePurchase/purchases/purchaseTable";
import { useDocumentTitle } from "@/hooks";
import PurchaseToolbar from "./PurchaseToolbar";
// import { purchaseOnSave } from "./utils/purchaseOnSave";
import PurchaseForm from "@/components/managePurchase/purchases/PurchaseForm";

const PurchaseCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Purchase Create");

  const notify = useNotify();
  const redirect = useRedirect();
  //   const [mutate] = useMutation();

  const [tpPrice, setTpPrice] = useState(0);
  const [selectedProductVariantSalesVat, setSelectedProductVariantSalesVat] =
    useState(0);
  const [productPurchaseItems, setProductPurchaseItems] = useState([]);

  //   const onSave = useCallback(
  //     async (values) => {
  //       purchaseOnSave({
  //         notify,
  //         redirect,
  //         mutate,
  //         values,
  //       });
  //     },
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     [mutate]
  //   );

  return (
    <Create {...props}>
      <SimpleForm
        toolbar={
          <PurchaseToolbar
            setTpPrice={setTpPrice}
            setSelectedProductVariantSalesVat={
              setSelectedProductVariantSalesVat
            }
            productPurchaseItems={productPurchaseItems}
            setProductPurchaseItems={setProductPurchaseItems}
          />
        }
        // save={onSave}
        // submitOnEnter={false}
      >
        <PurchaseForm
          tpPrice={tpPrice}
          setTpPrice={setTpPrice}
          selectedProductVariantSalesVat={selectedProductVariantSalesVat}
          setSelectedProductVariantSalesVat={setSelectedProductVariantSalesVat}
          productPurchaseItems={productPurchaseItems}
          setProductPurchaseItems={setProductPurchaseItems}
        />
        {!!productPurchaseItems?.length && (
          <>
            <PurchaseTable
              productPurchaseItems={productPurchaseItems}
              setProductPurchaseItems={setProductPurchaseItems}
            />
            <Box mt={4} mb={2}>
              <SummaryTable />
            </Box>
            <AmountMismatchedAlert />
          </>
        )}
      </SimpleForm>
    </Create>
  );
};

export default PurchaseCreate;
