import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FC, useEffect } from "react";
import { NumberInput, TextInput, minLength, required } from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type CreateUpdateDialogProps = {
  action: "create" | "edit";
  fetchDesignations?: () => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (isCreateDialogOpen: boolean) => void;
  singleDesignationData?: any;
};

const CreateUpdateDialog: FC<CreateUpdateDialogProps> = ({
  action,
  fetchDesignations,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  singleDesignationData,
}) => {
  const { values, hasValidationErrors } = useWatch();

  const { isExpand, isOpen, marginLeft, children, ...rest } =
    singleDesignationData;

  useEffect(() => {
    if (action === "create") return;

    values.r_id = rest.r_id;
    values.r_title = rest.r_title;
    values.r_parent = rest.r_parent;
    values.r_weight = rest.r_weight;
    values.r_sick_leaves = rest.r_sick_leaves;
    values.r_casual_leaves = rest.r_casual_leaves;
    values.r_annual_leaves = rest.r_annual_leaves;
    values.r_compensatory_leaves = rest.r_compensatory_leaves;
    values.r_maternity_leaves = rest.r_maternity_leaves;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endpoint =
    action === "create" ? "/v1/rank" : `/v1/rank/${singleDesignationData.r_id}`;

  const { isLoading, refetch } = useRequest(
    endpoint,
    {
      method: "POST",
      body: values,
    },
    {
      successNotify:
        action === "create" ? "Successfully created!" : "Successfully updated!",
      onSuccess: () => {
        fetchDesignations();
        onDialogClose();
      },
    }
  );

  const onDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Dialog open={isCreateDialogOpen} onClose={onDialogClose}>
      <DialogTitle>
        <Typography>
          {action === "create" ? "Create Designation" : "Update Designation"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          {action === "edit" && (
            <TextInput
              source="r_id"
              label="ID"
              variant="outlined"
              helperText={false}
              disabled
            />
          )}
          <TextInput
            source="r_title"
            label="Title"
            variant="outlined"
            helperText={false}
            validate={[
              required(),
              minLength(2, "Title must be at least 2 characters long"),
            ]}
          />
          <TreeDropdownInput
            reference="/v1/rank"
            filter={{ _page: 1, _perPage: 5000 }}
            source="r_parent"
            label="Parent"
            keyId="r_id"
            keyParent="r_parent"
            keyWeight="r_weight"
            optionTextValue="r_title"
          />
          <NumberInput
            source="r_weight"
            label="Weight"
            variant="outlined"
            helperText={false}
          />
          <NumberInput
            source="r_sick_leaves"
            label="Sick Leaves"
            variant="outlined"
            helperText={false}
          />
          <NumberInput
            source="r_casual_leaves"
            label="Casual Leaves"
            variant="outlined"
            helperText={false}
          />
          <NumberInput
            source="r_annual_leaves"
            label="Annual Leaves"
            variant="outlined"
            helperText={false}
          />
          <NumberInput
            source="r_compensatory_leaves"
            label="Compensatory Leaves"
            variant="outlined"
            helperText={false}
          />
          <NumberInput
            source="r_maternity_leaves"
            label="Maternity Leaves"
            variant="outlined"
            helperText={false}
          />
        </Box>
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={onDialogClose}
        onConfirm={refetch}
        disabled={hasValidationErrors}
      />
    </Dialog>
  );
};

export default CreateUpdateDialog;
