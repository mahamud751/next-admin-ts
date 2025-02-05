import { Typography } from "@mui/material";
import { FC, useState } from "react";
import {
  Confirm,
  Datagrid,
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
} from "react-admin";

import Action from "@/components/manageHR/employeeLeaves/Action";
import ExpandPanel from "@/components/manageHR/employeeLeaves/ExpandPanel";
import { useDocumentTitle, useExport, useRequest } from "@/hooks";
import EmployeeFilter from "./EmployeeLeaveFilter";

const EmployeeLeaveList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Employee Leave List");

  const exporter = useExport(rest);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState("");
  const [leaveDetailChangesInfo, setLeaveDetailChangesInfo] = useState({});
  const [employeeLeaveId, setEmployeeLeaveId] = useState(null);

  const { isLoading, refetch } = useRequest(
    `/v1/employee/employeeLeave-approval/${employeeLeaveId}`,
    {
      method: "POST",
      body: { el_status: action },
    },
    {
      isRefresh: true,
      successNotify: `Successfully leave ${action}!`,
      onSuccess: () => setIsDialogOpen(false),
    }
  );

  return (
    <>
      <List
        {...rest}
        title="List of Leave"
        perPage={25}
        sort={{ field: "el_id", order: "DESC" }}
        exporter={exporter}
        filters={<EmployeeFilter children={""} />}
        filterDefaultValues={{ _status: "pending" }}
      >
        <Datagrid
          expand={
            <ExpandPanel
              setLeaveDetailChangesInfo={setLeaveDetailChangesInfo}
            />
          }
          bulkActionButtons={false}
        >
          <TextField source="el_id" label="ID" />
          <ReferenceField
            source="el_employee_id"
            label="Name"
            reference="v1/employee"
            link="show"
          >
            <TextField source="e_name" />
          </ReferenceField>
          <TextField source="r_title" label="Designation" />
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
                {!!r_compensatory_leaves && el_type === "compensatory" && (
                  <Typography>Compensatory: {r_compensatory_leaves}</Typography>
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
                {!!e_compensatory_leaves && el_type === "compensatory" && (
                  <Typography>Compensatory: {e_compensatory_leaves}</Typography>
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
                  <Typography>Sick: {r_sick_leaves - e_sick_leaves}</Typography>
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
                {!!r_compensatory_leaves && el_type === "compensatory" && (
                  <Typography>
                    Compensatory:{" "}
                    {r_compensatory_leaves - e_compensatory_leaves}
                  </Typography>
                )}
                {!!r_maternity_leaves && el_type === "maternity" && (
                  <Typography>
                    Maternity: {r_maternity_leaves - e_maternity_leaves}
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
          <Action
            leaveDetailChangesInfo={leaveDetailChangesInfo}
            setAction={setAction}
            setEmployeeLeaveId={setEmployeeLeaveId}
            setIsDialogOpen={setIsDialogOpen}
          />
        </Datagrid>
      </List>
      <Confirm
        isOpen={isDialogOpen}
        loading={isLoading}
        title={`Are you sure you want to ${action} leave?`}
        content={false}
        onConfirm={refetch}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default EmployeeLeaveList;
