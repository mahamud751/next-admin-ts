import {
  Datagrid,
  FunctionField,
  Link,
  RaRecord as Record,
  ReferenceField,
  TextField,
} from "react-admin";

import { useEffect } from "react";
import { getReadableSKU } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

const AuditSystemCreateDatagrid = ({ setSelectedVariantIds, ...rest }) => {
  const classes = useAroggaStyles();

  useEffect(() => {
    setSelectedVariantIds(rest?.selectedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest?.selectedIds]);

  return (
    <Datagrid>
      <TextField source="pv_id" label="ID" />
      <FunctionField
        label="Name"
        sortBy="p_name"
        render={({ p_id, p_name }: Record) => (
          <Link to={`/v1/product/${p_id}/edit`}>{p_name}</Link>
        )}
      />
      <FunctionField
        label="Attributes"
        render={({ pv_attribute }: Record) => getReadableSKU(pv_attribute)}
      />
      <ReferenceField
        source="p_brand_id"
        label="Brand"
        reference="v1/productBrand"
        sortBy="p_brand_id"
        link="show"
      >
        <TextField source="pb_name" />
      </ReferenceField>
      <TextField
        source="p_type"
        label="Category"
        className={classes.capitalize}
      />
      <TextField source="rack_ids" label="Rack ID" />
    </Datagrid>
  );
};

export default AuditSystemCreateDatagrid;
