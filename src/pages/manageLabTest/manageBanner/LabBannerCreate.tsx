import { FC } from "react";
import {
  Create,
  CreateProps,
  ImageField,
  ImageInput,
  NumberInput,
  SimpleForm,
} from "react-admin";

import { useDocumentTitle } from "../../../hooks";
import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";

const LabBannerCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga |Lab Banner Create");

  return (
    <Create {...rest}>
      <SimpleForm>
        <NumberInput source="sortOrder" variant="outlined" label="Sort Order" />
        <AroggaMovableImageInput
          source="attachedFiles-imageUrl"
          dimentionValidation
        />
        {/* <ImageInput
          source="attachedFiles-imageUrl"
          label="Pictures (3000*3000 px)"
          accept="image/*"
          maxSize={10000000}
        >
          <ImageField source="src" title="title" />
        </ImageInput> */}
      </SimpleForm>
    </Create>
  );
};

export default LabBannerCreate;
