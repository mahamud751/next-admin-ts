import {
  AutocompleteInput,
  FunctionField,
  NumberInput,
  RaRecord as Record,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useGetTaxonomiesByVocabulary } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import BankOptionTextRenderer from "../employeeInfo/BankOptionTextRenderer";
import YearSelectInput from "@/components/common/YearSelectInput";

const SalaryEditPage = () => {
  const { setValue } = useFormContext();
  const { values } = useWatch();

  const accountMode = useGetTaxonomiesByVocabulary({
    fetchKey: "payment_mode",
  });
  const accountModeChoices = !!accountMode?.length
    ? accountMode.map(({ t_title, t_machine_name }) => ({
        id: t_machine_name,
        name: capitalizeFirstLetterOfEachWord(t_title),
      }))
    : [];
  return (
    <div style={{ width: "362px", display: "flex", flexDirection: "column" }}>
      <TextInput source="s_id" label="Id" variant="outlined" disabled />
      <ReferenceInput
        source="s_employee_id"
        label="Employee"
        variant="outlined"
        reference="v1/employee"
        filterToQuery={(searchText) => ({
          _search: searchText,
        })}
        fullWidth
        disabled
      >
        <AutocompleteInput
          matchSuggestion={() => true}
          optionValue="e_id"
          optionText="e_name"
        />
      </ReferenceInput>
      <YearSelectInput source="s_year" variant="outlined" disabled />
      <TextInput source="s_month" label="Month" variant="outlined" disabled />
      <NumberInput
        source="s_gross_salary"
        label="Gross Salary"
        variant="outlined"
        disabled
      />
      <NumberInput
        source="s_gross_addition"
        label="Gross Addition"
        variant="outlined"
        disabled
      />
      <NumberInput
        source="s_gross_deduction"
        label="Gross Deduction"
        variant="outlined"
        disabled
      />
      <NumberInput source="s_tax" label="Tax" variant="outlined" disabled />
      <NumberInput
        source="s_net_payable"
        label="Net Payable"
        variant="outlined"
        disabled
      />

      <SelectInput
        label="Account Type"
        id="test22"
        source="s_payment_mode"
        variant="outlined"
        choices={[...accountModeChoices]}
        validate={[required()]}
        onChange={() => {
          values("s_eb_id", "");
        }}
      />
      {values.s_payment_mode && values.s_payment_mode !== "cash" && (
        <FunctionField
          label="Bank Name"
          source="s_eb_id"
          render={(dd: Record) => {
            return (
              <ReferenceInput
                label="Bank Name"
                source="s_eb_id"
                variant="outlined"
                reference="v1/employeeBank"
                filter={{
                  _emp_id: dd.s_employee_id,
                  _status: "active",
                  _payment_type: values.s_payment_mode,
                }}
                filterToQuery={(searchText) => ({
                  _search: searchText,
                })}
                fullWidth
              >
                <AutocompleteInput
                  matchSuggestion={() => true}
                  optionText={<BankOptionTextRenderer />}
                  inputText={(record: {
                    eb_account_title?: string;
                    eb_account_no?: string;
                    eb_card_no?: string;
                  }) =>
                    !!record
                      ? `${record.eb_account_title} ( ${record.eb_account_no} ${record.eb_card_no} )`
                      : ""
                  }
                  key={values.s_payment_mode}
                />
              </ReferenceInput>
            );
          }}
        />
      )}

      <TextInput source="s_status" label="Status" variant="outlined" disabled />
    </div>
  );
};

export default SalaryEditPage;
