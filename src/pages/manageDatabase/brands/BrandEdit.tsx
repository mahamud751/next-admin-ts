import { FC } from "react";
import {
  AutocompleteInput,
  Edit,
  EditProps,
  ReferenceInput,
  SimpleForm,
  TextInput,
  TransformData,
  minLength,
  required,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { groupBy, userEmployeeInputTextRenderer } from "@/utils/helpers";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const BrandEdit: FC<EditProps> = ({ hasEdit, ...rest }) => {
  useDocumentTitle("Arogga | Brand Edit");

  const transform: TransformData = ({ productType, ptbm, ...rest }) => {
    const groupByProductType = groupBy(ptbm, (data) => data.ptbm_type);

    return {
      ...rest,
      ptbm: productType?.map((ptbm_type) => ({
        ptbm_id: groupByProductType?.[ptbm_type]?.[0].ptbm_id,
        ptbm_type,
      })),
    };
  };

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
      transform={transform}
    >
      <SimpleForm
        //@ts-ignore
        redirect="list"
        submitOnEnter={false}
        initialValues={({ ptbm }) => ({
          productType: ptbm?.map(({ ptbm_type }) => ptbm_type),
        })}
        toolbar={
          <SaveDeleteToolbar
            isSave
            isDelete={rest.permissions?.includes("productBrandDelete")}
          />
        }
      >
        <TextInput
          source="pb_id"
          label="ID"
          variant="outlined"
          helperText={false}
          disabled
        />
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
          source="productType"
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
    </Edit>
  );
};

export default BrandEdit;
