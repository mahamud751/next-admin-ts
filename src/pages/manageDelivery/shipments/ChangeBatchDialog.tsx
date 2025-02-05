import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { FC, useState } from "react";
import { AutocompleteInput, ReferenceInput, SelectInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { useEffectOnDependencyChange, useRequest } from "@/hooks";
import { getReadableSKU } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type ChangeBatchDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  [key: string]: any;
};

const ChangeBatchDialog: FC<ChangeBatchDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  ...rest
}) => {
  const classes = useAroggaStyles();
  const values = useWatch();

  const [selectedBatchNo, setSelectedBatchNo] = useState("");

  const { isLoading, refetch } = useRequest(
    `/v1/shipmentAction/${rest?.record?.si_shipment_id}/batchChangeAction`,
    {
      method: "POST",
      body: {
        variant_id: rest?.record?.si_variant_id,
        replace_batch_no: selectedBatchNo,
        reason: values.reason,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => onDialogClose(),
    }
  );

  useEffectOnDependencyChange(() => {
    if (!values.searchedBatchId) {
      setSelectedBatchNo("");
    }
  }, [values.searchedBatchId]);

  const onDialogClose = () => {
    values.searchedBatchId = undefined;
    values.reason = undefined;
    setSelectedBatchNo("");
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onClose={onDialogClose}>
      <DialogTitle>
        <Typography>
          Change Batch For{" "}
          <span className={classes.fontBold}>
            {rest?.record?.p_name} ({getReadableSKU(rest?.record?.pv_attribute)}
            )
          </span>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <ReferenceInput
          source="searchedBatchId"
          label="Search Batch No"
          variant="outlined"
          helperText={false}
          reference="v1/stockDetail"
          filter={{
            _product_variant_id: rest?.record?.si_variant_id,
          }}
          onSelect={(selectedItem) =>
            setSelectedBatchNo(selectedItem?.sd_batch_no)
          }
          fullWidth
        >
          <AutocompleteInput optionText="sd_batch_no" />
        </ReferenceInput>
        <SelectInput
          source="reason"
          label="Reason"
          variant="outlined"
          helperText={false}
          choices={[
            { id: "lost", name: "Lost" },
            { id: "short_expire", name: "Short Expire" },
            { id: "damaged", name: "Damaged" },
          ]}
          fullWidth
        />
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={onDialogClose}
        onConfirm={refetch}
        disabled={!selectedBatchNo || !values.reason}
      />
    </Dialog>
  );
};

export default ChangeBatchDialog;
