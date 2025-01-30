import { FC } from "react";
import {
  BooleanField,
  List,
  ListProps,
  ReferenceField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import ProductUnitFilter from "./ProductUnitFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const ProductsUnitList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Product Units List");
  const exporter = useExport(rest);

  return (
    <List
      {...rest}
      title="List of Product Units"
      perPage={25}
      sort={{ field: "pu_multiplier", order: "ASC" }}
      exporter={exporter}
      filters={<ProductUnitFilter children={""} />}
    >
      <CustomizableDatagrid
        hasBulkActions={false}
        hideableColumns={["pu_created_at", "pu_created_by"]}
        bulkActionButtons={false}
      >
        <TextField source="pu_id" label="ID" />
        <TextField source="pu_label" label="Label" />
        <TextField source="pu_multiplier" label="Multiplier" />
        <BooleanField
          source="pu_is_base"
          label="Is Base?"
          //   FalseIcon={() => null}
          looseValue
        />
        <AroggaDateField source="pu_created_at" label="Created At" />
        <ReferenceField
          source="pu_created_by"
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

export default ProductsUnitList;
