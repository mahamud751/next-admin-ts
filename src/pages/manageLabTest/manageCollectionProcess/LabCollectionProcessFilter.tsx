import { FC } from "react";
import { Filter, FilterProps, SelectInput } from "react-admin";

const LabCollectionProcessFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <SelectInput
            source="status"
            variant="outlined"
            choices={[
                { id: "active", name: "Active" },
                { id: "inactive", name: "Inactive" },
            ]}
            alwaysOn
        />
    </Filter>
);

export default LabCollectionProcessFilter;
