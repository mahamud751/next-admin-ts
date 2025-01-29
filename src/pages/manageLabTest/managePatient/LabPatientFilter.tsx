import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

const LabPatientFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="name"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
    </Filter>
);

export default LabPatientFilter;
