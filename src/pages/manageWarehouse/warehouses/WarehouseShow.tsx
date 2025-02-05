import { FC } from "react";
import {
  FunctionField,
  RaRecord as Record,
  ReferenceField,
  Show,
  ShowProps,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const WarehouseShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Warehouse Show");

  return (
    <Show {...props}>
      <ColumnShowLayout md={6}>
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
      </ColumnShowLayout>
    </Show>
  );
};

export default WarehouseShow;
