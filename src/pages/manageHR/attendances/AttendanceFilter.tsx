import {
    AutocompleteInput,
    DateInput,
    Filter,
    ReferenceInput,
    SelectInput,
    TextInput,
    minValue,
} from "react-admin";

import FormatedBooleanInput from "../../../components/FormatedBooleanInput";
import TaxonomiesByVocabularyInput from "../../../components/TaxonomiesByVocabularyInput";
import TreeDropdownInput from "../../../components/TreeDropdownInput";
import UserEmployeeOptionTextRenderer from "../../../components/UserEmployeeOptionTextRenderer";
import { userEmployeeInputTextRenderer } from "../../../utils/helpers";

const AttendanceFilter = ({ children, ...props }) => {
    const validateDateRange: any = (value: any, allValues: any) => {
        if (
            value &&
            allValues &&
            allValues["_attendance_date"] &&
            value < allValues["_attendance_date"]
        ) {
            //   throw new ValidationError('End date must be after start date');
            return "End date must be greater than attendance date";
        }
    };

    return (
        <Filter {...props}>
            <TextInput
                source="_search"
                label="Search"
                variant="outlined"
                alwaysOn
            />
            <DateInput
                source="_attendance_date"
                label="Attendance Date"
                variant="outlined"
                validate={[minValue("2020-01-01")]}
            />
            <DateInput
                source="_attendance_date_end"
                label="Attendance Date End"
                validate={[validateDateRange]}
                variant="outlined"
            />
            <TaxonomiesByVocabularyInput
                fetchKey="shift_type"
                source="_shift_type"
                label="Shift Type"
                alwaysOn
            />
            <ReferenceInput
                source="_employee_id"
                label="Employee"
                variant="outlined"
                reference="v1/employee"
                sort={{ field: "e_id", order: "DESC" }}
            >
                <AutocompleteInput
                    matchSuggestion={() => true}
                    optionValue="e_id"
                    optionText={<UserEmployeeOptionTextRenderer />}
                    inputText={userEmployeeInputTextRenderer}
                    resettable
                />
            </ReferenceInput>
            {props.filterValues._shift_type && (
                <ReferenceInput
                    source="_s_id"
                    label="Shift"
                    variant="outlined"
                    reference="v1/shift"
                    sort={{ field: "s_id", order: "DESC" }}
                    filter={{ _shift_type: props.filterValues._shift_type }}
                    alwaysOn
                >
                    <AutocompleteInput
                        matchSuggestion={() => true}
                        optionValue="s_id"
                        optionText="s_title"
                        resettable
                    />
                </ReferenceInput>
            )}
            <TreeDropdownInput
                reference="/v1/taxonomiesByVocabulary/department"
                source="_department"
                label="Department"
                variant="outlined"
                keyId="t_id"
                keyParent="t_parent_id"
                optionValue="t_machine_name"
                optionTextValue="t_title"
                alwaysOn
            />
            {props.filterValues._department && (
                <FormatedBooleanInput
                    source="_include_child_department"
                    label="Include Child Department"
                    alwaysOn
                />
            )}
            <TaxonomiesByVocabularyInput
                fetchKey="attendance_status"
                source="_attendance_status"
                label="Status"
            />
            <SelectInput
                source="_attendance_status_type"
                label="Status Type"
                choices={[
                    { id: "active", name: "Active" },
                    { id: "leave", name: "Leave" },
                    { id: "holiday", name: "Holiday" },
                    { id: "leave,holiday", name: "Leave+Holiday" },
                ]}
            />
        </Filter>
    );
};

export default AttendanceFilter;
