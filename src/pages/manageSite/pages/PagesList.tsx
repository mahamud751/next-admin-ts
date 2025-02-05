import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const PagesList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Page List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("pageView", "pageEdit");

  return (
    <List
      {...rest}
      title="List of Page"
      perPage={25}
      sort={{ field: "p_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid
        rowClick={navigateFromList}
        bulkActionButtons={permissions?.includes("pageDelete")}
      >
        <TextField source="p_id" label="ID" />
        <AroggaDateField source="p_created" label="Created At" />
        <TextField source="p_title" label="Title" />
        <TextField source="p_slug" label="Slug" />
        <FunctionField
          label="Status"
          sortBy="p_status"
          render={(record: Record) => (
            <span
              className={`${classes.capitalize} ${
                record.p_status === "pending" && classes.textRed
              }`}
            >
              {record?.p_status}
            </span>
          )}
        />
      </Datagrid>
    </List>
  );
};

export default PagesList;
