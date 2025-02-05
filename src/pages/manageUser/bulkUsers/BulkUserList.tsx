import { FC } from "react";
import {
  FileField,
  List,
  ListProps,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import BulkUserFilter from "./BulkUserFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const BulkUserList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Bulk User List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();

  return (
    <List
      {...rest}
      title="List of Bulk User"
      filters={<BulkUserFilter children={""} />}
      perPage={25}
      sort={{ field: "bucr_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick="show"
        hideableColumns={["bucr_created_by"]}
        bulkActionButtons={permissions?.includes("bulkUserCreateRequestDelete")}
      >
        <TextField source="bucr_id" label="ID" />
        <TextField source="bucr_title" label="Title" />
        <FileField
          source="bucr_csv_file"
          src="src"
          title="Attached Files"
          target="_blank"
          label="Attached Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
        <TextField
          source="bucr_request_status"
          label="Request Status"
          className={classes.capitalize}
        />
        <TextField
          source="bucr_request_error_count"
          label="Request Error Count"
        />
        <TextField
          source="bucr_previous_exists_user_count"
          label="Previous Exists User Count"
        />
        <TextField
          source="bucr_created_user_count"
          label="Created User Count"
        />
        <AroggaDateField source="bucr_created_at" label="Created At" />
        <ReferenceField
          source="bucr_created_by"
          label="Created By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default BulkUserList;
