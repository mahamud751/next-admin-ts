import { Paper } from "@mui/material";
import { SimpleForm, Title } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import SwitchTo from "@/components/switchTo/SwitchTo";

const SwitchToPage = () => {
  useDocumentTitle("Arogga | Switch User");

  return (
    <Paper style={{ marginTop: 25 }}>
      <Title title="Switch User" />
      <SimpleForm toolbar={null}>
        <SwitchTo />
      </SimpleForm>
    </Paper>
  );
};

export default SwitchToPage;
