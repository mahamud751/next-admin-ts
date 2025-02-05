import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
type Props = {
  label?: string;
  value?: string | number;
  onChange?: (e: any) => void;
};

export default function SelectCase({ label, value, onChange }: Props) {
  return (
    <FormControl variant="outlined" size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">
        {label ?? "Select Case"}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={onChange}
      >
        <MenuItem value="payLater">Paid later</MenuItem>
        <MenuItem value={"lostAndDamage"}>Lost & damage</MenuItem>
        <MenuItem value={"productReturn"}>Product returned</MenuItem>
        <MenuItem value={30}>Unsolved Case</MenuItem>
      </Select>
    </FormControl>
  );
}
