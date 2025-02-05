import { FC } from "react";
import { Filter, FilterProps, SelectInput } from "react-admin";

import TaxonomiesByVocabularyInput from "../../../components/TaxonomiesByVocabularyInput";
import YearSelectInput from "../../../components/YearSelectInput";
import { monthsWithId } from "../../../utils/constants";

const HolidayFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <YearSelectInput source="_year" variant="outlined" alwaysOn />
        <SelectInput
            source="_month"
            label="Month"
            variant="outlined"
            choices={monthsWithId.map(({ id, name }) => ({
                id: `-${id}-`,
                name,
            }))}
            alwaysOn
        />
        <TaxonomiesByVocabularyInput
            fetchKey="holiday_type"
            source="_type"
            label="Type"
            alwaysOn
        />
    </Filter>
);

export default HolidayFilter;
