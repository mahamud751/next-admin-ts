import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FC } from "react";
import { DateInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { toFormattedDateTime } from "@/utils/helpers";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type TerminateDialogProps = {
  open: boolean;
  setIsDialogOpen: (open: boolean) => void;
  employeeId: number;
  employeeRetirementAction: string;
};

const TerminateDialog: FC<TerminateDialogProps> = ({
  open,
  setIsDialogOpen,
  employeeId,
  employeeRetirementAction,
}) => {
  const { values } = useWatch();

  const { isLoading, refetch } = useRequest(
    "/v1/employee/retirement",
    {
      method: "POST",
      body:
        employeeRetirementAction === "terminate"
          ? {
              e_id: employeeId,
              e_date_of_leaving: values.dateOfLeaving,
            }
          : {
              e_id: employeeId,
              e_date_of_leaving: toFormattedDateTime({
                isDate: true,
                dateString: new Date().toString(),
              }),
              is_released: 1,
            },
    },
    {
      isRefresh: true,
      onSuccess: () => handleDialogClose(),
    }
  );

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    values.dateOfLeaving = "";
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>
        {`Are you sure you want to ${employeeRetirementAction} this employee?`}
      </DialogTitle>
      {employeeRetirementAction === "terminate" && (
        <DialogContent>
          <DateInput
            source="dateOfLeaving"
            label="Date Of Leaving"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        </DialogContent>
      )}
      <AroggaDialogActions
        isLoading={isLoading}
        disabled={
          employeeRetirementAction === "terminate"
            ? !values.dateOfLeaving
            : false
        }
        onDialogClose={handleDialogClose}
        onConfirm={refetch}
      />
    </Dialog>
  );
};

export default TerminateDialog;
