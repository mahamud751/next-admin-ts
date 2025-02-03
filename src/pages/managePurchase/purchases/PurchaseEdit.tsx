import { Box } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import {
  Edit,
  EditProps,
  SimpleForm,
  useEditController,
  //   useMutation,
  useNotify,
  useRedirect,
} from "react-admin";

import AmountMismatchedAlert from "@/components/managePurchase/purchases/AmountMismatchedAlert";
import PurchaseApprove from "@/components/managePurchase/purchases/PurchaseApprove";
import PurchaseForm from "@/components/managePurchase/purchases/PurchaseForm";
import SummaryTable from "@/components/managePurchase/purchases/SummaryTable";
import PurchaseTable from "@/components/managePurchase/purchases/purchaseTable";
import { useDocumentTitle, useGetCurrentUser } from "@/hooks";
import PurchaseToolbar from "./PurchaseToolbar";
import { purchaseOnSave } from "./utils/purchaseOnSave";

const PurchaseEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Purchase Edit");

  const notify = useNotify();
  const redirect = useRedirect();
  const currentUser = useGetCurrentUser();
  const { record } = useEditController(rest);
  const [mutate] = useMutation();

  const [isKeyboardPressed, setIsKeyboardPressed] = useState(false);
  const [tpPrice, setTpPrice] = useState(0);
  const [selectedProductVariantSalesVat, setSelectedProductVariantSalesVat] =
    useState(0);
  const [productPurchaseItems, setProductPurchaseItems] = useState([]);

  useEffect(() => {
    if (isKeyboardPressed) return;

    document.addEventListener("keydown", () => setIsKeyboardPressed(true));

    return () =>
      document.removeEventListener("keydown", () =>
        setIsKeyboardPressed(false)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <Edit
      mutationMode={
        process.env.NEXT_PUBLIC_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
    >
      <SimpleForm
        toolbar={<PurchaseToolbar />}
        // save={onSave}
        submitOnEnter={false}
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
              isKeyboardPressed={isKeyboardPressed}
              setIsKeyboardPressed={setIsKeyboardPressed}
              productPurchaseItems={productPurchaseItems}
              setProductPurchaseItems={setProductPurchaseItems}
            />
            <Box mt={4} mb={2}>
              <SummaryTable />
            </Box>
            {!isKeyboardPressed &&
              permissions?.includes("productPurchaseApprove") &&
              currentUser.u_id !== record?.pp_created_by &&
              record?.pp_status !== "approved" && (
                <Box display="flex" justifyContent="center" mb={2}>
                  <PurchaseApprove />
                </Box>
              )}
            <AmountMismatchedAlert />
          </>
        )}
      </SimpleForm>
    </Edit>
  );
};

export default PurchaseEdit;
