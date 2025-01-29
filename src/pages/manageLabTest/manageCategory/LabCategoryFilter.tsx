import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const LabCategoryFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="name"
            label="Search By Name"
            variant="outlined"
            resettable
            alwaysOn
        />
        <SelectInput
            variant="outlined"
            source="sectionTag"
            choices={[
                { id: "health_concern", name: "Health Concern" },
                { id: "health_package", name: "Health Package" },
                { id: "life_style", name: "Life Style" },
                { id: "vital_organs", name: "Vital Organs" },
                { id: "checkup_men", name: "Checkup Men" },
                { id: "checkup_women", name: "Checkup Women" },
            ]}
            alwaysOn
        />
        <SelectInput
            source="status"
            variant="outlined"
            choices={[
                { id: "active", name: "Active" },
                { id: "inactive", name: "Inactive" },
            ]}
            alwaysOn
        />
    </Filter>
);

export default LabCategoryFilter;
