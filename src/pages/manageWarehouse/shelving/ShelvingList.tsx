import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  Link,
  List,
  ListProps,
  RaRecord as Record,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ShelvingExpand from "./ShelvingExpand";
import ShelvingFilter from "./ShelvingFilter";

const ShelvingList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Shelving List");
  const { permissions } = usePermissions();
  const classes = useAroggaStyles();
  const exporter = useExport(rest);

  return (
    <List
      {...rest}
      title="List of Shelving"
      filters={<ShelvingFilter children={""} />}
      perPage={25}
      filter={{ _parent: 1 }}
      sort={{ field: "s_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid
        expand={<ShelvingExpand />}
        // classes={{ expandedPanel: classes.expandedPanel }}
        bulkActionButtons={false}
      >
        <TextField source="s_id" label="ID" />
        <FunctionField
          label="Entity"
          sortBy="s_master_id"
          className={classes.capitalize}
          render={({ s_master_id, s_entity }: Record) => (
            <Link
              to={`/v1/${
                s_entity === "purchase" ? "productPurchase" : "shipment"
              }/${s_master_id}/show`}
            >
              {s_entity}
            </Link>
          )}
        />
        <FunctionField
          label="QC"
          sortBy="s_qc_id"
          render={({ s_qc_id }: Record) => {
            if (!s_qc_id) return;

            return (
              <Link to={`/v1/qualityControl/${s_qc_id}/show`}>{s_qc_id}</Link>
            );
          }}
        />
      </Datagrid>
    </List>
  );
};

export default ShelvingList;
