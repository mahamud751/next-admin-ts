import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { FC } from "react";
import { TextInput } from "react-admin";
// import { useForm, useWatch } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import AroggaDialogActions from "./AroggaDialogActions";

type TaxonomyCreateDialogProps = {
  fetchKey: string;
  inputType?:
    | "selectInput"
    | "selectArrayInput"
    | "checkboxGroupInput"
    | "autoCompleteInput"
    | "autoCompleteInputMui"
    | "referenceInput";
  source: string;
  label?: string;
  title?: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
};

const TaxonomyCreateDialog: FC<TaxonomyCreateDialogProps> = ({
  fetchKey,
  inputType,
  source,
  label,
  title,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const form = useForm();
  const values = useWatch();

  const { isLoading, refetch } = useRequest(
    `/v1/taxonomiesByVocabulary/multi/${fetchKey}`,
    {
      method: "POST",
      body: { t: [{ t_title: values.t_title }] },
    },
    {
      onSuccess: ({ data }) => {
        if (inputType === "referenceInput") {
          form.setValue(source, data?.[0]?.t_id);
          form.setValue(
            `${source}${title ? "Title" : "MachineName"}`,
            title ? data?.[0]?.t_title : data?.[0]?.t_machine_name
          );
        } else {
          const createdTaxonomy = title
            ? data?.[0]?.t_title.toLowerCase()
            : data?.[0]?.t_machine_name;
          form.setValue(source, createdTaxonomy);
        }
        onDialogClose();
      },
    }
  );

  const onDialogClose = () => {
    setIsDialogOpen(false);
    form.setValue("t_title", undefined);
  };

  return (
    <Dialog open={isDialogOpen} onClose={onDialogClose}>
      <DialogTitle>
        <Typography>Create New {label || source}</Typography>
      </DialogTitle>
      <DialogContent>
        <TextInput
          source="t_title"
          label="Title"
          variant="outlined"
          helperText={false}
          autoFocus
          multiline
          fullWidth
        />
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={onDialogClose}
        onConfirm={refetch}
        disabled={!values.t_title}
      />
    </Dialog>
  );
};

export default TaxonomyCreateDialog;
