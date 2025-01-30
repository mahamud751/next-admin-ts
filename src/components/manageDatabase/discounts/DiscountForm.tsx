import { Grid } from "@mui/material";
import {
  AutocompleteArrayInput,
  DateTimeInput,
  NumberInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
  TextInput,
  minValue,
  required,
} from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  toFormattedDateTime,
} from "@/utils/helpers";

import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
const DiscountForm = () => {
  const values = useWatch();

  const { data } = useRequest("/v1/roles", {}, { isPreFetching: true });

  const validateDateRange = (value, allValues, params) => {
    if (!value) return;

    const startDate = allValues.pd_start_date
      ? new Date(allValues.pd_start_date)
      : null;
    const endDate = allValues.pd_end_date
      ? new Date(allValues.pd_end_date)
      : null;

    const isStartDate = params.name === "pd_start_date";

    if (startDate && endDate && startDate.valueOf() === endDate.valueOf()) {
      const dateType = isStartDate ? "Start" : "End";
      return `${dateType} date & time can't be same as ${
        isStartDate ? "end" : "start"
      } date & time`;
    }

    if (startDate && endDate && startDate > endDate) {
      const dateType = isStartDate ? "Start" : "End";
      const comparisonType = isStartDate ? "greater" : "less";
      return `${dateType} date & time can't be ${comparisonType} than ${
        isStartDate ? "end" : "start"
      } date & time`;
    }
  };

  return (
    <Grid container spacing={1}>
      {values.pd_id && (
        <Grid item sm={6} md={4}>
          <TextInput
            source="pd_id"
            label="ID"
            variant="outlined"
            helperText={false}
            fullWidth
            readOnly
          />
        </Grid>
      )}
      <Grid item sm={6} md={4}>
        <TextInput
          source="pd_name"
          label="Name"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <SelectInput
          source="pd_status"
          label="Status"
          variant="outlined"
          choices={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <SelectInput
          source="pd_discount_type"
          label="Discount Type"
          variant="outlined"
          defaultValue="coupon"
          choices={[
            { id: "coupon", name: "Coupon" },
            // TODO: Uncomment this when offer feature is ready
            // { id: "offer", name: "Offer" },
          ]}
          helperText={false}
          validate={[required()]}
          fullWidth
          readOnly
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <SelectArrayInput
          source="pd_service_type"
          label="Service"
          variant="outlined"
          choices={[
            { id: "Ecommerce", name: "Ecommerce" },
            { id: "LabTest", name: "Lab Test" },
          ]}
          helperText={false}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <SelectInput
          source="pd_type"
          label="Type"
          variant="outlined"
          choices={[
            { id: "fixed", name: "Fixed" },
            { id: "percentage", name: "Percentage" },
            { id: "freeDelivery", name: "Free Delivery" },
          ]}
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <NumberInput
          source="pd_type_amount"
          label="Type Amount"
          variant="outlined"
          helperText={false}
          validate={[minValue(0, "Type amount can't be negative")]}
          min={0}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <NumberInput
          source="pd_max_discount"
          label="Max Discount"
          variant="outlined"
          helperText={false}
          validate={[minValue(0, "Max discount can't be negative")]}
          min={0}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <NumberInput
          source="pd_min_order_value"
          label="Min Order Value"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minValue(0, "Min order value can't be negative"),
          ]}
          min={0}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <NumberInput
          source="pd_total_usable_count"
          label="Total Usable Count"
          variant="outlined"
          helperText={false}
          validate={[minValue(0, "Total usable count can't be negative")]}
          min={0}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <NumberInput
          source="pd_per_user_usable_count"
          label="Per User Usable Count"
          variant="outlined"
          helperText={false}
          validate={[minValue(0, "Per user usable count can't be negative")]}
          min={0}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <DateTimeInput
          source="pd_start_date"
          label="Start Date"
          variant="outlined"
          parse={(dateTime) =>
            toFormattedDateTime({
              dateString: dateTime,
            })
          }
          validate={[validateDateRange]}
          helperText={false}
          fullWidth
        />
      </Grid>
      <Grid item sm={6} md={4}>
        <DateTimeInput
          source="pd_end_date"
          label="End Date"
          variant="outlined"
          parse={(dateTime) =>
            toFormattedDateTime({
              dateString: dateTime,
            })
          }
          validate={[validateDateRange]}
          helperText={false}
          fullWidth
        />
      </Grid>
      <Grid item sm={12}>
        <ReferenceArrayInput
          source="pd_user_ids"
          label="User"
          variant="outlined"
          reference="v1/users"
          helperText={false}
          allowEmpty
        >
          <AutocompleteArrayInput
            optionText={(record) => {
              const userName = record?.u_name;
              const userMobileNo = record?.u_mobile || "";

              return userName && userMobileNo
                ? `${userName} (${userMobileNo})`
                : userMobileNo;
            }}
            // optionText={<UserEmployeeOptionTextRenderer />}
            matchSuggestion={() => true}
          />
        </ReferenceArrayInput>
      </Grid>
      <Grid item sm={12}>
        <ReferenceArrayInput
          source="pd_ref_partner_ids"
          label="Partner"
          variant="outlined"
          reference="v1/users"
          filter={{ _role: "partner" }}
          helperText={false}
          allowEmpty
        >
          <AutocompleteArrayInput
            optionText={(record) => {
              const userName = record?.u_name;
              const userMobileNo = record?.u_mobile || "";

              return userName && userMobileNo
                ? `${userName} (${userMobileNo})`
                : userMobileNo;
            }}
            // optionText={<UserEmployeeOptionTextRenderer />}
            matchSuggestion={() => true}
          />
        </ReferenceArrayInput>
      </Grid>
      <Grid item sm={12}>
        <AutocompleteArrayInput
          source="pd_user_roles"
          label="Role"
          variant="outlined"
          helperText={false}
          choices={data?.map(({ role_name }) => ({
            id: role_name,
            name: capitalizeFirstLetterOfEachWord(role_name),
          }))}
          allowEmpty
        />
      </Grid>
      <Grid item sm={12}>
        <FormatedBooleanInput source="pd_on_first_order" label="First Order?" />
      </Grid>
    </Grid>
  );
};

export default DiscountForm;
