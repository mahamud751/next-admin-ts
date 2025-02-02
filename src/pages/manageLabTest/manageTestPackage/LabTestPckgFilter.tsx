import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const LabTestPckgFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            label="Search"
            source="name"
            variant="outlined"
            resettable
            alwaysOn
        />
        <SelectInput
            source="itemType"
            label="Item Type"
            variant="outlined"
            choices={[
                { id: "package", name: "Package" },
                { id: "test", name: "Test" },
            ]}
            alwaysOn
        />
        <SelectInput
            source="status"
            label="Status"
            variant="outlined"
            choices={[
                { id: "active", name: "Active" },
                { id: "inactive", name: "Inactive" },
            ]}
            alwaysOn
        />
    </Filter>
);

export default LabTestPckgFilter;
