import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  ReferenceInput,
  TextInput,
  required,
} from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";

type ChangeStatusDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen) => void;
  salaryId: number;
};

const ChangeStatusDialog: FC<ChangeStatusDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  salaryId,
}) => {
  const classes = useAroggaStyles();
  const { values } = useWatch();

  const { isLoading, refetch } = useRequest(
    `/v1/employee/change-salary-status/${salaryId}`,
    {
      method: "POST",
      body: {
        s_status: values.s_status,
        payment_accounting_head: values.payment_accounting_head,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => handleDialogClose(),
    }
  );

  const handleDialogClose = () => {
    values.s_status = undefined;
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Are you sure you want to change salary status?</DialogTitle>
      <DialogContent>
        <TaxonomiesByVocabularyInput
          fetchKey="salary_status_type"
          source="s_status"
          label="Status"
          validate={[required()]}
          helperText={false}
          fullWidth
        />
        {values.s_status === "paid" && (
          <div>
            <Typography className={classes.textCenter}>
              Only Filled By Accounting Department
            </Typography>
            <ReferenceInput
              source="payment_accounting_head"
              label="Bank/Cash Head to Impact"
              variant="outlined"
              helperText={false}
              reference="v1/accountingHead"
              fullWidth
            >
              <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
            </ReferenceInput>
            <TextInput
              source="bank_transaction_id"
              label="Bank Transaction ID"
              variant="outlined"
              helperText={false}
              fullWidth
            />
          </div>
        )}
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        disabled={!values.s_status}
        onDialogClose={handleDialogClose}
        onConfirm={refetch}
      />
    </Dialog>
  );
};

export default ChangeStatusDialog;
