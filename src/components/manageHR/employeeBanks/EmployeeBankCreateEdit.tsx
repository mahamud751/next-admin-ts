import { Grid } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useGetTaxonomiesByVocabulary, useRequest } from "../../../hooks";
import { capitalizeFirstLetterOfEachWord } from "../../../utils/helpers";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

type EmployeeBankCreateEditProps = {
  page: "create" | "edit";
};

const EmployeeBankCreateEdit: FC<EmployeeBankCreateEditProps> = ({ page }) => {
  const { setValue } = useFormContext();
  const { values } = useWatch();

  const { data } = useRequest("/v1/bankNames", {}, { isPreFetching: true });
  const { data: bank } = useRequest(
    `/v1/bank?ids=${values?.eb_bank_id}`,
    {},
    { isPreFetching: page === "edit" }
  );
  const accountType = useGetTaxonomiesByVocabulary({
    fetchKey: "payment_mode",
  });
  const accountTypeChoices = !!accountType?.length
    ? accountType
        .filter((item) => item.t_machine_name !== "cash")
        .map(({ t_title, t_machine_name }) => ({
          id: t_machine_name,
          name: capitalizeFirstLetterOfEachWord(t_title),
        }))
    : [];
  const changeCardInfo = (e) => {
    if (values?.eb_payment_type === "card") {
      setValue("eb_account_no", "");
      setValue("eb_client_id", "");
    } else {
      setValue("eb_card_no", "");
      setValue("eb_client_id", "");
    }
  };

  return (
    <>
      <ReferenceInput
        source="eb_emp_id"
        label="Employee"
        variant="outlined"
        helperText={false}
        reference="v1/employee"
        sort={{ field: "e_id", order: "DESC" }}
        isRequired
      >
        <AutocompleteInput
          matchSuggestion={() => true}
          optionValue="e_id"
          optionText={<UserEmployeeOptionTextRenderer isEmployee />}
          inputText={(record: { e_name: string; e_mobile: string }) =>
            !!record ? `${record.e_name} (${record.e_mobile})` : ""
          }
        />
      </ReferenceInput>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4}>
          <AutocompleteInput
            source="bankName"
            label="Bank"
            variant="outlined"
            helperText={false}
            choices={!!data?.length ? data : []}
            defaultValue={bank?.[0]?.b_name}
            onChange={() => setValue("eb_bank_id", undefined)}
            optionValue="b_name"
            optionText="b_name"
            validate={[required()]}
            fullWidth
          />
        </Grid>
        {values?.bankName && (
          <Grid item xs={12} sm={6} md={4}>
            <ReferenceInput
              source="eb_bank_id"
              label="Branch"
              variant="outlined"
              helperText={false}
              reference="v1/bank"
              sort={{ field: "b_id", order: "DESC" }}
              filter={{ _name: values?.bankName }}
              filterToQuery={(searchText) => ({
                _branch: searchText,
              })}
              isRequired
              fullWidth
            >
              <AutocompleteInput optionValue="b_id" optionText="b_branch" />
            </ReferenceInput>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={4}>
          <TextInput
            source="eb_account_title"
            label="Account Name"
            variant="outlined"
            helperText={false}
            validate={[required()]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SelectInput
            label="Account Type"
            source="eb_payment_type"
            variant="outlined"
            choices={[...accountTypeChoices]}
            helperText={false}
            validate={[required()]}
            onChange={changeCardInfo}
            fullWidth
          />
        </Grid>
        {values?.eb_payment_type !== "card" && (
          <Grid item xs={12} sm={6} md={4}>
            <TextInput
              source="eb_account_no"
              label="Account Number"
              variant="outlined"
              helperText={false}
              validate={[required()]}
              fullWidth
            />
          </Grid>
        )}
        {values?.eb_payment_type === "card" && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <NumberInput
                source="eb_card_no"
                label="Card Number"
                variant="outlined"
                helperText={false}
                validate={[required()]}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextInput
                source="eb_client_id"
                label="Client ID"
                variant="outlined"
                helperText={false}
                validate={values?.eb_card_no ? [required()] : null}
                fullWidth
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6} md={2}>
          <TaxonomiesByVocabularyInput
            fetchKey="bank_account_status"
            source="eb_status"
            label="Status"
            variant="outlined"
            helperText={false}
            validate={[required()]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeBankCreateEdit;
