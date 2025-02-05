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
import YearSelectInput from "../../../components/YearSelectInput";
import { monthsWithId } from "../../../utils/constants";
import { userEmployeeInputTextRenderer } from "../../../utils/helpers";

const EmployeeLoanFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            label="Search"
            source="_search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <ReferenceInput
            source="_employee_id"
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
        <YearSelectInput source="_year" variant="outlined" />
        <SelectInput
            source="_month"
            label="Month"
            variant="outlined"
            choices={monthsWithId}
        />
    </Filter>
);

export default EmployeeLoanFilter;
