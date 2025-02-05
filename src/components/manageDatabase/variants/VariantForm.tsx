import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import InlineArrayInput from "@/components/common/InlineArrayInput";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import { Box } from "@mui/material";
import { NumberInput, TextInput, minLength, required } from "react-admin";
import { useWatch } from "react-hook-form";

const VariantForm = () => {
  const { values } = useWatch();

  return (
    <>
      <Box display="flex" gap={8}>
        {values?.vt_id && (
          <TextInput
            source="vt_id"
            label="ID"
            variant="outlined"
            helperText={false}
            style={{ width: 256 }}
            readOnly
          />
        )}
        <TextInput
          source="vt_title"
          label="Title"
          variant="outlined"
          helperText={false}
          style={{ width: 256 }}
          validate={[
            required(),
            minLength(3, "Title must be at least 3 characters long"),
          ]}
        />
        <TaxonomiesByVocabularyInput
          fetchKey="variant_field_type"
          source="vt_field_type"
          label="Field Type"
          helperText={false}
          style={{ width: 256 }}
          validate={[required()]}
        />
        <FormatedBooleanInput
          source="vt_status"
          label="Status"
          style={{ marginTop: 8 }}
          fullWidth
        />
      </Box>
      <InlineArrayInput
        source="vt_config"
        label="Configuration"
        disableRemove={values?.vt_config?.length === 1}
      >
        <TextInput
          source="name"
          label="Name"
          variant="outlined"
          validate={[required()]}
        />
        <NumberInput source="weight" label="Weight" variant="outlined" />
        <FormatedBooleanInput source="status" label="Status" fullWidth />
      </InlineArrayInput>
      <TaxonomiesByVocabularyInput
        fetchKey="product_type"
        inputType="checkboxGroupInput"
        source="vt_allowedProductType"
        label="Allowed Product Type"
      />
    </>
  );
};

export default VariantForm;
