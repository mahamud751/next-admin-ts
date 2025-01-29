import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FC } from "react";
import { AutocompleteInput, ReferenceInput, SelectInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { useGetCurrentUser, useRequest } from "@/hooks";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type CreditPaidReceivableDialogProps = {
  open: boolean;
  handleClose: () => void;
  dialogAction: "creditPaid" | "receivablePaid";
  permissions: string[];
  [key: string]: any;
};

const CreditPaidReceivableDialog: FC<CreditPaidReceivableDialogProps> = ({
  open,
  handleClose,
  dialogAction,
}) => {
  const currentUser = useGetCurrentUser();
  const values = useWatch();

  const { isLoading, refetch } = useRequest(
    `/v3/productPurchase/${dialogAction}/${values.pp_id}`,
    {
      method: "POST",
      body: {
        bank_head_id: values.bank_head_id,
        pp_payment_method: values.paymentMethod,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => handleOnClose(),
    }
  );

  const handleOnClose = () => {
    values.bank_head_id = "";
    values.paymentMethod = "";
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleOnClose}>
      <DialogTitle>
        {`Are you sure you want to ${
          dialogAction === "creditPaid" ? "paid" : "receivable paid"
        }
                this?`}
      </DialogTitle>
      <DialogContent>
        <ReferenceInput
          source="bank_head_id"
          label="Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
          filter={{ _head_user_id: currentUser?.u_id }}
          fullWidth
        >
          <AutocompleteInput
            optionText="ah_name"
            // options={{
            //   InputProps: { multiline: true },
            // }}
            // resettable
          />
        </ReferenceInput>
        <SelectInput
          source="paymentMethod"
          label="Payment Method"
          variant="outlined"
          helperText={false}
          choices={[
            { id: "cash", name: "Cash" },
            { id: "bank", name: "Bank" },
          ]}
          fullWidth
        />
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        confirmLabel={
          dialogAction === "creditPaid" ? "Paid" : "Receivable Paid"
        }
        disabled={!values.bank_head_id || !values.paymentMethod}
        onDialogClose={handleOnClose}
        onConfirm={refetch}
      />
    </Dialog>
  );
};

export default CreditPaidReceivableDialog;
