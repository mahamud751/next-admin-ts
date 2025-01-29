import { BooleanInput } from "react-admin";

const FormatedBooleanInput = (props) => (
  <BooleanInput
    helperText={false}
    format={(value: number) => !!value}
    parse={(value: number) => (!!value ? 1 : 0)}
    {...props}
  />
);

export default FormatedBooleanInput;
