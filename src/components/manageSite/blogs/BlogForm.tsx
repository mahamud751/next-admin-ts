import { Box } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import {
  AutocompleteInput,
  Labeled,
  NumberInput,
  ReferenceInput,
  TextInput,
  minValue,
  required,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { TINY_MCE_EDITOR_INIT } from "@/utils/constants";
import { getProductTextRenderer, getReadableSKU } from "@/utils/helpers";

import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";
import InlineArrayInput from "@/components/common/InlineArrayInput";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";

const BlogForm = () => {
  const inputRef = useRef<HTMLInputElement>(null!);
  const { setValue } = useFormContext();
  const values = useWatch();

  const [description, setDescription] = useState(values.bp_description);

  values.bp_description = description;
  useEffect(() => {
    setValue("bp_description", description);
  }, [description, setValue]);

  return (
    <>
      {values?.bp_id && (
        <TextInput
          source="bp_id"
          label="ID"
          variant="outlined"
          helperText={false}
          readOnly
        />
      )}
      <Box display="flex" gap={8}>
        <TextInput
          source="bp_title"
          label="Title"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          multiline
        />
        <TaxonomiesByVocabularyInput
          fetchKey="blog_type"
          source="bp_type"
          label="Blog Type"
          helperText={false}
          validate={[required()]}
        />
        <NumberInput
          source="bp_reading_time"
          label="Reading Time"
          variant="outlined"
          helperText={false}
          validate={[minValue(1)]}
          min={1}
        />
        <FormatedBooleanInput
          source="bp_is_feature"
          label="Feature?"
          fullWidth
        />
        <FormatedBooleanInput source="bp_is_active" label="Active?" fullWidth />
      </Box>
      {/* TODO: Refactor this part in future */}
      <InlineArrayInput source="bp_products" label="Products" enableRenderProps>
        {({ scopedFormData }) => (
          <Box display="flex" gap={8}>
            <ReferenceInput
              source={"p_id"}
              record={scopedFormData}
              label="Product"
              variant="outlined"
              helperText={false}
              reference="v1/product"
              filter={{ _details: 1 }}
              sort={{ field: "p_name", order: "ASC" }}
              onSelect={({ pv }) => {
                setValue(
                  "pv_id",
                  pv?.length === 1 ? pv?.[0]?.pv_id : undefined
                );
                pv?.length !== 1 &&
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 1);
              }}
              isRequired
            >
              <AutocompleteInput
                optionText={getProductTextRenderer}
                // options={{
                //   InputProps: { multiline: true },
                // }}
                matchSuggestion={() => true}
              />
            </ReferenceInput>
            {scopedFormData?.p_id && (
              <ReferenceInput
                source="pv_id"
                record={scopedFormData}
                label="Variant"
                variant="outlined"
                helperText={false}
                reference="v1/productVariant"
                filter={{
                  _product_id: scopedFormData?.p_id,
                  _perPage: 500,
                }}
                isRequired
              >
                <AutocompleteInput
                  optionText={(item) => getReadableSKU(item?.pv_attribute)}
                  //   options={{
                  //     InputProps: {
                  //       multiline: true,
                  //       inputRef: inputRef,
                  //     },
                  //   }}
                  matchSuggestion={() => true}
                />
              </ReferenceInput>
            )}
          </Box>
        )}
      </InlineArrayInput>
      <InlineArrayInput source="bp_youtube" label="Videos" inline>
        <TextInput
          source="title"
          label="Title"
          variant="outlined"
          helperText={false}
          multiline
        />
        <TextInput
          source="key"
          label="Key"
          variant="outlined"
          helperText={false}
          multiline
        />
      </InlineArrayInput>
      <AroggaMovableImageInput
        source="attachedFiles_bp_images"
        label="Attached Images (1800*945 px)"
        // dimentionValidation
      />

      <Labeled label="Description *" fullWidth>
        <Editor
          tinymceScriptSrc={
            "https://cdn.tiny.cloud/1/9i9siri6weyxjml0qbccbm35m7o5r42axcf3lv0mbr0k3pkl/tinymce/7/tinymce.min.js"
          }
          init={TINY_MCE_EDITOR_INIT as any}
          value={description}
          onEditorChange={(newValue) => setDescription(newValue)}
        />
      </Labeled>
    </>
  );
};

export default BlogForm;
