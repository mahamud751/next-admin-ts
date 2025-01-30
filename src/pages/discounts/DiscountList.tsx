import { FC } from "react";
import {
  BooleanField,
  FunctionField,
  List,
  ListProps,
  NumberField,
  RaRecord,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import "../../assets/style.css";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import DiscountFilter from "./DiscountFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const DiscountList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Discount List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList(
    "productDiscountView",
    "productDiscountEdit"
  );

  return (
    <List
      {...rest}
      title="List of Discount"
      filters={<DiscountFilter children={""} />}
      perPage={25}
      sort={{ field: "pd_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={["pd_created_at", "pd_created_by"]}
        bulkActionButtons={permissions?.includes("productDiscountDelete")}
      >
        <TextField source="pd_id" label="ID" />
        <TextField source="pd_name" label="Name" />
        <TextField source="pd_coupon_usage_count" label="Coupon Usage Count" />
        <FunctionField
          source="pd_status"
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
        <TextField
          source="pd_type"
          label="Type"
          className={classes.capitalize}
        />
        <NumberField source="pd_type_amount" label="Type Amount" />
        <NumberField source="pd_max_discount" label="Max Discount" />
        <TextField source="pd_min_order_value" label="Min Order Value" />
        <TextField source="pd_total_usable_count" label="Total Usable Count" />
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
          //   FalseIcon={() => null}
          looseValue
        />
        <AroggaDateField source="pd_created_at" label="Created At" />
        <ReferenceField
          source="pd_created_by"
          label="Created By"
          reference="v1/users"
          sortBy="pd_created_by"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default DiscountList;
