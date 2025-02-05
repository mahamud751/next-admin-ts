import { SelectInput } from "react-admin";

const WarehouseInput = (props) => (
  <SelectInput
    label="Warehouse"
    helperText={false}
    choices={[{ id: 1, name: "Dhaka Main" }]}
    initialValue={1}
    disabled
    {...props}
  />
);

export default WarehouseInput;
