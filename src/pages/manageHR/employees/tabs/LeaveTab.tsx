import { Typography } from "@material-ui/core";
import {
    Datagrid,
    FunctionField,
    Pagination,
    Record,
    ReferenceManyField,
    TextField,
} from "react-admin";

const LeaveTab = () => (
    <ReferenceManyField
        reference="v1/employeeLeave"
        target="_employee_id"
        pagination={<Pagination />}
        sort={{ field: "el_id", order: "DESC" }}
    >
        <Datagrid rowClick="show">
            <TextField source="el_id" label="ID" />
            <FunctionField
                label="Payable Leave"
                render={({
                    r_sick_leaves,
                    r_casual_leaves,
                    r_annual_leaves,
                    el_type,
                    r_compensatory_leaves,
                    r_maternity_leaves,
                    r_weekend_leaves,
                }: Record) => (
                    <>
                        {!!r_sick_leaves && el_type === "sick" && (
                            <Typography>Sick: {r_sick_leaves}</Typography>
                        )}
                        {!!r_casual_leaves && el_type === "casual" && (
                            <Typography>Casual: {r_casual_leaves}</Typography>
                        )}
                        {!!r_annual_leaves && el_type === "annual" && (
                            <Typography>Annual: {r_annual_leaves}</Typography>
                        )}
                        {!!r_compensatory_leaves &&
                            el_type === "compensatory" && (
                                <Typography>
                                    Compensatory: {r_compensatory_leaves}
                                </Typography>
                            )}
                        {!!r_maternity_leaves && el_type === "maternity" && (
                            <Typography>
                                Maternity:
                                {r_maternity_leaves}
                            </Typography>
                        )}
                        {!!r_weekend_leaves && el_type === "weekend" && (
                            <Typography>Weekend: {r_weekend_leaves}</Typography>
                        )}
                    </>
                )}
            />
            <FunctionField
                label="Spent Leave"
                render={({
                    e_sick_leaves,
                    e_casual_leaves,
                    e_annual_leaves,
                    el_type,
                    e_compensatory_leaves,
                    e_maternity_leaves,
                    e_weekend_leaves,
                }: Record) => (
                    <>
                        {!!e_sick_leaves && el_type === "sick" && (
                            <Typography>Sick: {e_sick_leaves}</Typography>
                        )}
                        {!!e_casual_leaves && el_type === "casual" && (
                            <Typography>Casual: {e_casual_leaves}</Typography>
                        )}
                        {!!e_annual_leaves && el_type === "annual" && (
                            <Typography>Annual: {e_annual_leaves}</Typography>
                        )}
                        {!!e_compensatory_leaves &&
                            el_type === "compensatory" && (
                                <Typography>
                                    Compensatory: {e_compensatory_leaves}
                                </Typography>
                            )}
                        {!!e_maternity_leaves && el_type === "maternity" && (
                            <Typography>
                                Maternity:
                                {e_maternity_leaves}
                            </Typography>
                        )}
                        {!!e_weekend_leaves && el_type === "weekend" && (
                            <Typography>Weekend: {e_weekend_leaves}</Typography>
                        )}
                    </>
                )}
            />
            <FunctionField
                label="Available Leave"
                render={({
                    r_sick_leaves,
                    e_sick_leaves = 0,
                    r_casual_leaves,
                    e_casual_leaves = 0,
                    r_annual_leaves,
                    e_annual_leaves = 0,
                    el_type,
                    r_compensatory_leaves,
                    e_compensatory_leaves = 0,
                    r_maternity_leaves,
                    e_maternity_leaves = 0,
                    r_weekend_leaves,
                    e_weekend_leaves = 0,
                }: Record) => (
                    <>
                        {!!r_sick_leaves && el_type === "sick" && (
                            <Typography>
                                Sick: {r_sick_leaves - e_sick_leaves}
                            </Typography>
                        )}
                        {!!r_casual_leaves && el_type === "casual" && (
                            <Typography>
                                Casual: {r_casual_leaves - e_casual_leaves}
                            </Typography>
                        )}
                        {!!r_annual_leaves && el_type === "annual" && (
                            <Typography>
                                Annual: {r_annual_leaves - e_annual_leaves}
                            </Typography>
                        )}
                        {!!r_compensatory_leaves &&
                            el_type === "compensatory" && (
                                <Typography>
                                    Compensatory:{" "}
                                    {r_compensatory_leaves -
                                        e_compensatory_leaves}
                                </Typography>
                            )}
                        {!!r_maternity_leaves && el_type === "maternity" && (
                            <Typography>
                                Maternity:{" "}
                                {r_maternity_leaves - e_maternity_leaves}
                            </Typography>
                        )}
                        {!!r_weekend_leaves && el_type === "weekend" && (
                            <Typography>
                                Weekend: {r_weekend_leaves - e_weekend_leaves}
                            </Typography>
                        )}
                    </>
                )}
            />
            <FunctionField
                label="Leave Date"
                render={({ leave_details }: Record) => {
                    const employeeLeaveDates = leave_details?.map(
                        (item) => item.eld_date
                    );
                    return <>{[...new Set(employeeLeaveDates)].join(", ")}</>;
                }}
            />
            <TextField source="el_type" label="Type" />
            <TextField source="el_reason" label="Reason" />
            <TextField source="el_status" label="Status" />
        </Datagrid>
    </ReferenceManyField>
);

export default LeaveTab;
