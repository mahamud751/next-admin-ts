import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const RegionFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <SelectInput
            source="_type"
            label="Type"
            variant="outlined"
            choices={[
                { id: "app", name: "App" },
                { id: "web", name: "Web" },
                { id: "web_app", name: "Web App" },
            ]}
            alwaysOn
        />
    </Filter>
);

export default RegionFilter;
