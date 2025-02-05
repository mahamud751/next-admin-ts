import { FC } from "react";
import {
  BooleanField,
  Datagrid,
  List,
  ListProps,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import BankFilter from "./BankFilter";

const BankList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Bank List");

  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList("bankView", "bankEdit");

  return (
    <List
      {...rest}
      title="List of Bank"
      filters={<BankFilter children={""} />}
      perPage={25}
      sort={{ field: "b_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid rowClick={navigateFromList} bulkActionButtons={false}>
        <TextField source="b_id" label="ID" />
        <TextField source="b_name" label="Name" />
        <TextField source="b_branch" label="Branch" />
        <TextField source="b_routing_number" label="Routing Number" />
        <TextField source="b_short_code" label="Short Code" />
        <BooleanField
          source="b_active"
          label="Active?"
          FalseIcon={null}
          looseValue
        />
      </Datagrid>
    </List>
  );
};

export default BankList;
