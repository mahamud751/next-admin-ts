import { SelectInput } from "react-admin";

const AddressTypeInput = (props) => (
    <SelectInput
        label="Address Type"
        choices={[
            { id: "Home", name: "Home" },
            { id: "Office", name: "Office" },
            { id: "Hometown", name: "Hometown" },
        ]}
        {...props}
    />
);

export default AddressTypeInput;
