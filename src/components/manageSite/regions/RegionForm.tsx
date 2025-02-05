import { Box } from "@mui/material";
import { SelectArrayInput, TextInput, maxLength, required } from "react-admin";
import { useWatch } from "react-hook-form";

const RegionForm = () => {
  const values = useWatch();
  console.log(values);

  return (
    <Box display="flex" flexDirection="column" width={256}>
      {!!values?.id && (
        <TextInput
          source="r_id"
          label="ID"
          variant="outlined"
          helperText={false}
          readOnly
        />
      )}
      <TextInput
        source="r_name"
        label="Name"
        variant="outlined"
        helperText={false}
        validate={[
          required(),
          maxLength(25, "Name can be at max 25 characters long"),
        ]}
      />
      <SelectArrayInput
        source="regionType"
        label="Type"
        variant="outlined"
        helperText={false}
        choices={[
          { id: "app", name: "App" },
          { id: "web", name: "Web" },
          { id: "web_app", name: "Web App" },
        ]}
        validate={[required()]}
      />
      <TextInput
        source="r_description"
        label="Description"
        variant="outlined"
        helperText={false}
        validate={[
          required(),
          maxLength(100, "Description can be at max 100 characters long"),
        ]}
        minRows={2}
        multiline
      />
    </Box>
  );
};

export default RegionForm;
