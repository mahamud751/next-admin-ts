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

const MenuFilter: FC<FilterProps> = (props) => (
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
                { id: 1, name: "Active" },
                { id: 0, name: "Inactive" },
            ]}
            alwaysOn
        />
        <TextInput
            source="_machine_name"
            label="Machine Name"
            variant="outlined"
            resettable
            alwaysOn
        />
        <ReferenceInput
            source="_created_by"
            label="Created By"
            variant="outlined"
            reference="v1/users"
        >
            <AutocompleteInput
                matchSuggestion={() => true}
                helperText={false}
                optionText={<UserEmployeeOptionTextRenderer />}
                inputText={userEmployeeInputTextRenderer}
                resettable
            />
        </ReferenceInput>
    </Filter>
);

export default MenuFilter;
