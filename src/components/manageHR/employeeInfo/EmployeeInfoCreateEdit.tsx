import { Grid } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  DateInput,
  FileField,
  FileInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
} from "react-admin";
import { useFormContext } from "react-hook-form";

import { FILE_MAX_SIZE } from "@/utils/constants";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

type EmployeeInfoCreateEditProps = {
  page: "create" | "edit";
};

const EmployeeInfoCreateEdit: FC<EmployeeInfoCreateEditProps> = ({ page }) => {
  const { setValue } = useFormContext();

  return (
    <>
      <ReferenceInput
        source="ei_e_id"
        label="Employee"
        variant="outlined"
        helperText={false}
        reference="v1/employee"
        sort={{ field: "e_id", order: "DESC" }}
        onChange={() => setValue("ei_bank_id", undefined)}
        isRequired
      >
        <AutocompleteInput
          matchSuggestion={() => true}
          optionValue="e_id"
          optionText={<UserEmployeeOptionTextRenderer />}
          inputText={userEmployeeInputTextRenderer}
          readOnly={page !== "create"}
        />
      </ReferenceInput>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4}>
          <DateInput
            source="ei_date_of_birth"
            label="Date of Birth"
            variant="outlined"
            helperText={false}
            validate={[required()]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SelectInput
            source="ei_blood_group"
            label="Blood Group"
            variant="outlined"
            helperText={false}
            choices={[
              { id: "A+", name: "A+" },
              { id: "A-", name: "A-" },
              { id: "B+", name: "B+" },
              { id: "B-", name: "B-" },
              { id: "O+", name: "O+" },
              { id: "O-", name: "O-" },
              { id: "AB+", name: "AB+" },
              { id: "AB-", name: "AB-" },
            ]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextInput
            source="ei_residential_address"
            label="Residential Address"
            variant="outlined"
            helperText={false}
            validate={[required()]}
            minRows={2}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4}>
          <TextInput
            source="ei_birth_certificate"
            label="Birth Certificate Number"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FileInput
            source="attachedFiles_ei_birth_certificate_photo"
            label="Files"
            maxSize={FILE_MAX_SIZE}
            helperText={false}
            multiple
          >
            <FileField source="src" title="title" />
          </FileInput>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4}>
          <TextInput
            source="ei_nid"
            label="NID"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FileInput
            source="attachedFiles_ei_nid_photo"
            label="Files"
            accept={{
              "application/pdf": [".pdf"],
              "image/*": [".jpg", ".jpeg", ".png", ".gif"],
            }}
            maxSize={FILE_MAX_SIZE}
            helperText={false}
            multiple
          >
            <FileField source="src" title="title" />
          </FileInput>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4}>
          <TextInput
            source="ei_tin"
            label="TIN"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FileInput
            source="attachedFiles_ei_tin_photo"
            label="Files"
            accept={{
              "application/pdf": [".pdf"],
              "image/*": [".jpg", ".jpeg", ".png", ".gif"],
            }}
            maxSize={FILE_MAX_SIZE}
            helperText={false}
            multiple
          >
            <FileField source="src" title="title" />
          </FileInput>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4}>
          <TextInput
            source="ei_license"
            label="Driving License"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FileInput
            source="attachedFiles_ei_license_photo"
            label="Files"
            accept={{
              "application/pdf": [".pdf"],
              "image/*": [".jpg", ".jpeg", ".png", ".gif"],
            }}
            maxSize={FILE_MAX_SIZE}
            helperText={false}
            multiple
          >
            <FileField source="src" title="title" />
          </FileInput>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4}>
          <TextInput
            source="ei_passport"
            label="Passport"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FileInput
            source="attachedFiles_ei_passport_photo"
            label="Files"
            accept={{
              "application/pdf": [".pdf"],
              "image/*": [".jpg", ".jpeg", ".png", ".gif"],
            }}
            maxSize={FILE_MAX_SIZE}
            helperText={false}
            multiple
          >
            <FileField source="src" title="title" />
          </FileInput>
        </Grid>
      </Grid>
      <FileInput
        source="attachedFiles_ei_cheque_photo"
        label="Cheque Files"
        accept={{
          "application/pdf": [".pdf"],
          "image/*": [".jpg", ".jpeg", ".png", ".gif"],
        }}
        maxSize={FILE_MAX_SIZE}
        helperText={false}
        multiple
      >
        <FileField source="src" title="title" />
      </FileInput>
    </>
  );
};

export default EmployeeInfoCreateEdit;
