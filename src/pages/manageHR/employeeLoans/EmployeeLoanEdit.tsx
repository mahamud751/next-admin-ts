import { FC } from "react";
import {
    AutocompleteInput,
    Edit,
    EditProps,
    NumberInput,
    ReferenceInput,
    SimpleForm,
    TextInput,
    maxValue,
    minValue,
    required,
} from "react-admin";

import SaveDeleteToolbar from "../../../components/SaveDeleteToolbar";
import UserEmployeeOptionTextRenderer from "../../../components/UserEmployeeOptionTextRenderer";
import { useDocumentTitle } from "../../../hooks";
import { userEmployeeInputTextRenderer } from "../../../utils/helpers";

const EmployeeLoanEdit: FC<EditProps> = (props) => {
    useDocumentTitle("Arogga | Employee Loan Edit");

    return (
        <Edit
            mutationMode={
                process.env.REACT_APP_NODE_ENV === "development"
                    ? "pessimistic"
                    : "optimistic"
            }
            {...props}
        >
            <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
                <ReferenceInput
                    source="el_employee_id"
                    label="Employee"
                    variant="outlined"
                    helperText={false}
                    reference="v1/employee"
                    sort={{ field: "e_id", order: "DESC" }}
                    validate={[required()]}
                >
                    <AutocompleteInput
                        matchSuggestion={() => true}
                        optionValue="e_id"
                        optionText={<UserEmployeeOptionTextRenderer />}
                        inputText={userEmployeeInputTextRenderer}
                        resettable
                    />
                </ReferenceInput>
                <NumberInput
                    source="el_amount"
                    label="Amount"
                    variant="outlined"
                    helperText={false}
                    validate={[required()]}
                />
                <NumberInput
                    source="el_installment"
                    label="Installment"
                    variant="outlined"
                    helperText={false}
                    validate={[required(), minValue(1), maxValue(6)]}
                    min={1}
                    max={6}
                />
                <TextInput
                    source="el_reason"
                    label="Reason"
                    variant="outlined"
                    helperText={false}
                    validate={[required()]}
                    minRows={2}
                    multiline
                />
            </SimpleForm>
        </Edit>
    );
};

export default EmployeeLoanEdit;
