import { FC } from "react";
import {
  Edit,
  EditProps,
  SimpleForm,
  TextInput,
  minLength,
  required,
} from "react-admin";

import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import ShiftTimeInput from "@/components/manageHR/shifts/ShiftTimeInput";
import { useDocumentTitle } from "@/hooks";

const ShiftEdit: FC<EditProps> = (props) => {
  useDocumentTitle("Arogga | Shift Edit");

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...props}
      redirect="list"
    >
      <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
        <TextInput
          source="s_id"
          label="ID"
          variant="outlined"
          helperText={false}
          disabled
        />
        <TextInput
          source="s_title"
          label="Title"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(3, "Title must be at least 3 characters long"),
          ]}
        />
        <ShiftTimeInput
          source="s_time_start"
          label="Start Time"
          variant="outlined"
          helperText={false}
          validate={[required()]}
        />
        <ShiftTimeInput
          source="s_time_end"
          label="End Time"
          variant="outlined"
          helperText={false}
          validate={[required()]}
        />
        <TaxonomiesByVocabularyInput
          fetchKey="shift_type"
          source="s_shift_type"
          label="Type"
          validate={[required()]}
        />
        <FormatedBooleanInput source="s_is_active" label="Active" />
      </SimpleForm>
    </Edit>
  );
};

export default ShiftEdit;
