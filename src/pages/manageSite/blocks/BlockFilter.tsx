import { FC } from "react";
import {
    AutocompleteInput,
    Filter,
    FilterProps,
    ReferenceInput,
    SelectInput,
    TextInput,
} from "react-admin";

import TaxonomiesByVocabularyInput from "../../../components/TaxonomiesByVocabularyInput";

const BlockFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <ReferenceInput
            source="_region_id"
            label="Region"
            variant="outlined"
            reference="v1/region"
            alwaysOn
        >
            <AutocompleteInput
                optionValue="r_id"
                optionText="r_name"
                resettable
            />
        </ReferenceInput>
        <TaxonomiesByVocabularyInput
            fetchKey="block_type"
            filter={{
                _parent_id: 0,
            }}
            source="_type"
            label="Type"
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
    </Filter>
);

export default BlockFilter;
