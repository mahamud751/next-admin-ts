import { SelectInput } from "react-admin";

const JobStatusInput = (props) => (
    <SelectInput
        label="Status"
        defaultValue="Open"
        choices={[
            { id: "Open", name: "Open" },
            { id: "Closed", name: "Closed" },
        ]}
        {...props}
    />
);

export default JobStatusInput;
