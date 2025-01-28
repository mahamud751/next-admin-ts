import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

const ApprovalCapFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="name"
            label="Search By Name"
            variant="outlined"
            resettable
            alwaysOn
        />
    </Filter>
);

export default ApprovalCapFilter;
