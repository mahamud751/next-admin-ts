import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const ReviewsFilter: FC<FilterProps> = (props) => (
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
                { id: "approved", name: "Approved" },
                { id: "rejected", name: "Rejected" },
                { id: "pending", name: "Pending" },
            ]}
            alwaysOn
        />
        <SelectInput
            source="_rating"
            label="Rating"
            variant="outlined"
            choices={[
                { id: "5", name: "5" },
                { id: "4", name: "4" },
                { id: "3", name: "3" },
                { id: "2", name: "2" },
                { id: "1", name: "1" },
            ]}
            alwaysOn
        />
    </Filter>
);

export default ReviewsFilter;
