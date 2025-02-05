import { FC } from "react";
import {
    NumberField,
    ReferenceField,
    Show,
    ShowProps,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import ColumnShowLayout from "../../../components/ColumnShowLayout";
import { useDocumentTitle } from "../../../hooks";

const EmployeeLoanShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Employee Loan Show");

    return (
        <Show {...props}>
            <ColumnShowLayout>
                <TextField source="el_id" label="ID" />
                <ReferenceField
                    source="el_employee_id"
                    label="Employee"
                    reference="v1/employee"
                    link="show"
                    sortBy="el_employee_id"
                >
                    <TextField source="e_name" />
                </ReferenceField>
                <NumberField source="el_amount" label="Amount" />
                <NumberField source="el_due" label="Due" />
                <TextField source="el_installment" label="Installment" />
                <TextField source="el_reason" label="Reason" />
                <TextField
                    source="el_adjustment_type"
                    label="Adjustment Type"
                />
                <TextField source="el_status" label="Status" />
                <TextField source="el_payment_status" label="Payment Status" />
                <AroggaDateField source="el_created_at" label="Created At" />
                <ReferenceField
                    source="el_created_by"
                    label="Created By"
                    reference="v1/users"
                    link="show"
                    sortBy="el_created_by"
                >
                    <TextField source="u_name" />
                </ReferenceField>
                <AroggaDateField source="el_modified_at" label="Modified At" />
                <ReferenceField
                    source="el_modified_by"
                    label="Modified By"
                    reference="v1/users"
                    link="show"
                    sortBy="el_modified_by"
                >
                    <TextField source="u_name" />
                </ReferenceField>
            </ColumnShowLayout>
        </Show>
    );
};

export default EmployeeLoanShow;
