import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

const MenuItemFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
    </Filter>
);

export default MenuItemFilter;
