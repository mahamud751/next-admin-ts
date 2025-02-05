import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/GetApp";
import { FC, cloneElement, useState } from "react";
import {
  Button,
  CreateButton,
  ExportButton,
  FunctionField,
  List,
  ListProps,
  NumberField,
  RaRecord as Record,
  ReferenceField,
  SimpleForm,
  TextField,
  TopToolbar,
  usePermissions,
} from "react-admin";

import ChangeStatusDialog from "@/components/manageHR/salaries/ChangeStatusDialog";
import CreateBulkAdjustment from "@/components/manageHR/salaries/CreateBulkAdjustment";
import TypedExportDialog from "@/components/manageHR/salaries/TypedExportDialog";
import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import SalaryFilter from "./salaryFilter";

const ListActions = ({
  permissions,
  filters,
  setIsTypedExportDialogOpen,
  setIsBulkAdjustmentDialogOpen,
}) => (
  <TopToolbar>
    {cloneElement(filters, { context: "button" })}
    <CreateButton label="Create Adjustment" />
    {/* TODO: */}
    {permissions?.includes("salaryAdjustmentCreate") && (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          height: "30px",
          color: "#008069",
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 500,
          lineHeight: 1.75,
          letterSpacing: "0.02857em",
          fontSize: "0.8125rem",
          cursor: "pointer",
          textTransform: "uppercase",
        }}
        onClick={() => setIsBulkAdjustmentDialogOpen(true)}
      >
        {" "}
        <AddIcon fontSize="small" color="primary" /> Create Bulk Adjustment{" "}
      </span>
    )}
    <ExportButton label="Export" />
    {/* TODO: */}
    {permissions?.includes("salaryExport") && (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          height: "30px",
          color: "#008069",
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 500,
          lineHeight: 1.75,
          letterSpacing: "0.02857em",
          fontSize: "0.8125rem",
          cursor: "pointer",
        }}
        onClick={() => setIsTypedExportDialogOpen(true)}
      >
        <DownloadIcon fontSize="small" color="primary" />
        TYPED EXPORT
      </span>
    )}
  </TopToolbar>
);

const SalaryList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Salary List");
  const { permissions } = usePermissions();
  const classes = useAroggaStyles();
  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList(
    "salaryView",
    "salaryAdjustmentEdit"
  );

  const [isTypedExportDialogOpen, setIsTypedExportDialogOpen] = useState(false);
  const [isBulkAdjustmentDialogOpen, setIsBulkAdjustmentDialogOpen] =
    useState(false);
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] =
    useState(false);
  const [salaryId, setSalaryId] = useState(null);

  return (
    <>
      <List
        {...rest}
        title="List of Salary"
        perPage={25}
        sort={{ field: "s_id", order: "DESC" }}
        filters={<SalaryFilter children={""} />}
        exporter={exporter}
        actions={
          <ListActions
            permissions={permissions}
            filters={<SalaryFilter children={""} />}
            setIsTypedExportDialogOpen={setIsTypedExportDialogOpen}
            setIsBulkAdjustmentDialogOpen={setIsBulkAdjustmentDialogOpen}
          />
        }
      >
        <CustomizableDatagrid
          rowClick={navigateFromList}
          bulkActionButtons={false}
        >
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
          <TextField source="s_employee_id" label="Employee ID" />
          <TextField source="s_year" label="Year" />
          <TextField source="s_month" label="Month" />
          <TextField source="s_working_days" label="Total Working Day" />
          <TextField source="s_employee_shift_count" label="Employee Shift" />
          <TextField source="s_available_leave" label="Payable Leave" />
          <TextField source="s_leave_taken" label="Spent Leave" />
          <TextField source="s_absent" label="Absent" />
          <NumberField source="s_per_shift_salary" label="Per Shift Salary" />
          <NumberField source="s_gross_salary" label="Salary" />
          <TextField
            source="s_payment_mode"
            label="Payment Mode"
            className={classes.capitalize}
          />
          <ReferenceField
            source="s_eb_id"
            label="Bank"
            reference="v1/employeeBank"
          >
            <ReferenceField
              label="From Bank"
              source="eb_bank_id"
              reference="v1/bank"
            >
              <TextField source="b_name" />
            </ReferenceField>
          </ReferenceField>
          <ReferenceField
            source="s_eb_id"
            label="Account No"
            reference="v1/employeeBank"
            link="show"
          >
            <TextField source="eb_account_no" />
          </ReferenceField>
          <NumberField source="s_gross_payable" label="Gross Payable" />
          <NumberField source="s_gross_addition" label="Gross Addition" />
          <NumberField source="s_gross_deduction" label="Gross Deduction" />
          <NumberField source="s_tax" label="Tax" />
          <NumberField source="s_net_payable" label="Net Payable" />
          <TextField
            source="s_status"
            label="Status"
            className={classes.capitalize}
          />
          {permissions?.includes("changeSalaryStatus") && (
            <FunctionField
              label="Action"
              render={({ s_id, s_status }: Record) => {
                if (s_status === "paid") return;

                return (
                  <Button
                    label="Change Status"
                    variant="contained"
                    className={classes.whitespaceNowrap}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSalaryId(s_id);
                      setIsChangeStatusDialogOpen(true);
                    }}
                  />
                );
              }}
            />
          )}
        </CustomizableDatagrid>
      </List>
      <SimpleForm toolbar={false}>
        <TypedExportDialog
          permissions={permissions}
          isDialogOpen={isTypedExportDialogOpen}
          setIsDialogOpen={setIsTypedExportDialogOpen}
        />
        <CreateBulkAdjustment
          isDialogOpen={isBulkAdjustmentDialogOpen}
          setIsDialogOpen={setIsBulkAdjustmentDialogOpen}
        />
        <ChangeStatusDialog
          isDialogOpen={isChangeStatusDialogOpen}
          setIsDialogOpen={setIsChangeStatusDialogOpen}
          salaryId={salaryId}
        />
      </SimpleForm>
    </>
  );
};

export default SalaryList;
