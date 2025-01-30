import { Chip } from "@mui/material";
import { FC } from "react";
import {
  BooleanField,
  Datagrid,
  EmailField,
  FunctionField,
  Labeled,
  Link,
  NumberField,
  RaRecord,
  ReferenceArrayField,
  ReferenceField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { capitalizeFirstLetterOfEachWord, isEmpty } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import CustomChipField from "@/components/common/CustomChipField";
import AroggaDateField from "@/components/common/AroggaDateField";

const ProductDiscountShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Product Discount Show");

  const classes = useAroggaStyles();

  return (
    <Show {...rest}>
      <SimpleShowLayout>
        <ColumnShowLayout md={4} simpleShowLayout={false}>
          <TextField source="pd_id" label="ID" />
          <TextField source="pd_name" label="Name" />
          <TextField
            source="pd_coupon_usage_count"
            label="Coupon Usage Count"
          />
          <FunctionField
            label="Status"
            render={(record: RaRecord) => (
              <span
                className={`${classes.capitalize} ${
                  record.pd_status === "inactive" && classes.textRed
                }`}
              >
                {record?.pd_status}
              </span>
            )}
          />
          <TextField
            source="pd_discount_type"
            label="Discount Type"
            className={classes.capitalize}
          />
          <CustomChipField source="pd_service_type" label="Service" />
          <TextField
            source="pd_type"
            label="Type"
            className={classes.capitalize}
          />
          <NumberField source="pd_type_amount" label="Type Amount" />
          <NumberField source="pd_max_discount" label="Max Discount" />
          <TextField source="pd_min_order_value" label="Min Order Value" />
          <TextField
            source="pd_total_usable_count"
            label="Total Usable Count"
          />
          <TextField
            source="pd_per_user_usable_count"
            label="Per User Usable Count"
          />
          <TextField
            source="pd_discount_usage_count"
            label="Discount Usage Count"
          />
          <AroggaDateField source="pd_start_date" label="Start Date" />
          <AroggaDateField source="pd_end_date" label="End Date" />
          <BooleanField
            source="pd_on_first_order"
            label="First Order?"
            looseValue
          />
          <AroggaDateField source="pd_created_at" label="Created At" />
          <ReferenceField
            source="pd_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <AroggaDateField source="pd_modified_at" label="Modified At" />
          <ReferenceField
            source="pd_modified_by"
            label="Modified By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </ColumnShowLayout>
        <ArgReferenceArrayField
          source="pd_user_ids"
          label="Users"
          classes={classes}
        />
        <ArgReferenceArrayField
          source="pd_ref_partner_ids"
          label="Partners"
          classes={classes}
        />
        <FunctionField
          label="Roles"
          render={({ pd_user_roles }: RaRecord) => {
            if (isEmpty(pd_user_roles)) return;

            return pd_user_roles
              .filter((roleName) => roleName)
              .map((roleName, i) => (
                <Chip
                  key={i}
                  label={capitalizeFirstLetterOfEachWord(roleName)}
                  variant="outlined"
                  color="primary"
                  style={{
                    marginRight: 6,
                    marginBottom: 6,
                  }}
                />
              ));
          }}
        />
      </SimpleShowLayout>
    </Show>
  );
};

export default ProductDiscountShow;

const ArgReferenceArrayField = ({ label, classes, ...rest }) => (
  <Labeled label={label}>
    <ReferenceArrayField reference="v1/users" source={rest.source}>
      <Datagrid rowClick="show">
        <TextField source="u_id" label="ID" />
        <FunctionField
          label="Name"
          sortBy="u_name"
          render={({ u_id, u_name }: RaRecord) => (
            <Link to={`/v1/users/${u_id}/show`}>{u_name}</Link>
          )}
        />
        <TextField source="u_mobile" label="Mobile" />
        <EmailField source="u_email" label="Email" />
        <TextField
          source="u_role"
          label="Role"
          className={classes.capitalize}
        />
        <FunctionField
          label="Status"
          render={(record: RaRecord) => (
            <span
              className={`${classes.capitalize} ${
                record.u_status === "inactive" && classes.textRed
              }`}
            >
              {record?.u_status}
            </span>
          )}
        />
      </Datagrid>
    </ReferenceArrayField>
  </Labeled>
);
