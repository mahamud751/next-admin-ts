import { FC } from "react";
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  minLength,
  required,
} from "react-admin";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import ShiftTimeInput from "@/components/manageHR/shifts/ShiftTimeInput";
import { useDocumentTitle } from "@/hooks";

const ShiftCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Shift Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
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
      </SimpleForm>
    </Create>
  );
};

export default ShiftCreate;
