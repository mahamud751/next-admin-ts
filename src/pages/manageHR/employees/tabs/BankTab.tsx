import {
    Datagrid,
    FunctionField,
    Pagination,
    Record,
    ReferenceManyField,
    TextField,
} from "react-admin";

const BankTab = () => (
    <ReferenceManyField
        reference="v1/employeeBank"
        target="_emp_id"
        pagination={<Pagination />}
        sort={{ field: "_id", order: "DESC" }}
    >
        <Datagrid rowClick="show">
            <TextField source="eb_bank_id" label="Bank ID" />
            <TextField source="eb_emp_id" label="Emp ID" />
            <TextField source="eb_account_title" label="Account Title" />
            <TextField source="eb_account_no" label="Account No" />
            <TextField source="eb_card_no" label="Card No" />
            <TextField source="eb_client_id" label="Client No" />
            <FunctionField
                label="Status"
                sortBy="eb_status"
                render={({ eb_status }: Record) => (
                    <span
                        style={
                            eb_status === "present"
                                ? { color: "#008069" }
                                : eb_status === "active"
                                ? { color: "#dc3545" }
                                : eb_status === "inactive"
                                ? { color: "orange" }
                                : {}
                        }
                    >
                        {eb_status}
                    </span>
                )}
            />
        </Datagrid>
    </ReferenceManyField>
);

export default BankTab;
