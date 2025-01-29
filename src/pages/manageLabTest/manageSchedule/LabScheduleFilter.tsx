import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

const LabScheduleFilter: FC<FilterProps> = (props) => (
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

export default LabScheduleFilter;
