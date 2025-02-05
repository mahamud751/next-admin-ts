import { FC } from "react";
import {
  BooleanField,
  List,
  ListProps,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import VariantFilter from "./VariantFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const VariantList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Variant List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList(
    "variantTypeView",
    "variantTypeEdit"
  );

  return (
    <List
      {...rest}
      title="List of Variant"
      filters={<VariantFilter children={""} />}
      perPage={25}
      sort={{ field: "vt_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={["vt_created_at", "vt_created_by"]}
        bulkActionButtons={permissions?.includes("variantTypeDelete")}
      >
        <TextField source="vt_id" label="ID" />
        <TextField source="vt_title" label="Title" />
        <TextField
          source="vt_field_type"
          label="Field Type"
          className={classes.capitalize}
        />
        <BooleanField
          source="vt_status"
          label="Status?"
          FalseIcon={null}
          looseValue
        />
        <AroggaDateField source="vt_created_at" label="Created At" />
        <ReferenceField
          source="vt_created_by"
          label="Created By"
          reference="v1/users"
          sortBy="u_name"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default VariantList;
