import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

import FormatedBooleanInput from "../../../components/FormatedBooleanInput";
import TaxonomiesByVocabularyInput from "../../../components/TaxonomiesByVocabularyInput";

const ShiftFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            alwaysOn
        />
        <TaxonomiesByVocabularyInput
            fetchKey="shift_type"
            source="_shift_type"
            label="Type"
        />
        <FormatedBooleanInput source="_is_active" label="Active" />
    </Filter>
);

export default ShiftFilter;
