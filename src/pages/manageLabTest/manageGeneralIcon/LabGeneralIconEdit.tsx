import { FC } from "react";
import {
  Edit,
  EditProps,
  ImageField,
  ImageInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";

const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);

const LabGeneralIconEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga |Lab Test |Icon Edit");
  return (
    <Edit {...rest} mutationMode="pessimistic">
      <SimpleForm
        //    submitOnEnter={false}
        toolbar={<CustomToolbar />}
      >
        <SelectInput
          source="iconType"
          label="Icon Type"
          variant="outlined"
          choices={[
            { id: "description", name: "Description" },
            {
              id: "risk_assessment",
              name: "Risk Assessment",
            },
            { id: "overview", name: "Overview" },
            { id: "ranges", name: "Ranges" },
            {
              id: "requirement_interpretation",
              name: "Test Result Interpretation",
            },
            { id: "sample_types", name: "Sample Types" },
          ]}
        />
        <SelectInput
          variant="outlined"
          source="status"
          choices={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "InActive" },
          ]}
        />
        <TextInput source="sortOrder" variant="outlined" label="Sort Order" />
        <ImageInput
          source="attachedFiles-active"
          label="Active Icon"
          //   accept="image/*"
          maxSize={10000000}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <ImageInput
          source="attachedFiles-default"
          label="Default Icon"
          //   accept="image/*"
          maxSize={10000000}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};

export default LabGeneralIconEdit;
