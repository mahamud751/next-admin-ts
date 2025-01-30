import { Grid } from "@mui/material";
import { useEffect } from "react";
import {
  AutocompleteInput,
  FileField,
  FileInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  email,
  minLength,
  required,
} from "react-admin";

import { useWatch, useFormContext } from "react-hook-form";

import { FILE_MAX_SIZE } from "@/utils/constants";
import {
  convertTo12HourFormat,
  isArray,
  userEmployeeInputTextRenderer,
} from "@/utils/helpers";

// import UserEmployeeOptionTextRenderer from "../../UserEmployeeOptionTextRenderer";
import InlineArrayInput from "@/components/common/InlineArrayInput";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";

const VendorForm = () => {
  const values = useWatch();
  const { setValue } = useFormContext();

  useEffect(() => {
    if (!values.v_id) return;

    setValue.change(
      "v_email",
      isArray(values.v_email) ? values.v_email?.map((value) => ({ value })) : []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={1}>
      {values.v_id && (
        <Grid item sm={6} md={3}>
          <TextInput
            source="v_id"
            label="ID"
            variant="outlined"
            helperText={false}
            disabled
            fullWidth
            validate={[required()]}
          />
        </Grid>
      )}
      <Grid item sm={6} md={3}>
        <SelectInput
          source="v_type"
          label="Type"
          variant="outlined"
          helperText={false}
          choices={[
            { id: "local", name: "Local" },
            {
              id: "company",
              name: "Official",
            },
            {
              id: "foreign",
              name: "Foreign",
            },
          ]}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <ReferenceInput
          source="v_user_id"
          label="User"
          variant="outlined"
          helperText={false}
          reference="v1/users"
          validate={[required()]}
          fullWidth
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            helperText={false}
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
            resettable
          />
        </ReferenceInput>
      </Grid>
      <Grid item sm={6} md={3}>
        <ReferenceInput
          source="v_kam_user_id"
          label="KAM"
          variant="outlined"
          helperText={false}
          reference="v1/users"
          validate={[required()]}
          fullWidth
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            helperText={false}
            // optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
            resettable
          />
        </ReferenceInput>
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_name"
          label="Name"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(5, "Name must be at least 5 characters long"),
          ]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_phone"
          label="Phone"
          variant="outlined"
          helperText={false}
          // validate={[
          //     required(),
          //     regex(
          //         MOBILE_NO_VALIDATOR_REGEX,
          //         "Invalid mobile number!"
          //     ),
          // ]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_address"
          label="Address"
          variant="outlined"
          helperText={false}
          // validate={[
          //     required(),
          //     minLength(
          //         5,
          //         "Address must be at least 5 characters long"
          //     ),
          // ]}
          multiline
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_tin"
          label="Tin"
          variant="outlined"
          helperText={false}
          // validate={[
          //     required(),
          //     minLength(5, "Tin must be at least 5 characters long"),
          // ]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_bin"
          label="Bin"
          variant="outlined"
          helperText={false}
          // validate={[
          //     required(),
          //     minLength(5, "Bin must be at least 5 characters long"),
          // ]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_account_details"
          label="Account Details"
          variant="outlined"
          helperText={false}
          // validate={[
          //     required(),
          //     minLength(
          //         5,
          //         "Account details must be at least 5 characters long"
          //     ),
          // ]}
          multiline
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TaxonomiesByVocabularyInput
          fetchKey="payment_mode"
          source="v_payment_method"
          label="Payment Method"
          helperText={false}
          onChange={() => setValue("v_bank_id", undefined)}
          fullWidth
        />
      </Grid>
      {values.v_payment_method === "bank" && (
        <Grid item sm={6} md={3}>
          <ReferenceInput
            source="v_bank_id"
            label="Bank"
            variant="outlined"
            helperText={false}
            reference="v1/bank"
            // validate={[required()]}
            fullWidth
          >
            <AutocompleteInput
              matchSuggestion={() => true}
              // TODO: Refactor this in future
              optionText={(record) => `${record?.b_name} (${record?.b_branch})`}
              options={{
                InputProps: {
                  multiline: true,
                },
              }}
              helperText={false}
              resettable
            />
          </ReferenceInput>
        </Grid>
      )}
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_payment_terms"
          label="Payment Terms"
          variant="outlined"
          helperText={false}
          // validate={[
          //     minLength(
          //         5,
          //         "Payment terms must be at least 5 characters long"
          //     ),
          // ]}
          multiline
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_payment_term_condition"
          label="Payment Term Condition"
          variant="outlined"
          helperText={false}
          // validate={[
          //     minLength(
          //         5,
          //         "Payment term condition must be at least 5 characters long"
          //     ),
          // ]}
          multiline
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <SelectInput
          source="v_cutoff_time"
          label="Cutoff Time"
          variant="outlined"
          helperText={false}
          choices={Array.from({ length: 24 }, (_, i) => ({
            id: i + 1,
            name: convertTo12HourFormat(i + 1),
          }))}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <TextInput
          source="v_due_day"
          label="Due Day"
          variant="outlined"
          helperText={false}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <NumberInput
          source="v_weight"
          label="Weight"
          variant="outlined"
          helperText={false}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={3}>
        <SelectInput
          source="v_status"
          label="Status"
          variant="outlined"
          helperText={false}
          choices={[
            { id: "active", name: "Active" },
            {
              id: "inactive",
              name: "Inactive",
            },
          ]}
          // validate={[required()]}
          fullWidth
        />
      </Grid>

      <Grid item sm={12} md={12}>
        <InlineArrayInput
          source="v_email"
          label="Email"
          disableAdd={values.v_email?.length === 3}
          disableRemove={values.v_email?.length === 1}
        >
          <TextInput
            source="value"
            label="Email"
            variant="outlined"
            helperText={false}
            validate={[email("Invalid email address")]}
            multiline
          />
        </InlineArrayInput>
      </Grid>

      <FileInput
        source="attachedFiles_v_trade_licence"
        label="Trade license"
        accept="image/*, application/pdf"
        maxSize={FILE_MAX_SIZE}
        validate={[required()]}
      >
        <FileField source="src" title="title" target="_blank" />
      </FileInput>

      <FileInput
        source="attachedFiles_v_tin_file"
        label="TIN or BIN"
        accept="image/*, application/pdf"
        validate={[required()]}
        maxSize={FILE_MAX_SIZE}
      >
        <FileField source="src" title="title" target="_blank" />
      </FileInput>

      <FileInput
        source="attachedFiles_v_bank_detail"
        label="Bank details"
        accept="image/*, application/pdf"
        validate={[required()]}
        maxSize={FILE_MAX_SIZE}
      >
        <FileField source="src" title="title" target="_blank" />
      </FileInput>

      <FileInput
        source="attachedFiles_v_agreement"
        label="Agreement File"
        accept="image/*, application/pdf"
        validate={[required()]}
        maxSize={FILE_MAX_SIZE}
      >
        <FileField source="src" title="title" target="_blank" />
      </FileInput>

      <FileInput
        source="attachedFiles_v_mushak"
        accept="image/*, application/pdf"
        label="Mushak 6.3"
        maxSize={FILE_MAX_SIZE}
      >
        <FileField source="src" title="title" target="_blank" />
      </FileInput>

      <FileInput
        source="attachedFiles_v_tds"
        label="TDS Certificate"
        accept="image/*, application/pdf"
        maxSize={FILE_MAX_SIZE}
      >
        <FileField source="src" title="title" target="_blank" />
      </FileInput>
    </Grid>
  );
};

export default VendorForm;
