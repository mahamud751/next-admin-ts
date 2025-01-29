import { FC } from "react";
import {
  Edit,
  EditProps,
  SaveButton,
  SelectInput,
  SimpleForm,
  Toolbar,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";

const LabScheduleEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Lab | Schedule Edit");
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton />
    </Toolbar>
  );
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
        // submitOnEnter={false}
        toolbar={<CustomToolbar />}
      >
        <SelectInput
          variant="outlined"
          source="status"
          choices={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "InActive" },
          ]}
        />
      </SimpleForm>
    </Edit>
  );
};

export default LabScheduleEdit;
