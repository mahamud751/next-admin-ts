import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
  useRefresh,
} from "react-admin";
import { useWatch, useFormContext } from "react-hook-form";
import { useRequest } from "@/hooks";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type NewExpiredDialogProps = {
  open: boolean;
  handleDialogClose: () => void;
};

const NewBankDialog: FC<NewExpiredDialogProps> = ({
  open,
  handleDialogClose,
}) => {
  const refresh = useRefresh();
  const { values } = useWatch();
  const { setValue } = useFormContext();

  const body = {
    eb_emp_id: values.ei_e_id,
    bankName: values.bankName,
    eb_bank_id: values.eb_bank_id,
    eb_account_title: values.eb_account_title,
    eb_payment_type: values.eb_payment_type,
    eb_account_no: values.eb_account_no,
    eb_card_no: values.eb_card_no,
    eb_client_id: values.eb_client_id,
    eb_status: values.eb_status,
  };

  const { isLoading, refetch } = useRequest(
    `/v1/employeeBank`,
    {
      method: "POST",
      body: body,
    },
    {
      onSuccess: () => {
        handleDialogClose();

        refresh();
      },
    }
  );

  const { data } = useRequest("/v1/bankNames", {}, { isPreFetching: true });
  const { data: bank } = useRequest(`/v1/bank?ids=${values.eb_bank_id}`, {});

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>Add new bank</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={6} md={6}>
            <AutocompleteInput
              source="bankName"
              label="Bank"
              variant="outlined"
              helperText={false}
              choices={!!data?.length ? data : []}
              defaultValue={bank?.[0].b_name}
              onChange={() => setValue("eb_bank_id", undefined)}
              optionValue="b_name"
              optionText="b_name"
              validate={[required()]}
              fullWidth
            />
          </Grid>
          {values.bankName && (
            <Grid item xs={6} sm={6} md={6}>
              <ReferenceInput
                source="eb_bank_id"
                label="Branch"
                variant="outlined"
                helperText={false}
                reference="v1/bank"
                sort={{ field: "b_id", order: "DESC" }}
                filter={{ _name: values.bankName }}
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
          <Grid item xs={6} sm={6} md={6}>
            <TextInput
              source="eb_account_title"
              label="Bank Account Title"
              variant="outlined"
              helperText={false}
              validate={[required()]}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <SelectInput
              label="Account Type"
              source="eb_payment_type"
              variant="outlined"
              helperText={false}
              choices={[
                { id: "account", name: "Account" },
                { id: "card", name: "Card" },
              ]}
              validate={[required()]}
              fullWidth
            />
          </Grid>
          {values.eb_payment_type === "account" && (
            <Grid item xs={6} sm={6} md={6}>
              <TextInput
                source="eb_account_no"
                label="Bank Account Number"
                variant="outlined"
                helperText={false}
                fullWidth
              />
            </Grid>
          )}
          {values.eb_payment_type === "card" && (
            <>
              <Grid item xs={6} sm={6} md={6}>
                <NumberInput
                  source="eb_card_no"
                  label="Card Number"
                  variant="outlined"
                  helperText={false}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <TextInput
                  source="eb_client_id"
                  label="Client ID"
                  variant="outlined"
                  helperText={false}
                  validate={values.eb_card_no ? [required()] : null}
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
              validate={[required()]}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={handleDialogClose}
        onConfirm={refetch}
        disabled={
          !values.bankName ||
          !values.eb_bank_id ||
          !values.eb_account_title ||
          // !values.eb_account_no ||
          !values.eb_status ||
          !values.eb_account_title.trim()
          // !values.eb_account_no.trim()
        }
      />
    </Dialog>
  );
};

export default NewBankDialog;
