import { FC } from "react";
import {
  Create,
  CreateProps,
  DateInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";

const LabScheduleCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga |Lab | Schedule Create");

  return (
    <Create {...props}>
      <SimpleForm
      // redirect="list"
      >
        <TextInput
          source="remarks"
          label="Remarks"
          variant="outlined"
          multiline
        />
        <SelectInput
          variant="outlined"
          source="dateType"
          choices={[{ id: "exclude", name: "Exclude" }]}
        />
        <DateInput
          source="scheduleDate"
          label="ScheduleDate"
          variant="outlined"
          alwaysOn
        />
      </SimpleForm>
    </Create>
  );
};

export default LabScheduleCreate;
