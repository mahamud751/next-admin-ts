import { Grid } from "@mui/material";
import {
  AutocompleteInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  maxLength,
  minLength,
  required,
} from "react-admin";
import { useWatch } from "react-hook-form";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";

import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const NotificationForm = () => {
  const { values } = useWatch();

  return (
    <Grid container spacing={1}>
      {values?.n_id && (
        <Grid item sm={6} md={3}>
          <TextInput
            source="n_id"
            label="ID"
            variant="outlined"
            helperText={false}
            readOnly
            fullWidth
          />
        </Grid>
      )}
      <Grid item sm={6} md={3}>
        <ReferenceInput
          source="n_true_user"
          label="User"
          variant="outlined"
          helperText={false}
          reference="v1/users"
          isRequired
          fullWidth
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionValue="u_id"
            helperText={false}
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
          />
        </ReferenceInput>
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="n_title"
          label="Title"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(2, "Title must be at least 2 characters long"),
            maxLength(500, "Title cannot be longer than 500 characters"),
          ]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <SelectInput
          source="n_type"
          label="Type"
          variant="outlined"
          helperText={false}
          choices={[
            { id: "promotional", name: "Promotional" },
            { id: "transactional", name: "Transactional" },
          ]}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="n_button_title"
          label="Button Title"
          variant="outlined"
          helperText={false}
          validate={[
            minLength(3, "Button title must be at least 3 characters long"),
            maxLength(255, "Button title cannot be longer than 255 characters"),
          ]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="n_button_link"
          label="Button Link"
          variant="outlined"
          helperText={false}
          validate={[
            minLength(3, "Button link must be at least 3 characters long"),
            maxLength(255, "Button link cannot be longer than 255 characters"),
          ]}
          fullWidth
        />
      </Grid>
      {/* TODO: */}
      {/* <Grid item sm={6} md={3}>
                <TextInput
                    source="n_params"
                    label="Params"
                    variant="outlined"
                    helperText={false}
                    validate={[
                        minLength(
                            3,
                            "Params must be at least 3 characters long"
                        ),
                        maxLength(
                            200,
                            "Params cannot be longer than 200 characters"
                        ),
                    ]}
                    fullWidth
                />
            </Grid> */}
      <Grid item sm={6} md={3}>
        <SelectInput
          source="n_status"
          label="Status"
          variant="outlined"
          helperText={false}
          choices={[
            { id: "warning", name: "Warning" },
            { id: "danger", name: "Danger" },
            { id: "info", name: "Info" },
            { id: "success", name: "Success" },
          ]}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="n_description"
          label="Description"
          variant="outlined"
          helperText={false}
          validate={[
            maxLength(500, "Description cannot be longer than 500 characters"),
          ]}
          multiline
          fullWidth
        />
      </Grid>
      <Grid item sm={1}>
        <FormatedBooleanInput
          source="n_is_public"
          label="Public?"
          //   style={{ marginTop: 8 }}
          fullWidth
        />
      </Grid>
      <Grid item sm={1}>
        <FormatedBooleanInput
          source="n_is_active"
          label="Active?"
          //   style={{ marginTop: 8 }}
          fullWidth
        />
      </Grid>
      <Grid item sm={12}>
        <AroggaMovableImageInput
          source="attachedFiles_n_images"
          label="Attached Images"
        />
      </Grid>
    </Grid>
  );
};

export default NotificationForm;
