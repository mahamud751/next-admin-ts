import { SelectInput } from "react-admin";

const UserStatusInput = (props) => (
    <SelectInput
        label="Status"
        choices={[
            { id: "inactive", name: "Inactive" },
            { id: "active", name: "Active" },
            { id: "blocked", name: "Blocked" },
        ]}
        {...props}
    />
);

export default UserStatusInput;
