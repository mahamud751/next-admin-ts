import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

const RequestStockFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            alwaysOn
        />
    </Filter>
);

export default RequestStockFilter;
