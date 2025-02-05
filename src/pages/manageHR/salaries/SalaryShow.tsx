import { FC } from "react";
import {
    FunctionField,
    NumberField,
    Record,
    ReferenceField,
    Show,
    ShowProps,
    SimpleForm,
    Tab,
    TabbedShowLayout,
    TextField,
} from "react-admin";

import AdjustmentTab from "../../../components/manageHR/salaries/AdjustmentTab";
import { useDocumentTitle } from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";

const SalaryShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Salary Show");

    const classes = useAroggaStyles();

    return (
        <Show {...props}>
            <TabbedShowLayout>
                <Tab label="Salary">
                    <TextField source="s_id" label="ID" />
                    <ReferenceField
                        source="s_employee_id"
                        label="Employee"
                        reference="v1/employee"
                        link="show"
                        sortBy="s_employee_id"
                    >
                        <TextField source="e_name" />
                    </ReferenceField>
                    <TextField source="s_year" label="Year" />
                    <TextField source="s_month" label="Month" />
                    <NumberField source="s_gross_salary" label="Gross Salary" />
                    <NumberField
                        source="s_gross_addition"
                        label="Gross Addition"
                    />
                    <NumberField
                        source="s_gross_deduction"
                        label="Gross Deduction"
                    />
                    <NumberField source="s_tax" label="Tax" />
                    <NumberField source="s_net_payable" label="Net Payable" />
                    <TextField
                        source="s_payment_mode"
                        label="Payment Mode"
                        className={classes.capitalize}
                    />
                    <ReferenceField
                        source="s_eb_id"
                        label="Bank"
                        reference="v1/employeeBank"
                        link="show"
                    >
                        <FunctionField
                            label="Bank"
                            render={(record: Record) =>
                                `${record?.eb_account_title} (${record?.eb_account_no} ${record?.eb_card_no})`
                            }
                        />
                    </ReferenceField>
                    <TextField
                        source="s_status"
                        label="Status"
                        className={classes.capitalize}
                    />
                </Tab>
                <Tab label="Salary Adjustment">
                    <SimpleForm toolbar={false}>
                        <AdjustmentTab />
                    </SimpleForm>
                </Tab>
            </TabbedShowLayout>
        </Show>
    );
};

export default SalaryShow;
