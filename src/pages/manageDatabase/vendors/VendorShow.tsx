import { FC } from "react";
import {
    FunctionField,
    Record,
    ReferenceField,
    Show,
    ShowProps,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import ColumnShowLayout from "../../../components/ColumnShowLayout";
import { useDocumentTitle } from "../../../hooks";
import { convertTo12HourFormat, isEmpty } from "../../../utils/helpers";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";

const VendorShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Vendor Show");

    const classes = useAroggaStyles();

    return (
        <Show {...props}>
            <ColumnShowLayout md={4}>
                <TextField source="v_id" label="ID" />
                <TextField
                    source="v_type"
                    label="Type"
                    className={classes.capitalize}
                />
                <ReferenceField
                    source="v_user_id"
                    label="User"
                    reference="v1/users"
                    link="show"
                >
                    <TextField source="u_name" />
                </ReferenceField>
                <ReferenceField
                    source="v_kam_user_id"
                    label="KAM"
                    reference="v1/users"
                    link="show"
                >
                    <TextField source="u_name" />
                </ReferenceField>
                <TextField source="v_name" label="Name" />
                <FunctionField
                    label="Email"
                    render={({ v_email }: Record) => {
                        if (isEmpty(v_email)) return;

                        return (
                            <ul>
                                {v_email.map((email, i) => (
                                    <li key={i}>{email}</li>
                                ))}
                            </ul>
                        );
                    }}
                />
                <TextField source="v_phone" label="Phone" />
                <TextField source="v_address" label="Address" />
                <TextField source="v_tin" label="Tin" />
                <TextField source="v_bin" label="Bin" />
                <TextField source="v_account_details" label="Account Details" />
                <ReferenceField
                    source="v_bank_id"
                    label="Bank"
                    reference="v1/bank"
                    link="show"
                >
                    <FunctionField
                        render={(record: Record) =>
                            `${record?.b_name} (${record?.b_branch})`
                        }
                    />
                </ReferenceField>
                <TextField source="v_payment_terms" label="Payment Terms" />
                <TextField
                    source="v_payment_term_condition"
                    label="Payment Term Condition"
                />
                <FunctionField
                    source="v_cutoff_time"
                    label="Cutoff Time"
                    render={({ v_cutoff_time }: Record) =>
                        convertTo12HourFormat(+v_cutoff_time)
                    }
                />
                <TextField source="v_due_day" label="Due Day" />
                <TextField source="v_weight" label="Weight" />
                <FunctionField
                    label="Status"
                    render={(record: Record) => (
                        <span
                            className={`${classes.capitalize} ${
                                record.v_status === "inactive" &&
                                classes.textRed
                            }`}
                        >
                            {record?.v_status}
                        </span>
                    )}
                />
                <AroggaDateField source="v_created_at" label="Created At" />
                <ReferenceField
                    source="v_created_by"
                    label="Created By"
                    reference="v1/users"
                    link="show"
                >
                    <TextField source="u_name" />
                </ReferenceField>
                <AroggaDateField source="v_modified_at" label="Modified At" />
                <ReferenceField
                    source="v_modified_by"
                    label="Modified By"
                    reference="v1/users"
                    link="show"
                >
                    <TextField source="u_name" />
                </ReferenceField>
            </ColumnShowLayout>
        </Show>
    );
};

export default VendorShow;
