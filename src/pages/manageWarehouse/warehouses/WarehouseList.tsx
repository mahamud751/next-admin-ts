import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import WarehouseFilter from "./WarehouseFilter";

const WarehouseList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Warehouse List");

  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList(
    "warehouseView",
    "warehouseEdit"
  );

  return (
    <List
      {...rest}
      title="List of Warehouse"
      filters={<WarehouseFilter children={""} />}
      perPage={25}
      sort={{ field: "w_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid rowClick={navigateFromList} bulkActionButtons={false}>
        <TextField source="w_id" label="ID" />
        <TextField source="w_title" label="Title" />
        <ReferenceField
          source="w_cash_head_id"
          label="Cash Head"
          reference="v1/accountingHead"
          link="show"
        >
          <TextField source="ah_name" />
        </ReferenceField>
        <ReferenceField
          source="w_collector_cash_head_id"
          label="Collector's Cash Head"
          reference="v1/accountingHead"
          link="show"
        >
          <TextField source="ah_name" />
        </ReferenceField>
        <ReferenceField
          source="w_bank_head_id"
          label="Bank Head"
          reference="v1/accountingHead"
          link="show"
        >
          <TextField source="ah_name" />
        </ReferenceField>
        <ReferenceField
          source="w_payable_head_id"
          label="Payable Head"
          reference="v1/accountingHead"
          link="show"
        >
          <TextField source="ah_name" />
        </ReferenceField>
        <ReferenceField
          source="w_receivable_head_id"
          label="Receivable Head"
          reference="v1/accountingHead"
          link="show"
        >
          <TextField source="ah_name" />
        </ReferenceField>
        <ReferenceField
          source="w_stock_head_id"
          label="Stock Head"
          reference="v1/accountingHead"
          link="show"
        >
          <TextField source="ah_name" />
        </ReferenceField>
        <ReferenceField
          source="w_stock_receivable_head_id"
          label="Stock Receivable Head"
          reference="v1/accountingHead"
          link="show"
        >
          <TextField source="ah_name" />
        </ReferenceField>
        <TextField source="w_lat" label="Latitude" />
        <TextField source="w_lon" label="Longitude" />
        <ReferenceField
          source="w_l_id"
          label="Location"
          reference="v1/location"
          sortBy="w_l_id"
          link={false}
        >
          <FunctionField
            render={(record: Record) =>
              !!record
                ? `${record.l_division} -> ${record.l_district} -> ${record.l_area}`
                : ""
            }
          />
        </ReferenceField>
        <TextField source="w_address" label="Address" />
      </Datagrid>
    </List>
  );
};

export default WarehouseList;
