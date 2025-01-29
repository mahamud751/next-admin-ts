import { FC } from "react";
import {
  Edit,
  EditProps,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  TranslatableInputs,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";
const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);
const LabCategoryEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Category |  Edit");
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
        <TranslatableInputs locales={["en", "bn"]}>
          <TextInput source="name" variant="outlined" />
        </TranslatableInputs>
        <SelectInput
          variant="outlined"
          source="sectionTag"
          choices={[
            { id: "health_concern", name: "Health Concern" },
            { id: "health_package", name: "Health Package" },
            { id: "life_style", name: "Life Style" },
            { id: "vital_organs", name: "Vital Organs" },
            { id: "checkup_men", name: "Checkup Men" },
            { id: "checkup_women", name: "Checkup Women" },
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
        <AroggaMovableImageInput
          source="attachedFiles-imageUrl"
          dimentionValidation
        />
      </SimpleForm>
    </Edit>
  );
};

export default LabCategoryEdit;
