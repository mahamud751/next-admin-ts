import { SelectInput } from "react-admin";

const YearSelectInput = (props) => {
  const currentYear = new Date().getFullYear();

  const choices = [];

  for (let year = 2019; year <= currentYear; year++) {
    choices.push({ id: year, name: year.toString() });
  }

  return (
    <SelectInput
      label="Year"
      variant="outlined"
      helperText={false}
      choices={choices}
      {...props}
    />
  );
};

export default YearSelectInput;
