import { Grid } from "@mui/material";
import { FC, useEffect } from "react";
import {
  AutocompleteInput,
  Edit,
  EditProps,
  FileField,
  FileInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  minLength,
  required,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { useDocumentTitle } from "@/hooks";
import { FILE_MAX_SIZE } from "@/utils/constants";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import LocationInput from "@/components/common/LocationInput";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const PharmacyEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | B2B Edit");

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
    >
      <SimpleForm
        toolbar={
          <SaveDeleteToolbar
            isSave
            isDelete={permissions?.includes("pharmacyDelete")}
          />
        }
      >
        <FormStateContent />
      </SimpleForm>
    </Edit>
  );
};

const FormStateContent = () => {
  const { values } = useFormState(); // Now safely inside form context
  const form = useForm();

  useEffect(() => {
    if (values.p_business_type === "pharmacy") {
      form.change("p_trade_license_no", undefined);
      form.change("attachedFiles_p_trade_license_file", undefined);
    }

    if (values.p_business_type === "others") {
      form.change("p_drug_license_no", undefined);
      form.change("attachedFiles_p_drug_license_file", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.p_business_type]);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <TextInput
            source="p_name"
            label="Name"
            variant="outlined"
            helperText={false}
            fullWidth
            validate={[
              required(),
              minLength(4, "B2B name must be at least 4 characters long"),
            ]}
          />
          <ReferenceInput
            source="p_user_id"
            label="User"
            variant="outlined"
            helperText={false}
            reference="v1/users"
            fullWidth
          >
            <AutocompleteInput
              matchSuggestion={() => true}
              optionValue="u_id"
              optionText={<UserEmployeeOptionTextRenderer />}
              inputText={userEmployeeInputTextRenderer}
              //   resettable
            />
          </ReferenceInput>
          <LocationInput
            source="p_location_id"
            label="Location"
            variant="outlined"
            helperText={false}
            fullWidth
          />
          <TextInput
            source="p_address"
            label="Address"
            variant="outlined"
            helperText={false}
            minRows={2}
            multiline
            fullWidth
          />
          <SelectInput
            source="p_status"
            label="Status"
            variant="outlined"
            choices={[
              { id: "pending", name: "Pending" },
              { id: "approved", name: "Approved" },
              { id: "rejected", name: "Rejected" },
              { id: "blocked", name: "Blocked" },
            ]}
            fullWidth
            validate={[required()]}
          />
          <SelectInput
            source="p_business_type"
            label="Business Type"
            variant="outlined"
            helperText={false}
            choices={[
              { id: "pharmacy", name: "Pharmacy" },
              { id: "others", name: "Others" },
            ]}
            validate={[required()]}
            fullWidth
          />
        </Grid>
      </Grid>
      {values.p_business_type === "pharmacy" && (
        <>
          <Grid item xs={3}>
            <TextInput
              source="p_drug_license_no"
              label="Drug License No"
              variant="outlined"
              helperText={false}
              fullWidth
              validate={[
                required(),
                minLength(
                  6,
                  "Drug license no must be at least 6 characters long"
                ),
              ]}
            />
          </Grid>

          <FileInput
            source="attachedFiles_p_drug_license_file"
            label="Drug License Files"
            accept={{
              "application/pdf": [".pdf"],
              "image/*": [".jpg", ".jpeg", ".png", ".gif"],
            }}
            maxSize={FILE_MAX_SIZE}
            options={{ maxSize: 5 }}
            helperText={false}
            validate={[required()]}
            multiple
          >
            <FileField source="src" title="title" />
          </FileInput>
        </>
      )}

      {values.p_business_type === "others" && (
        <>
          <Grid item xs={3}>
            <TextInput
              source="p_trade_license_no"
              label="Trade License No"
              variant="outlined"
              helperText={false}
              validate={[required()]}
              fullWidth
            />
          </Grid>

          <FileInput
            source="attachedFiles_p_trade_license_file"
            label="Trade License Files"
            // accept="image/*, application/pdf"
            maxSize={FILE_MAX_SIZE}
            options={{ maxSize: 5 }}
            helperText={false}
            validate={[required()]}
            multiple
          >
            <FileField source="src" title="title" />
          </FileInput>
        </>
      )}
    </>
  );
};
export default PharmacyEdit;
