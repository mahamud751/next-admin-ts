import { FC } from "react";
import {
  Create,
  CreateProps,
  DateInput,
  SimpleForm,
  TextInput,
  minLength,
  required,
} from "react-admin";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import { useDocumentTitle } from "@/hooks";

const HolidayCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Holiday Create");

  return (
    <Create {...props} redirect="list">
      <SimpleForm>
        <TaxonomiesByVocabularyInput
          fetchKey="holiday_type"
          source="h_type"
          label="Type"
          validate={[required()]}
        />
        <DateInput
          source="h_date"
          label="Date"
          variant="outlined"
          helperText={false}
          validate={[required()]}
        />
        <TextInput
          source="h_title"
          label="Title"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(5, "Title must be at least 5 characters long"),
          ]}
        />
      </SimpleForm>
    </Create>
  );
};

export default HolidayCreate;
