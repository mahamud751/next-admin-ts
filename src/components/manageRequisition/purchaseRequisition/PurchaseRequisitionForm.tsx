import { FILE_MAX_SIZE } from "@/utils/constants";
import { Grid } from "@mui/material";
import {
  FileField,
  FileInput,
  NumberInput,
  TextInput,
  maxLength,
  minLength,
  minValue,
  required,
} from "react-admin";
import { useWatch } from "react-hook-form";

const validateItemName = [
  required(),
  minLength(2, "Name must be at least 2 characters long"),
  maxLength(200, "Name must be at max 200 characters"),
];
const validateDescriptionName = [
  required(),
  minLength(2, "Name must be at least 2 characters long"),
  maxLength(1000, "Name must be at max 1000 characters"),
];
const validateRequired = [required()];

const PurchaseRequisitionForm = () => {
  const values = useWatch();

  return (
    <Grid container spacing={1}>
      {!!values.pr_id && (
        <Grid item sm={6} md={12}>
          {" "}
          <TextInput
            source="pr_id"
            label="ID"
            variant="outlined"
            helperText={false}
            disabled
          />
        </Grid>
      )}
      <Grid item sm={6} md={12}>
        <TextInput
          source="pr_name"
          label="Item Name"
          variant="outlined"
          helperText={false}
          validate={validateItemName}
        />
      </Grid>
      <Grid item sm={6} md={12}>
        {" "}
        <NumberInput
          source="pr_quantity"
          label="Quantity"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minValue(1, "Per user usable count can't be 0 or negative"),
          ]}
          min={1}
        />
      </Grid>
      <Grid item sm={6} md={12}>
        <TextInput
          source="pr_unit"
          label="Unit"
          variant="outlined"
          helperText={false}
          validate={validateRequired}
        />
      </Grid>
      <Grid item sm={6} md={12}>
        <TextInput
          source="pr_description"
          label="Description"
          variant="outlined"
          helperText={false}
          minRows={2}
          multiline
          validate={validateDescriptionName}
        />
      </Grid>
      <Grid item sm={6} md={12}>
        <FileInput
          source="attachedFiles_pr_attachment"
          label="Files"
          accept="image/*, application/pdf,"
          maxSize={FILE_MAX_SIZE}
          helperText={false}
          multiple
        >
          <FileField source="src" title="title" />
        </FileInput>
      </Grid>
    </Grid>
  );
};

export default PurchaseRequisitionForm;
