import { Grid } from "@mui/material";
import {
  AutocompleteInput,
  DateInput,
  DateTimeInput,
  FileField,
  FileInput,
  maxLength,
  minLength,
  NumberInput,
  ReferenceInput,
  required,
  TextInput,
} from "react-admin";
import { useWatch } from "react-hook-form";

import { FILE_MAX_SIZE } from "@/utils/constants";
import {
  toFormattedDateTime,
  userEmployeeInputTextRenderer,
} from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";

const PolicyForm = () => {
  const { values } = useWatch();

  return (
    <Grid container spacing={1}>
      {values?.p_id && (
        <Grid item sm={6} md={3}>
          <TextInput
            source="p_id"
            label="ID"
            variant="outlined"
            helperText={false}
            fullWidth
            readOnly
          />
        </Grid>
      )}
      <Grid item sm={6} md={3}>
        <TextInput
          source="p_title"
          label="Policy Title"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(2, "Title must be at least 2 characters long"),
            maxLength(255, "Title cannot be longer than 255 characters"),
          ]}
          multiline
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <NumberInput
          source="p_policy_no"
          label="Policy No"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <NumberInput
          source="p_issue_no"
          label="Issue No"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <DateInput
          source="p_effective_date"
          label="Effective Date"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <DateTimeInput
          source="p_approved_at"
          label="Approval Date"
          variant="outlined"
          helperText={false}
          parse={(dateTime) =>
            toFormattedDateTime({
              dateString: dateTime,
            })
          }
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <ReferenceInput
          source="p_approved_by"
          label="Approval By"
          variant="outlined"
          helperText={false}
          reference="v1/users"
          isRequired
          fullWidth
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
          />
        </ReferenceInput>
      </Grid>
      <Grid item sm={6} md={3}>
        <DateTimeInput
          source="p_revised_at"
          label="Revised Date"
          variant="outlined"
          helperText={false}
          parse={(dateTime) =>
            toFormattedDateTime({
              dateString: dateTime,
            })
          }
          fullWidth
        />
      </Grid>
      <TreeDropdownInput
        reference="/v1/taxonomiesByVocabulary/department"
        source="p_department"
        label="Department"
        variant="outlined"
        keyId="t_id"
        keyParent="t_parent_id"
        inputType="selectArrayInput"
        optionValue="t_machine_name"
        optionTextValue="t_title"
        helperText={false}
        validate={[required()]}
        fullWidth
      />
      <FileInput
        source="attachedFiles_p_attachment"
        label="Attach Policy File"
        placeholder="Click to upload or drag and drop. PDF (Max size: 10MB)"
        helperText={false}
        accept={{
          "application/pdf": [".pdf"],
        }}
        maxSize={FILE_MAX_SIZE}
        validate={[required()]}
      >
        <FileField source="src" title="title" />
      </FileInput>
    </Grid>
  );
};

export default PolicyForm;
