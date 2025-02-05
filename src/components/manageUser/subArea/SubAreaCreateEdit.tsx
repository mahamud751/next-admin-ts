import LocationInput from "@/components/common/LocationInput";
import { Grid } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
} from "react-admin";

type SubAreaCreateEditProps = {
  page: "create" | "edit";
};

const SubAreaCreateEdit: FC<SubAreaCreateEditProps> = ({ page }) => {
  return (
    <>
      <Grid item lg={4}>
        <TextInput
          source="sa_title"
          label="Title"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <LocationInput
          source="sa_l_id"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        {/* <TextInput
                    source="sa_zone"
                    label="Zone"
                    variant="outlined"
                    fullWidth
                /> */}
        <ReferenceInput
          source="sa_zone_id"
          label="Zone"
          reference="v1/zone"
          variant="outlined"
          fullWidth
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionText={(value) => (value && value?.z_name) || ""}
          />
        </ReferenceInput>
      </Grid>
      <Grid item lg={4}>
        {/* <TextInput
                    source="sa_exp_zone"
                    label="Exp Zone"
                    variant="outlined"
                    fullWidth
                /> */}
        <ReferenceInput
          source="sa_exp_zone"
          label="Exp Zone"
          reference="v1/zone"
          variant="outlined"
          fullWidth
          filter={{ _type: "express" }}
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionText={(value) => (value && value?.z_name) || ""}
          />
        </ReferenceInput>
      </Grid>
      <Grid item lg={4}>
        <SelectInput
          source="sa_is_free_delivery"
          label="Free Delivery"
          variant="outlined"
          choices={[
            { id: "1", name: "Yes" },
            { id: "0", name: "No" },
          ]}
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item lg={4} style={{ marginTop: 20 }}>
        <SelectInput
          source="sa_status"
          label="Status"
          variant="outlined"
          choices={[
            { id: "1", name: "Active" },
            { id: "0", name: "InActive" },
          ]}
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item lg={4} style={{ marginTop: 20 }}>
        <TextInput
          source="sa_comment"
          label="Comment"
          variant="outlined"
          fullWidth
        />
      </Grid>
    </>
  );
};

export default SubAreaCreateEdit;
