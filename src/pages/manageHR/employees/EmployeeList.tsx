import { Box } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import jsonExport from "jsonexport/dist";
import { FC } from "react";
import {
    BooleanField,
    Button,
    EmailField,
    FunctionField,
    Link,
    List,
    ListProps,
    NumberField,
    Record,
    ReferenceField,
    TextField,
    downloadCSV,
    useRedirect,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import { useDocumentTitle, useNavigateFromList } from "../../../hooks";
import { CustomizableDatagrid } from "../../../lib";
import {
    capitalizeFirstLetterOfEachWord,
    logger,
    toFilterObj,
} from "../../../utils/helpers";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import EmployeeFilter from "./EmployeeFilter";

const EmployeeList: FC<ListProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Employee List");

    const classes = useAroggaStyles();
    const redirect = useRedirect();
    const navigateFromList = useNavigateFromList(
        "employeeView",
        "employeeEdit"
    );

    const { _shiftType } = toFilterObj(rest.location.search);

    const rowStyle = (record: Record) => {
        if (record?.e_date_of_release !== "0000-00-00")
            return {
                backgroundColor: "rgb(255 229 229)",
            };
        if (record?.e_date_of_leaving !== "0000-00-00")
            return {
                backgroundColor: "rgb(255 229 229 / 35%)",
            };

        return null;
    };

    const exporter = (records, fetchRelatedRecords) => {
        fetchRelatedRecords(records, "e_rank_id", "v1/rank")
            .then((ranks) => {
                const data = records?.map(
                    ({ id, e_rank_id, ...restRecord }) => ({
                        ...restRecord,
                        designation: ranks?.[e_rank_id]?.r_title,
                    })
                );

                return jsonExport(data, {}, (_, csv) =>
                    downloadCSV(csv, "employees")
                );
            })
            .catch((err) => logger(err));
    };

    return (
        <List
            {...rest}
            title="List of Employee"
            perPage={25}
            filters={<EmployeeFilter />}
            sort={{ field: "e_id", order: "DESC" }}
            exporter={permissions?.includes("export") ? exporter : false}
            bulkActionButtons={false}
        >
            <CustomizableDatagrid
                rowClick={navigateFromList}
                rowStyle={rowStyle}
                hideableColumns={[
                    "e_salary_addition_mode",
                    "e_salary_deduction_mode",
                    "e_delay_salary_deduction_mode",
                    "e_deduction_delay_count",
                    "e_dynamic_leave_mode",
                ]}
            >
                <TextField source="e_id" label="Employee ID" />
                <FunctionField
                    source="e_name"
                    label="Employee"
                    // @ts-ignore
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                    render={({ e_id, e_name, e_mobile, u_pic_url }) => (
                        <Link
                            to={{
                                pathname: "/v1/employeeInfo",
                                search: `filter=${JSON.stringify({
                                    _e_id: e_id,
                                })}`,
                            }}
                            className={classes.whitespaceNowrap}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <Avatar alt={e_name || e_mobile} src={u_pic_url} />
                            {e_name}
                        </Link>
                    )}
                />
                {_shiftType && <EmailField source="u_email" label="Email" />}
                <TextField source="e_mobile" label="Mobile" />
                <TextField source="e_blood_group" label="Blood Group" />
                <FunctionField
                    source="e_type"
                    label="Type"
                    render={({ e_type }) => (
                        <span className={classes.whitespaceNowrap}>
                            {capitalizeFirstLetterOfEachWord(e_type)}
                        </span>
                    )}
                />
                <TextField
                    source="u_sex"
                    label="Gender"
                    className={classes.capitalize}
                />
                <NumberField source="e_salary" label="Salary" />
                <NumberField source="e_salary_tax" label="Salary Tax" />
                <NumberField source="e_payment_mode" label="Payment Mode" />
                <ReferenceField
                    source="e_eb_id"
                    label="Account No"
                    reference="v1/employeeBank"
                    link="show"
                >
                    <FunctionField
                        render={(record: Record) =>
                            `${record?.eb_account_title} (${record?.eb_account_no} ${record?.eb_card_no}) `
                        }
                    />
                </ReferenceField>
                <FunctionField
                    source="e_department"
                    label="Department"
                    render={({ e_department }) => (
                        <span className={classes.whitespaceNowrap}>
                            {capitalizeFirstLetterOfEachWord(e_department)}
                        </span>
                    )}
                />
                <ReferenceField
                    source="e_rank_id"
                    label="Designation"
                    reference="v1/rank"
                    link="show"
                    sortBy="e_rank_id"
                >
                    <TextField source="r_title" />
                </ReferenceField>
                <TextField source="e_sick_leaves" label="Sick Leaves" />
                <TextField source="e_casual_leaves" label="Casual Leaves" />
                <TextField source="e_annual_leaves" label="Annual Leaves" />
                <TextField
                    source="e_compensatory_leaves"
                    label="Compensatory Leaves"
                />
                <TextField
                    source="e_maternity_leaves"
                    label="Maternity Leaves"
                />
                <FunctionField
                    source="e_weekend_leaves"
                    label="Weekend Leaves"
                    render={({ e_weekend_leaves }: Record) => {
                        if (e_weekend_leaves === 0) return "All Fridays";
                        return e_weekend_leaves;
                    }}
                />
                <AroggaDateField
                    source="e_date_of_joining"
                    label="Joining Date"
                />
                <AroggaDateField
                    source="e_confirmation_date"
                    label="Confirmation Date"
                />
                <AroggaDateField
                    source="e_date_of_leaving"
                    label="Leaving Date"
                />
                <AroggaDateField
                    source="e_date_of_release"
                    label="Releasing Date"
                />
                <BooleanField
                    source="e_salary_addition_mode"
                    label="Auto Salary Addition Mode?"
                    FalseIcon={() => null}
                    looseValue
                />
                <BooleanField
                    source="e_salary_deduction_mode"
                    label="Auto Salary Deduction Mode?"
                    FalseIcon={() => null}
                    looseValue
                />
                <BooleanField
                    source="e_delay_salary_deduction_mode"
                    label="Auto Delay Salary Deduction Mode?"
                    FalseIcon={() => null}
                    looseValue
                />
                <TextField
                    source="e_deduction_delay_count"
                    label="Deduction Delay Count"
                />
                <BooleanField
                    source="e_dynamic_leave_mode"
                    label="Dynamic Leave Mode?"
                    FalseIcon={() => null}
                    looseValue
                />
                <FunctionField
                    label="View"
                    onClick={(e) => e.stopPropagation()}
                    render={({ e_user_id, e_rank_id }: Record) => (
                        <Box display="flex" gridGap={5}>
                            <Button
                                label="User"
                                variant="contained"
                                onClick={() =>
                                    redirect(`/v1/users/${e_user_id}/show`)
                                }
                            />
                            <Button
                                label="Rank Permission"
                                variant="contained"
                                className={classes.whitespaceNowrap}
                                onClick={() =>
                                    redirect(
                                        `/designation-permission/${e_rank_id}`
                                    )
                                }
                            />
                        </Box>
                    )}
                />
            </CustomizableDatagrid>
        </List>
    );
};

export default EmployeeList;
