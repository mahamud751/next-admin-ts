import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const DiscountFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <SelectInput
            source="_status"
            label="Status"
            variant="outlined"
            choices={[
                { id: "active", name: "Active" },
                { id: "inactive", name: "Inactive" },
            ]}
            alwaysOn
        />
        <SelectInput
            source="_discount_type"
            label="Discount Type"
            variant="outlined"
            choices={[
                { id: "coupon", name: "Coupon" },
                { id: "offer", name: "Offer" },
            ]}
            alwaysOn
        />
        <SelectInput
            source="_type"
            label="Type"
            variant="outlined"
            choices={[
                { id: "fixed", name: "Fixed" },
                { id: "percentage", name: "Percentage" },
            ]}
            alwaysOn
        />
        <TextInput source="_name" label="Name" variant="outlined" />
    </Filter>
);

export default DiscountFilter;
