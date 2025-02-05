import { FC, useEffect, useState } from "react";
import {
  AutocompleteInput,
  DateInput,
  NumberInput,
  ReferenceInput,
  SelectArrayInput,
  SelectInput,
  TextInput,
  required,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { Button, Grid } from "@mui/material";
import { useGetTaxonomiesByVocabulary, useRequest } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  isEmpty,
  toFormattedDateTime,
  userEmployeeInputTextRenderer,
} from "@/utils/helpers";

import UserRoleInput from "../../manageUser/users/UserRoleInput";
import BankOptionTextRenderer from "../employeeInfo/BankOptionTextRenderer";
import EmployeeBankCreateDialog from "./EmployeeBankCreateDialog";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import AroggaAccordion from "@/components/common/AroggaAccordion";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import TreeDropdownInput from "@/components/common/TreeDropdownInput";
import Tooltip from "@/components/common/Tooltip";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

type EmployeeCreateEditProps = {
  page?: "create" | "edit";
  userRecord?: any;
  [key: string]: any;
};

const EmployeeCreateEdit: FC<EmployeeCreateEditProps> = ({
  page,
  userRecord,
  ...rest
}) => {
  const { setValue } = useFormContext();
  const { values } = useWatch();

  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);

  const [selectedUserInfo, setSelectedUserInfo] = useState<any>({});

  const { data: shiftData } = useRequest(
    "/v1/shift?_is_active=1",
    {},
    { isPreFetching: true }
  );
  const { data: rankData } = useRequest(
    "/v1/rank?_page=1&_perPage=5000",
    {},
    { isPreFetching: true }
  );

  useEffect(() => {
    if (isEmpty(userRecord)) return;

    const {
      u_id,
      u_name,
      u_email,
      u_mobile,
      u_role,
      emp_type,
      emp_salary,
      emp_date_joining,
      emp_residential_address,
    } = userRecord;

    setValue("e_user_id", u_id);
    u_name && setValue("e_name", u_name);
    u_email && setValue("user.u_email", u_email);
    setValue("e_mobile", u_mobile);
    setValue("user.u_role", u_role);
    emp_type && setValue("e_type", emp_type);
    emp_salary && setValue("e_salary", emp_salary);
    emp_date_joining && setValue("e_date_of_joining", emp_date_joining);
    emp_residential_address &&
      setValue("e_residential_address", emp_residential_address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page !== "edit") return;

    const ids = rest?.record?.shifts
      ?.filter(({ s_is_active }) => s_is_active === 1)
      ?.map((shift) => shift?.s_id);

    const holidayTypes = rest?.record?.holidays?.map(
      (item) => item?.eh_holiday_type
    );

    setValue("eShiftType", rest?.record?.shifts?.[0]?.s_shift_type);
    setValue("shifts", ids);
    setValue("holidaysSelect", holidayTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.record]);

  useEffect(() => {
    if (page === "create" && values?.e_rank_id) {
      const singleRank = rankData?.find(
        (option) => option.r_id === values?.e_rank_id
      );
      setValue("e_sick_leaves", singleRank.r_sick_leaves);
      setValue("e_casual_leaves", singleRank.r_casual_leaves);
      setValue("e_annual_leaves", singleRank.r_annual_leaves);
      setValue("e_compensatory_leaves", singleRank.r_compensatory_leaves);
      setValue("e_maternity_leaves", singleRank.r_maternity_leaves);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.e_rank_id]);
  const accountMode = useGetTaxonomiesByVocabulary({
    fetchKey: "payment_mode",
  });
  const accountModeChoices = !!accountMode?.length
    ? accountMode.map(({ t_title, t_machine_name }) => ({
        id: t_machine_name,
        name: capitalizeFirstLetterOfEachWord(t_title),
      }))
    : [];

  const shiftsChoices = shiftData?.filter(
    ({ s_shift_type }) => values?.eShiftType === s_shift_type
  );

  if (values) {
    values.holidays = values.e_dynamic_leave_mode
      ? ["weekend_dynamic"]
      : values.holidaysSelect || [];
  }

  return (
    <>
      <AroggaAccordion title="Employee Primary Data">
        <ReferenceInput
          source="e_user_id"
          label="User"
          variant="outlined"
          helperText={false}
          reference="v1/users"
          onSelect={(user) => setSelectedUserInfo(user)}
          disabled={page === "edit"}
          fullWidth
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionValue="u_id"
            helperText={false}
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
          />
        </ReferenceInput>
        <TextInput
          source="e_name"
          label="Name"
          variant="outlined"
          helperText={false}
          defaultValue={selectedUserInfo.u_name}
          validate={[required()]}
          fullWidth
        />
        <TaxonomiesByVocabularyInput
          fetchKey="gender"
          source="user.u_sex"
          label="Gender"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
        <TextInput
          source="user.u_email"
          label="Email"
          variant="outlined"
          helperText={false}
          defaultValue={selectedUserInfo.u_email}
          disabled={page === "create" && !!selectedUserInfo.u_email}
          fullWidth
        />
        <TextInput
          source="e_mobile"
          label="Mobile"
          variant="outlined"
          helperText={false}
          defaultValue={selectedUserInfo.u_mobile}
          validate={[required()]}
          disabled={
            (page === "create" && !!selectedUserInfo.u_mobile) ||
            page === "edit"
          }
          fullWidth
        />
        <TreeDropdownInput
          reference="/v1/taxonomiesByVocabulary/department"
          source="e_department"
          label="Department"
          keyId="t_id"
          keyParent="t_parent_id"
          optionValue="t_machine_name"
          optionTextValue="t_title"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
        <TreeDropdownInput
          reference="/v1/rank"
          filter={{ _page: 1, _perPage: 5000 }}
          source="e_rank_id"
          label="Designation"
          keyId="r_id"
          keyParent="r_parent"
          keyWeight="r_weight"
          optionTextValue="r_title"
          helperText={false}
          disabledChoice
          fullWidth
        />
        <TaxonomiesByVocabularyInput
          fetchKey="employee_type"
          source="e_type"
          label="Employee Type"
          helperText={false}
          defaultValue="full_time"
          fullWidth
        />
        <UserRoleInput
          source="user.u_role"
          label="User Role"
          variant="outlined"
          helperText={false}
          initialValue={selectedUserInfo.u_role}
          validate={[required()]}
          fullWidth
        />
      </AroggaAccordion>
      <AroggaAccordion title="Employee Other Data">
        <ReferenceInput
          source="e_warehouse_id"
          label="Warehouse"
          variant="outlined"
          helperText={false}
          reference="v1/warehouse"
          filter={{ _orderBy: "w_id" }}
          fullWidth
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionValue="w_id"
            optionText="w_title"
          />
        </ReferenceInput>
        <DateInput
          source="e_date_of_joining"
          label="Date of Joining"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          defaultValue={toFormattedDateTime({
            isDate: true,
            dateString: new Date().toString(),
          })}
          fullWidth
        />
        <DateInput
          source="e_confirmation_date"
          label="Date of Confirmation"
          variant="outlined"
          helperText={false}
          defaultValue={toFormattedDateTime({
            isDate: true,
            dateString: new Date().toString(),
          })}
          fullWidth
        />
        <TaxonomiesByVocabularyInput
          fetchKey="shift_type"
          source="eShiftType"
          label="Shift Type"
          helperText={false}
          onChange={() => setValue("shifts", [])}
          validate={[required()]}
          fullWidth
        />
        <SelectArrayInput
          source="shifts"
          label="Shifts"
          variant="outlined"
          helperText={false}
          choices={!!shiftsChoices?.length ? shiftsChoices : []}
          optionText="s_title"
          optionValue="s_id"
          validate={[required()]}
          fullWidth
        />
      </AroggaAccordion>
      <AroggaAccordion title="Holidays">
        <Tooltip title="Make Employees leave dynamic. If this flag is ON, Employee can apply only for weekend leave. This leave has impact on his salary. You can use this field for shift based employees">
          <FormatedBooleanInput
            source="e_dynamic_leave_mode"
            label="Dynamic Leave Mode"
            onChange={() => setValue("holidaysSelect", [])}
          />
        </Tooltip>
        {!values?.e_dynamic_leave_mode && (
          <TaxonomiesByVocabularyInput
            fetchKey="holiday_type"
            inputType="selectArrayInput"
            source="holidaysSelect"
            label="Holidays"
            helperText={false}
            validate={[required()]}
            fullWidth
          />
        )}
        {!!values?.e_dynamic_leave_mode && (
          <SelectInput
            source="e_weekend_leaves"
            label="Weekend Leaves"
            variant="outlined"
            helperText={false}
            choices={[
              { id: 1, name: "1" },
              { id: 2, name: "2" },
              { id: 3, name: "3" },
              { id: 4, name: "4" },
              { id: 5, name: "5" },
              { id: 0, name: "All Fridays" },
            ]}
            fullWidth
          />
        )}
        {!values?.e_dynamic_leave_mode && (
          <NumberInput
            source="e_sick_leaves"
            label="Sick Leaves"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        )}
        {!values?.e_dynamic_leave_mode && (
          <NumberInput
            source="e_casual_leaves"
            label="Casual Leaves"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        )}
        {!values?.e_dynamic_leave_mode && (
          <NumberInput
            source="e_annual_leaves"
            label="Annual Leaves"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        )}
        {!values?.e_dynamic_leave_mode && (
          <NumberInput
            source="e_compensatory_leaves"
            label="Compensatory Leaves"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        )}
        {!values?.e_dynamic_leave_mode && (
          <NumberInput
            source="e_maternity_leaves"
            label="Maternity Leaves"
            variant="outlined"
            helperText={false}
            fullWidth
          />
        )}
      </AroggaAccordion>
      <AroggaAccordion title="Salary" md={3}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <NumberInput
              source="e_salary"
              label="Salary"
              variant="outlined"
              helperText={false}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <NumberInput
              source="e_salary_tax"
              label="Salary Tax"
              variant="outlined"
              helperText={false}
              fullWidth
            />
          </Grid>
          {page === "edit" && (
            <Grid item xs={12}>
              <SelectInput
                label="Payment Mode"
                source="e_payment_mode"
                variant="outlined"
                choices={[...accountModeChoices]}
                helperText={false}
                validate={[required()]}
                fullWidth
              />
            </Grid>
          )}
          {page === "edit" && values?.e_payment_mode !== "cash" && (
            <Grid item xs={12}>
              <>
                <ReferenceInput
                  source="e_eb_id"
                  label="Employee bank"
                  variant="outlined"
                  helperText={false}
                  reference="v1/employeeBank"
                  filter={{
                    _emp_id: values?.e_id,
                    _status: "active",
                    _payment_type: values?.e_payment_mode,
                  }}
                  filterToQuery={(searchText) => ({
                    _account_title: searchText,
                  })}
                  isRequired
                >
                  <AutocompleteInput
                    matchSuggestion={() => true}
                    optionValue="eb_id"
                    optionText={<BankOptionTextRenderer />}
                    inputText={(record: {
                      eb_account_title?: string;
                      eb_account_no?: string;
                      eb_card_no?: string;
                    }) =>
                      !!record
                        ? `${record?.eb_account_title} ( ${record?.eb_account_no} ${record?.eb_card_no} )`
                        : ""
                    }
                    fullWidth
                    key={values?.e_payment_mode}
                  />
                </ReferenceInput>
              </>
            </Grid>
          )}
          {page === "edit" && values?.e_payment_mode !== "cash" && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => setIsBankDialogOpen(true)}
                // disabled={!values.ei_e_id}
                fullWidth
              >
                Add New Bank
              </Button>
              <EmployeeBankCreateDialog
                open={isBankDialogOpen}
                handleDialogClose={() => setIsBankDialogOpen(false)}
              />
            </Grid>
          )}
        </Grid>
        <Grid container style={{ marginLeft: 15 }}>
          <NumberInput
            source="e_deduction_delay_count"
            label="Deduction Delay Count"
            variant="outlined"
            helperText={false}
            defaultValue={3}
            fullWidth
          />
          <Tooltip title="This option is used to make employees salary addition mode ON/OFF. If on employees salary can be increased for extra shift worked by him">
            <FormatedBooleanInput
              source="e_salary_addition_mode"
              label="Auto Salary Addition Mode"
            />
          </Tooltip>
          <Tooltip title="This option is used to make employees salary deduction mode ON/OFF. If on employees salary can be decreased for less shift worked by him">
            <FormatedBooleanInput
              source="e_salary_deduction_mode"
              label="Auto Salary Deduction Mode"
            />
          </Tooltip>
          <Tooltip title="This option is used to make employees delay salary deduction mode ON/OFF. If on employees salary can be decreased for delay attendance by him">
            <FormatedBooleanInput
              source="e_delay_salary_deduction_mode"
              label="Auto Delay Salary Deduction Mode"
            />
          </Tooltip>
        </Grid>
      </AroggaAccordion>
    </>
  );
};

export default EmployeeCreateEdit;
