import { AutocompleteInput, ReferenceInput, required } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

const ShiftScheduleInput = (props) => {
  const { setValue } = useFormContext();
  const values = useWatch();

  return (
    <ReferenceInput
      source="sb_shift_schedule_id"
      label="Shift Schedule"
      helperText={false}
      reference="v1/shiftSchedule"
      filter={{
        _shift_type: values?.sb_shift_type,
        _from_date: values?.filterByDate,
        _to_date: values?.filterByDate,
      }}
      onChange={() => setValue("sb_deliveryman_id", undefined)}
      validate={[required()]}
      {...props}
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionText={(item) => `${item?.s_title} (${item?.ss_date})`}
      />
    </ReferenceInput>
  );
};

export default ShiftScheduleInput;
