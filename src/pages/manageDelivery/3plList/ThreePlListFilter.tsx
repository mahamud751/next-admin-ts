import { Filter, SelectInput, TextInput } from "react-admin";

const ThreePlListFilter = ({ ...props }) => {
    return (
        <Filter {...props}>
            <TextInput
                source="_name"
                label="Name"
                variant="outlined"
                resettable
                alwaysOn
            />
            <SelectInput
                source="_status"
                label="Status"
                variant="outlined"
                choices={[
                    { id: "1", name: "Active" },
                    { id: "0", name: "InActive" },
                ]}
                alwaysOn
            />
        </Filter>
    );
};

export default ThreePlListFilter;
