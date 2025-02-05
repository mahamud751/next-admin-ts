import { FC } from "react";
import {
    AutocompleteInput,
    Filter,
    FilterProps,
    ReferenceInput,
    SelectInput,
    TextInput,
} from "react-admin";

import UserEmployeeOptionTextRenderer from "../../../components/UserEmployeeOptionTextRenderer";
import { userEmployeeInputTextRenderer } from "../../../utils/helpers";

const EmployeeInfoFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            label="Search"
            source="_search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <ReferenceInput
            source="_e_id"
            label="Employee"
            variant="outlined"
            reference="v1/employee"
        >
            <AutocompleteInput
                matchSuggestion={() => true}
                optionValue="e_id"
                helperText={false}
                optionText={<UserEmployeeOptionTextRenderer />}
                inputText={userEmployeeInputTextRenderer}
                resettable
            />
        </ReferenceInput>
        <SelectInput
            source="_approved"
            label="Status"
            variant="outlined"
            choices={[
                { id: 1, name: "Approved" },
                { id: 0, name: "Not Approved" },
            ]}
        />
    </Filter>
);

export default EmployeeInfoFilter;
