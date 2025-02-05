import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

const ThreePlCollectionFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_reference"
            label="Reference ID"
            variant="outlined"
            alwaysOn
        />

        <SelectInput
            source="_status"
            variant="outlined"
            choices={[
                { id: "confirmed", name: "Confirmed" },
                { id: "pending", name: "Pending" },
                { id: "cancelled", name: "Cancelled" },
            ]}
            alwaysOn
        />
        <SelectInput
            source="_source"
            label="Courier"
            variant="outlined"
            choices={[
                { id: "redx", name: "RedX" },
                { id: "pathao", name: "Pathao" },
                { id: "ecourier", name: "eCourier" },
            ]}
            alwaysOn
        />
        <SelectInput
            source="_settlement_status"
            label="Settlement Status"
            variant="outlined"
            choices={[
                { id: "settled", name: "Settled" },
                { id: "partially_settled", name: "Partially Settled" },
            ]}
            alwaysOn
        />
    </Filter>
);

export default ThreePlCollectionFilter;
