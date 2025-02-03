import { FC } from "react";
import {
  Edit,
  EditProps,
  SimpleForm,
  TextInput,
  minLength,
  required,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";

const VocabularyEdit: FC<EditProps> = (props) => {
  useDocumentTitle("Arogga | Vocabulary Edit");

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...props}
    >
      <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
        <TextInput
          source="v_id"
          label="ID"
          variant="outlined"
          helperText={false}
          disabled
        />
        <TextInput
          source="v_title"
          label="Title"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(5, "Title must be at least 5 characters long"),
          ]}
          multiline
        />
        <TextInput
          source="v_description"
          label="Description"
          variant="outlined"
          helperText={false}
          minRows={2}
          multiline
        />
      </SimpleForm>
    </Edit>
  );
};

export default VocabularyEdit;
