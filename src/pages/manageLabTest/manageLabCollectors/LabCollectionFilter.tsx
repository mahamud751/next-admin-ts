import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

const LabCollectorFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
    </Filter>
);

export default LabCollectorFilter;
