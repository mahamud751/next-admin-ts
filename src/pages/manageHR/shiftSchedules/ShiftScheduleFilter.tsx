import { FC } from "react";
import { DateInput, Filter, FilterProps, TextInput } from "react-admin";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";

const ShiftScheduleFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput source="_search" label="Search" variant="outlined" alwaysOn />
    <TaxonomiesByVocabularyInput
      fetchKey="shift_type"
      source="_shift_type"
      label="Type"
    />
    <DateInput source="_from_date" label="From Date" variant="outlined" />
    <DateInput source="_to_date" label="To Date" variant="outlined" />
  </Filter>
);

export default ShiftScheduleFilter;
