import { FC } from "react";
import {
    AutocompleteInput,
    Filter,
    FilterProps,
    ReferenceInput,
    TextInput,
} from "react-admin";

const TaxonomyFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <ReferenceInput
            source="_v_id"
            label="Vocabulary"
            variant="outlined"
            reference="v1/vocabulary"
            alwaysOn
        >
            <AutocompleteInput
                matchSuggestion={() => true}
                optionText="v_title"
                helperText={false}
                resettable
            />
        </ReferenceInput>
        <TextInput
            source="_machine_name"
            label="Machine Name"
            variant="outlined"
            resettable
            alwaysOn
        />
    </Filter>
);

export default TaxonomyFilter;
