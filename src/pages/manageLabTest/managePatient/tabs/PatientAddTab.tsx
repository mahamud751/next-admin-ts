import { Box, Typography } from "@mui/material";
import {
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useEditContext,
  useNotify,
} from "react-admin";

import { labTestUploadDataProvider } from "@/dataProvider";
import { useRequest } from "@/hooks";

const PatientAddTab = () => {
  const { record } = useEditContext();
  const notify = useNotify();
  const onSave = async (data) => {
    const formattedPayload = {
      ...data,
      userId: record.id,
    };

    try {
      await labTestUploadDataProvider.create("patient/api/v1/admin/patient", {
        data: formattedPayload,
      });
      notify("Successfully save!", { type: "success" });
    } catch (err) {
      notify(`Something went wrong! Please try again! &${err}`, {
        type: "error",
      });
    }
  };
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton />
    </Toolbar>
  );
  const { data: realtion } = useRequest(
    "/patient/api/v1/patient/relation",
    {},
    { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
  );
  const selectRelation = realtion?.map((category) => ({
    id: category?.key,
    name: category?.label?.en,
  }));
  return (
    <SimpleForm save={onSave} toolbar={<CustomToolbar />}>
      <Box>
        <Typography variant="h6" color="initial">
          Add Patient
        </Typography>
        <TextInput
          source="name"
          label="Name"
          variant="outlined"
          fullWidth
          optionText="s"
        />
        <TextInput source="age" label="Age" variant="outlined" fullWidth />

        <SelectInput
          variant="outlined"
          fullWidth
          source="gender"
          choices={[
            { id: "male", name: "Male" },
            { id: "female", name: "Female" },
            { id: "other", name: "Others" },
          ]}
        />

        <SelectInput
          variant="outlined"
          label="Realtion"
          source="relation"
          choices={selectRelation}
          fullWidth
          alwaysOn
        />
        <TextInput
          source="weight"
          label="Weight"
          variant="outlined"
          fullWidth
        />
      </Box>
    </SimpleForm>
  );
};

export default PatientAddTab;
