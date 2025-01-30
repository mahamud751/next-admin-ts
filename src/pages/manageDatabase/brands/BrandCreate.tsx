import { FC } from "react";
import {
  AutocompleteInput,
  Create,
  CreateProps,
  ReferenceInput,
  SimpleForm,
  TextInput,
  TransformData,
  minLength,
  required,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const BrandCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Brand Create");

  const transform: TransformData = ({ ptbm, ...rest }) => ({
    ...rest,
    ptbm: ptbm?.map((ptbm_type) => ({ ptbm_type })),
  });

  return (
    <Create {...rest} transform={transform} redirect="list">
      <SimpleForm>
        <TextInput
          source="pb_name"
          label="Name"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(2, "Name must be at least 2 characters long"),
          ]}
        />
        <ReferenceInput
          source="pb_uid"
          label="User"
          variant="outlined"
          reference="v1/users"
          helperText={false}
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionValue="u_id"
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
            // resettable
          />
        </ReferenceInput>
        <TextInput
          source="pb_info"
          label="Information"
          variant="outlined"
          helperText={false}
          validate={[
            minLength(2, "Information must be at least 2 characters long"),
          ]}
          minRows={2}
          multiline
        />
        <TaxonomiesByVocabularyInput
          fetchKey="payment_mode"
          source="pb_payment_method"
          label="Payment Method"
          helperText={false}
          title
        />
        <TextInput
          source="pb_payment_term_condition"
          label="Payment Term & Condition"
          variant="outlined"
          helperText={false}
          minRows={2}
          multiline
        />
        <TextInput
          source="pb_payment_terms"
          label="Payment Terms"
          variant="outlined"
          helperText={false}
          minRows={2}
          multiline
        />
        <FormatedBooleanInput source="pb_is_feature" label="Feature?" />
        <TaxonomiesByVocabularyInput
          fetchKey="product_type"
          inputType="checkboxGroupInput"
          source="ptbm"
          label="Allowed Product Type"
          helperText={false}
          style={{ width: "100%" }}
        />
        <AroggaMovableImageInput
          source="attachedFiles_pb_logo"
          label="Logo (400*400 px)"
        />
        <AroggaMovableImageInput
          source="attachedFiles_pb_banner"
          label="Banner (1800*945 px)"
        />
      </SimpleForm>
    </Create>
  );
};

export default BrandCreate;
