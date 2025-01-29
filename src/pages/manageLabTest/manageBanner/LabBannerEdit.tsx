import { FC } from "react";
import {
  Edit,
  EditProps,
  NumberInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  Toolbar,
} from "react-admin";

import { useDocumentTitle } from "../../../hooks";
import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";
const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);
const LabBannerEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Banner |  Edit");
  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <NumberInput source="sortOrder" variant="outlined" label="Sort Order" />
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

export default LabBannerEdit;
