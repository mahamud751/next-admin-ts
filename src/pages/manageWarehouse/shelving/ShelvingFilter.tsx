import { FC } from "react";
import {
    AutocompleteInput,
    Filter,
    FilterProps,
    ReferenceInput,
    TextInput,
} from "react-admin";

const ShelvingFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_search"
            label="Search"
            variant="outlined"
            resettable
            alwaysOn
        />
        <ReferenceInput
            source="_qc_id"
            label="QC ID"
            variant="outlined"
            reference="v1/qualityControl"
        >
            <AutocompleteInput optionText="qc_id" resettable />
        </ReferenceInput>
        <ReferenceInput
            source="_product_purchase_id"
            label="Purchase ID"
            variant="outlined"
            reference="v1/productPurchase"
        >
            <AutocompleteInput optionText="pp_id" resettable />
        </ReferenceInput>
    </Filter>
);

export default ShelvingFilter;
