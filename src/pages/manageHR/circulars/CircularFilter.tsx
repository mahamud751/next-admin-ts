import { FC } from "react";
import { Filter, FilterProps, SelectInput } from "react-admin";

const CircularFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <SelectInput
            source="_status"
            label="Status"
            variant="outlined"
            choices={[
                { id: "published", name: "Published" },
                { id: "unpublished", name: "Unpublished" },
            ]}
            alwaysOn
        />
    </Filter>
);

export default CircularFilter;
