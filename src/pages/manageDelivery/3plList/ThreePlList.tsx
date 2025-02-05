import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  List,
  ListProps,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ThreePlListFilter from "./ThreePlListFilter";

const ThreePlList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | 3PL List");

  return (
    <>
      <List
        {...rest}
        title="List of 3PL Company"
        perPage={25}
        sort={{ field: "tc_id", order: "ASC" }}
        filters={<ThreePlListFilter children={""} />}
      >
        <Datagrid rowClick={"edit"} bulkActionButtons={false}>
          <TextField source="tc_id" label="ID" />
          <TextField source="tc_name" label="Name" />
          <FunctionField
            source="tc_status"
            label="Status"
            render={(record) => `${record.tc_status ? "Active" : "Inactive"}`}
          />
          <TextField source="l_count" label="Location Count" />
        </Datagrid>
      </List>
    </>
  );
};
export default ThreePlList;
