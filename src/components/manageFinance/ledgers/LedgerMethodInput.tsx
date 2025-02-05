import { SelectInput } from "react-admin";

const LedgerMethodInput = ({ choices = [], ...rest }) => (
    <SelectInput
        label="Method"
        choices={[
            { id: "Cash", name: "Cash" },
            {
                id: "Bank",
                name: "Bank",
            },
            {
                id: "Upay",
                name: "Upay",
            },
            {
                id: "Payable",
                name: "Payable",
            },
            ...choices,
        ]}
        helperText={false}
        {...rest}
    />
);

export default LedgerMethodInput;
