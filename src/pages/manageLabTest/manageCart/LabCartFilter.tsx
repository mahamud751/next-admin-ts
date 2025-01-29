import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const LabCartFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <SelectInput
            variant="outlined"
            label="Cart Status"
            source="cartStatus"
            choices={[
                { id: "current", name: "Current" },
                { id: "ordered", name: "Ordered" },
            ]}
            alwaysOn
        />
    </Filter>
);

export default LabCartFilter;
