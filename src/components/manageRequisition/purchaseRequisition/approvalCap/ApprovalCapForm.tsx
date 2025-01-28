import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import {
  AutocompleteArrayInput,
  AutocompleteArrayInputProps,
  minValue,
  NumberInput,
  ReferenceArrayInput,
  required,
  SelectInput,
  TextInput,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  userEmployeeInputTextRenderer,
} from "@/utils/helpers";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";

// import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const ApprovalCapForm = () => {
  const values = useWatch();
  const { setValue } = useFormContext();
  const [acApproverEntity, setAcApproverEntity] = useState(
    values?.ac_approver_entity
  );
  const ids = values?.ac_approver_entity_ids?.join(",");

  const { data: users } = useRequest(
    `/admin/v1/users?ids=${ids}`,
    {},
    {
      isBaseUrl: true,
      isSuccessNotify: false,
      isWarningNotify: false,
      refreshDeps: [ids],
    }
  );

  const [vendorOptions, setVendorOptions] = useState([]);
  useEffect(() => {
    if (values?.ac_approver_entity != acApproverEntity) {
      setValue("ac_approver_entity_ids", []);
      setVendorOptions([]);
    }
    setAcApproverEntity(values?.ac_approver_entity);
    if (values?.ac_id) {
      setVendorOptions(users);
    }
    if (users) {
      setVendorOptions(users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.ac_approver_entity, acApproverEntity, users]);

  useEffect(() => {
    const currentIds = values?.ac_approver_entity_ids || [];
    setVendorOptions((prevVendorOptions) =>
      prevVendorOptions?.filter((option) => currentIds.includes(option.u_id))
    );
  }, [values?.ac_approver_entity_ids]);

  const handleChange: AutocompleteArrayInputProps["onChange"] = (
    value,
    records
  ) => {
    setVendorOptions((prevVendorOptions) => {
      const exists = prevVendorOptions.some((option) => option.u_id == value);
      return exists ? prevVendorOptions : [...prevVendorOptions, records];
    });
  };

  return (
    <Grid container spacing={2} style={{ width: "100%" }}>
      {!!values.ac_id && (
        <Grid size={{ xs: 6, md: 6 }}>
          <TextInput
            source="ac_id"
            label="ID"
            variant="outlined"
            helperText={false}
            disabled
          />
        </Grid>
      )}
      <Grid size={{ xs: 6, md: 6 }}>
        <TaxonomiesByVocabularyInput
          fetchKey="procurement_title"
          source="ac_procurement_title"
          label="Procurement Title"
          helperText={false}
          validate={[required()]}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <NumberInput
          source="ac_max_threshold_amount"
          label="Ac Max Threshold Amount"
          variant="outlined"
          helperText={false}
          validate={[minValue(0, "Maximum amount can't be negative")]}
          min={0}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <SelectInput
          variant="outlined"
          source="ac_approver_entity"
          choices={[
            { id: "User", name: "User" },
            { id: "Rank", name: "Rank" },
          ]}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        {acApproverEntity === "User" ? (
          <ReferenceArrayInput
            source="ac_approver_entity_ids"
            label="User"
            variant="outlined"
            reference="v1/users"
            helperText={false}
            allowEmpty
          >
            <AutocompleteArrayInput
              //   optionText={<UserEmployeeOptionTextRenderer />}
              optionText={(record) => {
                const userName = record?.u_name;
                const userMobileNo = record?.u_mobile || "";

                return userName && userMobileNo
                  ? `${userName} (${userMobileNo})`
                  : userMobileNo;
              }}
              onChange={handleChange}
              matchSuggestion={() => true}
              inputText={userEmployeeInputTextRenderer}
            />
          </ReferenceArrayInput>
        ) : acApproverEntity === "Rank" ? (
          <ReferenceArrayInput
            source="ac_approver_entity_ids"
            label="Rank"
            variant="outlined"
            reference="v1/rank"
            helperText={false}
            allowEmpty
            resettable
          >
            <AutocompleteArrayInput
              optionText="r_title"
              optionValue="r_id"
              matchSuggestion={() => true}
              disabled={values?.ac_approver_entity_ids?.length === 1}
            />
          </ReferenceArrayInput>
        ) : null}
      </Grid>
      {acApproverEntity === "User" && (
        <Grid size={{ xs: 6, md: 4 }}>
          <NumberInput
            source="ac_minimum_count"
            label="Minimum User Require"
            variant="outlined"
            fullWidth
            validate={[minValue(0, "Count can't be negative")]}
            min={0}
          />
        </Grid>
      )}
      {values?.ac_minimum_count > 0 && acApproverEntity === "User" && (
        <Grid size={{ xs: 4 }}>
          <AutocompleteArrayInput
            source="ac_required_user_ids"
            label="Require Users"
            variant="outlined"
            helperText={false}
            choices={vendorOptions?.map(({ u_id, u_name, u_mobile }) => ({
              id: u_id,
              name: `${capitalizeFirstLetterOfEachWord(u_name)} (${u_mobile})`,
            }))}
            disabled={
              values?.ac_minimum_count === values?.ac_required_user_ids?.length
            }
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ApprovalCapForm;
