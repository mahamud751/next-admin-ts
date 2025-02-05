import { FC, useState } from "react";
import {
    Datagrid,
    FunctionField,
    List,
    ListProps,
    Record,
    ReferenceField,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../../components/AroggaDateField";
import LoaderOrButton from "../../../../components/LoaderOrButton";
import TreeDropdownInput from "../../../../components/TreeDropdownInput";

const historyFilters = [
    <TreeDropdownInput
        reference="/v1/taxonomiesByVocabulary/employee_history_type"
        source="_reference_table"
        label="Reference Table"
        variant="outlined"
        keyId="t_title"
        keyParent="t_parent_id"
        optionValue="t_title"
        optionTextValue="t_title"
    />,
];

interface ListRecordNewProps extends ListProps {
    record?: any;
}
const HistoryTab: FC<ListRecordNewProps> = ({ ...rest }) => {
    const [isShowTable, setIsShowTable] = useState(false);
    return (
        <>
            {!isShowTable && (
                <LoaderOrButton
                    label="Load History"
                    isLoading={false}
                    display="flex"
                    justifyContent="center"
                    mt={3}
                    mb={4}
                    onClick={() => setIsShowTable(true)}
                />
            )}
            {isShowTable && (
                <List
                    {...rest}
                    resource="v1/employeeHistory"
                    title="Employee History"
                    filters={historyFilters}
                    perPage={25}
                    sort={{ field: "eh_id", order: "DESC" }}
                    exporter={false}
                    filterDefaultValues={{ _employee_id: rest?.record?.id }}
                    bulkActionButtons={false}
                >
                    <Datagrid>
                        <AroggaDateField
                            source="eh_created_at"
                            label="Created At"
                        />
                        <ReferenceField
                            label="Created By"
                            source="eh_created_by"
                            reference="v1/users"
                            link="show"
                        >
                            <TextField source="u_name" />
                        </ReferenceField>
                        <TextField
                            source="eh_reference_table"
                            label="Reference Table"
                        />
                        <TextField
                            source="eh_column_name"
                            label="Column Name"
                        />
                        <FunctionField
                            label="From"
                            render={({ eh_column_name }: Record) => {
                                if (eh_column_name === "e_rank_id") {
                                    return (
                                        <ReferenceField
                                            source="eh_old_value"
                                            reference="v1/rank"
                                            link="show"
                                        >
                                            <TextField source="r_title" />
                                        </ReferenceField>
                                    );
                                } else if (eh_column_name === "ei_bank_id") {
                                    return (
                                        <ReferenceField
                                            source="eh_old_value"
                                            reference="v1/bank"
                                            link="show"
                                        >
                                            <TextField source="b_name" />
                                        </ReferenceField>
                                    );
                                } else {
                                    return (
                                        <TextField
                                            source="eh_old_value"
                                            label="From"
                                        />
                                    );
                                }
                            }}
                        />
                        <FunctionField
                            label="To"
                            render={({ eh_column_name }: Record) => {
                                if (eh_column_name === "e_rank_id") {
                                    return (
                                        <ReferenceField
                                            source="eh_new_value"
                                            reference="v1/rank"
                                            sortBy="eh_new_value"
                                            link="show"
                                        >
                                            <TextField source="r_title" />
                                        </ReferenceField>
                                    );
                                } else if (eh_column_name === "ei_bank_id") {
                                    return (
                                        <ReferenceField
                                            source="eh_new_value"
                                            reference="v1/bank"
                                            sortBy="eh_new_value"
                                            link="show"
                                        >
                                            <TextField source="b_name" />
                                        </ReferenceField>
                                    );
                                } else {
                                    return (
                                        <TextField
                                            source="eh_new_value"
                                            label="From"
                                        />
                                    );
                                }
                            }}
                        />
                    </Datagrid>
                </List>
            )}
        </>
    );
};

export default HistoryTab;
