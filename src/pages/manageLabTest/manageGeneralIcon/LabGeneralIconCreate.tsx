import { FC } from "react";
import {
  Create,
  CreateProps,
  ImageField,
  ImageInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";

const LabGeneralIconCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga |Lab Test | Items Icon Create");
  return (
    <Create {...props}>
      <SimpleForm
      // redirect="list"
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
    </Create>
  );
};

export default LabGeneralIconCreate;
