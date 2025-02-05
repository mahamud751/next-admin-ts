import { FC } from "react";
import { SelectInput, TextInput, required } from "react-admin";
import { Grid } from "@mui/material";

type ThreePlListCreateEditProps = {
  page: "create" | "edit";
};
const ThreePlListCreateEdit: FC<ThreePlListCreateEditProps> = ({ page }) => {
  return (
    <>
      <Grid item lg={4}>
        <TextInput
          source="tc_name"
          label="Name"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <SelectInput
          source="tc_status"
          label="Status"
          variant="outlined"
          choices={[
            { name: "Active", id: "1" },
            { name: "Inactive", id: "0" },
          ]}
          validate={[required()]}
          helperText={false}
          fullWidth
        />
      </Grid>
    </>
  );
};

export default ThreePlListCreateEdit;
