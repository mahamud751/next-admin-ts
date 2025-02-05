import AcUnitIcon from "@mui/icons-material/AcUnit";
import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  Link,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { getReadableSKU } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import RequestStockFilter from "./RequestStockFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const RequestStockList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Request Stock List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();

  return (
    <List
      {...rest}
      title="List of Request Stock"
      filters={<RequestStockFilter children={""} />}
      perPage={25}
      sort={{ field: "prs_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="prs_id" label="ID" />
        <AroggaDateField source="prs_created_at" label="Request Created" />
        <ReferenceField
          source="prs_user_id"
          label="Requested By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <FunctionField
          label="Product"
          render={({ prs_product }: Record) => (
            <Link to={`/v1/product/${prs_product?.p_id}/edit`}>
              {prs_product?.p_name}
            </Link>
          )}
        />
        <ReferenceField
          source="prs_product_variant_id"
          label="Variant"
          reference="v1/productVariant"
          link={false}
        >
          <FunctionField
            render={(record: Record) => getReadableSKU(record.pv_attribute)}
          />
        </ReferenceField>
        <FunctionField
          label="Form"
          render={({ prs_product }: Record) => prs_product?.p_form}
        />
        <FunctionField
          label="Strength"
          render={({ prs_product }: Record) => prs_product?.p_strength}
        />
        <FunctionField
          label="Cold"
          render={({ prs_product }: Record) => {
            if (!prs_product?.p_cold) return;
            return <AcUnitIcon />;
          }}
        />
        <FunctionField
          label="Type"
          render={({ prs_product }: Record) => (
            <span className={classes.capitalize}>{prs_product?.p_type}</span>
          )}
        />
      </Datagrid>
    </List>
  );
};

export default RequestStockList;
