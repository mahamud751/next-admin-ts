import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { FC } from "react";
import { NumberInput, TextInput, useRefresh } from "react-admin";
import { useFormState } from "react-final-form";

import { useRequest } from "@/hooks";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type AdjustmentDialogProps = {
  action: string;
  selectedItem: any;
  open: boolean;
  handleDialogClose: () => void;
  refetchSalaryAdjustment: () => void;
};

const AdjustmentDialog: FC<AdjustmentDialogProps> = ({
  action,
  selectedItem,
  open,
  handleDialogClose,
  refetchSalaryAdjustment,
}) => {
  const refresh = useRefresh();
  const { values, pristine } = useFormState();
  const { s_id: sa_s_id, sa_amount, sa_type, sa_reason } = values;

  const { isLoading: isLoadingUpdate, refetch: updateSalaryAdjustment } =
    useRequest(
      `/v1/salaryAdjustment/${selectedItem.sa_id}`,
      {
        method: "POST",
        body: { sa_s_id, sa_amount, sa_type, sa_reason },
      },
      {
        onSuccess: () => {
          refetchSalaryAdjustment();
          handleDialogClose();
          refresh();
        },
      }
    );

  const { isLoading: isLoadingDelete, refetch: deleteSalaryAdjustment } =
    useRequest(
      `/v1/salaryAdjustment/${selectedItem.sa_id}`,
      {
        method: "DELETE",
      },
      {
        onSuccess: () => {
          refetchSalaryAdjustment();
          handleDialogClose();
        },
      }
    );

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>
        {action === "update"
          ? "Update Salary Adjustment"
          : `Are you sure want to delete this adjustment? #${selectedItem.sa_id}`}
      </DialogTitle>
      {action === "update" && (
        <DialogContent>
          <Grid container direction="column">
            <NumberInput
              source="sa_amount"
              label="Amount"
              variant="outlined"
              helperText={false}
              defaultValue={+selectedItem.sa_amount}
            />
            <TaxonomiesByVocabularyInput
              fetchKey="salary_adjustment_type"
              source="sa_type"
              label="Type"
              initialValue={selectedItem.sa_type}
            />
            <TextInput
              source="sa_reason"
              label="Reason"
              variant="outlined"
              helperText={false}
              defaultValue={selectedItem.sa_reason}
              minRows={2}
              multiline
            />
          </Grid>
        </DialogContent>
      )}
      <AroggaDialogActions
        isLoading={isLoadingUpdate || isLoadingDelete}
        confirmLabel={action === "update" ? "Update" : "Confirm"}
        disabled={action === "update" ? pristine : false}
        onDialogClose={handleDialogClose}
        onConfirm={
          action === "update" ? updateSalaryAdjustment : deleteSalaryAdjustment
        }
      />
    </Dialog>
  );
};

export default AdjustmentDialog;
