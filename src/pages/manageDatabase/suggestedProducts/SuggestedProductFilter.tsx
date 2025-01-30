import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const SuggestedProductFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            alwaysOn
        />
        <SelectInput
            source="_has_product"
            label="Product Exists?"
            defaultValue="no"
            choices={[
                { id: "yes", name: "Yes" },
                { id: "no", name: "No" },
                { id: "all", name: "All" },
            ]}
            variant="outlined"
        />
    </Filter>
);

export default SuggestedProductFilter;
