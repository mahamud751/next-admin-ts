import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

const VocabularyFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <TextInput
            source="_machine_name"
            label="Machine Name"
            variant="outlined"
            resettable
            alwaysOn
        />
    </Filter>
);

export default VocabularyFilter;
