import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FC, useEffect } from "react";
import { Labeled, TextInput, minLength, required } from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";

import AllowedRoles from "./AllowedRoles";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";

type CreateUpdateDialogProps = {
  action: "create" | "edit";
  fetchDepartments?: () => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (isCreateDialogOpen: boolean) => void;
  singleDepartmentData?: any;
};

const CreateUpdateDialog: FC<CreateUpdateDialogProps> = ({
  action,
  fetchDepartments,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  singleDepartmentData,
}) => {
  const { values, hasValidationErrors } = useWatch();

  const { isExpand, isOpen, marginLeft, children, ...rest } =
    singleDepartmentData;

  useEffect(() => {
    if (action === "create") return;

    values.t_id = rest.t_id;
    values.t_title = rest.t_title;
    values.t_parent_id = rest.t_parent_id;
    values.t_description = rest.t_description;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endpoint =
    action === "create"
      ? "/v1/taxonomy"
      : `/v1/taxonomy/${singleDepartmentData.t_id}`;

  const { isLoading, refetch } = useRequest(
    endpoint,
    {
      method: "POST",
      body: action === "create" ? { ...values, t_v_id: 12 } : values,
    },
    {
      successNotify:
        action === "create" ? "Successfully created!" : "Successfully updated!",
      onSuccess: () => {
        fetchDepartments();
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
          {action === "create" ? "Create Department" : "Update Department"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          {action === "edit" && (
            <TextInput
              source="t_id"
              label="ID"
              variant="outlined"
              helperText={false}
              disabled
            />
          )}
          <TextInput
            source="t_title"
            label="Title"
            variant="outlined"
            helperText={false}
            validate={[
              required(),
              minLength(3, "Title must be at least 3 characters long"),
            ]}
          />
          <TreeDropdownInput
            reference="/v1/taxonomiesByVocabulary/department"
            source="t_parent_id"
            label="Parent"
            keyId="t_id"
            keyParent="t_parent_id"
            optionValue="t_id"
            optionTextValue="t_title"
            fullWidth
          />
          <TextInput
            source="t_description"
            label="Description"
            variant="outlined"
            helperText={false}
            validate={[
              required(),
              minLength(5, "Description must be at least 5 characters long"),
            ]}
            minRows={2}
            multiline
          />
          <Labeled label="Allowed Roles">
            <AllowedRoles
              isChecked={action === "create"}
              allowedRolesFromRecord={
                action === "edit" ? rest.t_allowed_roles : []
              }
            />
          </Labeled>
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
