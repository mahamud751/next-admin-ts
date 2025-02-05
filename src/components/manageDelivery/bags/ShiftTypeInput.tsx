import { SelectInput, required } from "react-admin";
import { useFormContext } from "react-hook-form";

const ShiftTypeInput = (props) => {
  const { setValue } = useFormContext();

  return (
    <SelectInput
      source="sb_shift_type"
      label="Shift Type"
      helperText={false}
      choices={[
        { id: "regular", name: "Regular" },
        { id: "express", name: "Express" },
      ]}
      onChange={() => {
        setValue("sb_shift_schedule_id", undefined);
        setValue("sb_deliveryman_id", undefined);
        setValue("shipmentId", undefined);
      }}
      validate={[required()]}
      {...props}
    />
  );
};

export default ShiftTypeInput;
