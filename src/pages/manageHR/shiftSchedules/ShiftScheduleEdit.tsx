import { FC } from "react";
import {
  AutocompleteInput,
  DateInput,
  Edit,
  EditProps,
  ReferenceInput,
  SimpleForm,
  required,
} from "react-admin";

import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import { useDocumentTitle } from "@/hooks";

const ShiftScheduleEdit: FC<EditProps> = (props) => {
  useDocumentTitle("Arogga | Shift Schedule Edit");

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
        <DateInput
          source="ss_date"
          label="Date"
          variant="outlined"
          helperText={false}
          validate={[required()]}
        />
        <ReferenceInput
          source="ss_s_id"
          label="Shift"
          variant="outlined"
          helperText={false}
          reference="v1/shift"
          sort={{ field: "s_id", order: "DESC" }}
          filterToQuery={(searchText) => ({
            _branch: searchText,
          })}
          isRequired
        >
          <AutocompleteInput optionValue="s_id" optionText="s_title" />
        </ReferenceInput>
        <FormatedBooleanInput source="ss_is_active" label="Active" />
      </SimpleForm>
    </Edit>
  );
};

export default ShiftScheduleEdit;
