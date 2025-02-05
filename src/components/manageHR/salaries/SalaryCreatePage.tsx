import { useEffect, useMemo } from "react";
import {
  AutocompleteInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
} from "react-admin";
import { useFormContext } from "react-hook-form";

import { monthsWithId } from "@/utils/constants";
import { isEmpty, userEmployeeInputTextRenderer } from "@/utils/helpers";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import YearSelectInput from "@/components/common/YearSelectInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const SalaryCreatePage = ({ salaryRecord }) => {
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isEmpty(salaryRecord)) return;

    const { s_employee_id, s_month, s_year } = salaryRecord;

    s_employee_id && setValue("s_employee_id", s_employee_id);
    s_month && setValue("s_month", s_month);
    s_year && setValue("s_year", s_year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const salaryAdjustmentCategory = useMemo(
    () => [
      { id: "loan", name: "Loan" },
      { id: "tax", name: "Tax" },
      { id: "overtime", name: "Overtime" },
      { id: "meal", name: "Meal" },
      { id: "bonus", name: "Bonus" },
    ],
    []
  );

  return (
    <div style={{ width: "256px" }}>
      <ReferenceInput
        source="s_employee_id"
        label="Employee"
        variant="outlined"
        helperText={false}
        reference="v1/employee"
        isRequired
        fullWidth
      >
        <AutocompleteInput
          matchSuggestion={() => true}
          optionValue="e_id"
          optionText={<UserEmployeeOptionTextRenderer isEmployee />}
          inputText={userEmployeeInputTextRenderer}
        />
      </ReferenceInput>
      <YearSelectInput
        source="s_year"
        validate={[required()]}
        helperText={false}
        fullWidth
      />
      <SelectInput
        source="s_month"
        label="Month"
        variant="outlined"
        helperText={false}
        choices={monthsWithId}
        validate={[required()]}
        fullWidth
      />
      <NumberInput
        source="sa_amount"
        label="Amount"
        variant="outlined"
        helperText={false}
        validate={[required()]}
        fullWidth
      />
      <TaxonomiesByVocabularyInput
        fetchKey="salary_adjustment_type"
        source="sa_type"
        label="Type"
        helperText={false}
        validate={[required()]}
        fullWidth
      />
      <SelectInput
        source="sa_category"
        label="Adjustment Category"
        helperText={false}
        choices={salaryAdjustmentCategory}
        variant="outlined"
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="sa_reason"
        label="Reason"
        variant="outlined"
        helperText={false}
        validate={[required()]}
        minRows={2}
        multiline
        fullWidth
      />
    </div>
  );
};

export default SalaryCreatePage;
