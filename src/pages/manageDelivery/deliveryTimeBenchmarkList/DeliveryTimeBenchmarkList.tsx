import { FC } from "react";
import {
  Datagrid,
  List,
  ListProps,
  ReferenceField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";

const DeliveryTimeBenchmarkList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Delivery Time Benchmark");
  const exporter = useExport(rest);

  return (
    <List
      {...rest}
      title="List of Delivery Time"
      perPage={25}
      sort={{ field: "id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" label="Id" />
        <ReferenceField source="zone" reference="v1/zone" link={false}>
          <TextField source="z_name" label="Zone" />
        </ReferenceField>
        <TextField source="courier" label="Courier" />
        <TextField source="delivery_count" label="Delivery Count" />
        <TextField source="avg_time_hrs" label="Avg Time (hrs)" />
      </Datagrid>
    </List>
  );
};

export default DeliveryTimeBenchmarkList;
