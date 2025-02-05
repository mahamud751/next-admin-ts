import { FC } from "react";
import {
  FunctionField,
  List,
  ListProps,
  NumberField,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import CartExpand from "./CartExpand";
import CartFilter from "./CartFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const CartList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Cart List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();

  return (
    <List
      {...rest}
      title="List of Cart"
      perPage={25}
      sort={{ field: "uc_id", order: "DESC" }}
      filters={<CartFilter children={""} />}
      filterDefaultValues={{ _status: "current" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        expand={<CartExpand />}
        classes={{ expandedPanel: classes.expandedPanel }}
        hideableColumns={[
          "uc_created_at",
          "uc_created_by",
          "uc_modified_at",
          "uc_modified_by",
        ]}
        bulkActionButtons={permissions?.includes("userCartDelete")}
      >
        <TextField source="uc_id" label="ID" />
        <ReferenceField
          source="uc_created_by"
          label="User"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <ReferenceField
          source="uc_user_location_id"
          label="Location"
          reference="v1/userLocations"
          link="show"
        >
          <FunctionField
            render={(record: Record) =>
              // TODO: Have to separate this into a component
              `${record.ul_location} (${record.ul_name}, ${record.ul_mobile})`
            }
          />
        </ReferenceField>
        <ReferenceField
          source="uc_coupon_id"
          label="Coupon"
          reference="v1/productDiscount"
          link="show"
        >
          <TextField source="pd_name" />
        </ReferenceField>
        <NumberField source="uc_count" label="Count" />
        <NumberField source="uc_total" label="Total" />
        <TextField
          source="uc_status"
          label="Status"
          className={classes.capitalize}
        />
        <AroggaDateField source="uc_created_at" label="Created At" />
        <AroggaDateField source="uc_modified_at" label="Modified At" />
        <ReferenceField
          source="uc_modified_by"
          label="Modified By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default CartList;
