import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";
import { TINY_MCE_EDITOR_INIT } from "@/utils/constants";
import { Grid } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import {
  AutocompleteInput,
  FormDataConsumer,
  Labeled,
  NumberInput,
  ReferenceInput,
  TextInput,
  minLength,
  required,
} from "react-admin";
import { useWatch } from "react-hook-form";

const TaxonomyForm = () => {
  const values = useWatch();

  const [description, setDescription] = useState(values.t_description);

  values.t_description = description;

  return (
    <Grid container spacing={1}>
      {values.t_id && (
        <Grid item sm={6} md={2}>
          <TextInput
            source="t_id"
            label="ID"
            variant="outlined"
            helperText={false}
            fullWidth
            disabled
          />
        </Grid>
      )}
      <Grid item sm={6} md={2}>
        <ReferenceInput
          source="t_v_id"
          label="Vocabulary"
          variant="outlined"
          helperText={false}
          reference="v1/vocabulary"
          isRequired
          fullWidth
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionText="v_title"
            // options={{
            //   InputProps: {
            //     multiline: true,
            //   },
            // }}
          />
        </ReferenceInput>
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="t_title"
          label="Title"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(3, "Title must be at least 3 characters long"),
          ]}
          fullWidth
        />
      </Grid>
      <FormDataConsumer>
        {({ formData }) => {
          if (!formData.t_v_id) return;

          return (
            <Grid item sm={6} md={2}>
              <ReferenceInput
                source="t_parent_id"
                label="Parent"
                variant="outlined"
                helperText={false}
                reference="v1/taxonomy"
                filter={{
                  _v_id: formData.t_v_id,
                }}
                fullWidth
              >
                <AutocompleteInput
                  matchSuggestion={() => true}
                  optionText="t_title"
                  // options={{
                  //     InputProps: {
                  //         multiline: true,
                  //     },
                  // }}
                />
              </ReferenceInput>
            </Grid>
          );
        }}
      </FormDataConsumer>
      <Grid item sm={6} md={2}>
        <NumberInput
          source="t_weight"
          label="Weight"
          variant="outlined"
          helperText={false}
          fullWidth
        />
      </Grid>
      <AroggaMovableImageInput
        source="attachedFiles_t_icon"
        label="Attached Icon (64*64 px)"
      />
      <AroggaMovableImageInput
        source="attachedFiles_t_banner"
        label="Attached Banner (1020*325 px)"
      />
      <Labeled label="Description *" fullWidth>
        <Editor
          tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
          init={TINY_MCE_EDITOR_INIT}
          value={description}
          onEditorChange={(newValue) => setDescription(newValue)}
        />
      </Labeled>
    </Grid>
  );
};

export default TaxonomyForm;
