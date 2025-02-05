import { FC } from "react";
import {
  BooleanField,
  Datagrid,
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  TextField,
} from "react-admin";

import {
  useDocumentTitle,
  useExport,
  useNavigateFromList,
} from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import GenericFilter from "./GenericFilter";

const GenericList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Generic List");

  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("genericView", "genericEdit");

  return (
    <List
      {...rest}
      title="List of Generic"
      filters={<GenericFilter children={""} />}
      perPage={25}
      sort={{ field: "g_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid rowClick={navigateFromList} bulkActionButtons={false}>
        <TextField source="g_id" label="ID" />
        <TextField source="g_name" label="Name" />
        <BooleanField
          source="g_is_antibiotics"
          label="Antibiotics?"
          FalseIcon={null}
          looseValue
        />
        <BooleanField
          source="g_is_controlled"
          label="Controlled?"
          FalseIcon={null}
          looseValue
        />
        <FunctionField
          label="Status"
          sortBy="g_status"
          render={(record: Record) => (
            <span
              className={`${classes.capitalize} ${
                record.g_status === "inactive" && classes.textRed
              }`}
            >
              {record?.g_status}
            </span>
          )}
        />
        <TextField source="g_approval_status" label="Approval Status" />
      </Datagrid>
    </List>
  );
};

export default GenericList;
