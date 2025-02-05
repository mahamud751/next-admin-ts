import {
  Datagrid,
  FunctionField,
  Pagination,
  RaRecord as Record,
  ReferenceField,
  ReferenceManyField,
  TextField,
} from "react-admin";

import { getQuantityLabel } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const AuditSystemExpand = (props) => {
  const classes = useAroggaStyles();

  return (
    <ReferenceManyField
      reference="v1/stockAudit"
      target="_variant"
      filter={{
        _status: props?.record?.sa_status,
        _variant: props?.record?.sa_variant_id,
      }}
      perPage={25}
      pagination={<Pagination />}
    >
      <Datagrid>
        <AroggaDateField source="sa_created_at" label="Date & Time" />
        <FunctionField
          source="sa_lost"
          label="Lost"
          sortBy="sa_lost"
          className={classes.whitespaceNowrap}
          render={({
            sa_lost: qty,
            base_pu_label: baseUnit,
            b2c_pu_label: salesUnit,
            base_pu_multiplier: salesUnitMultiplier,
            b2c_pu_multiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit,
              baseUnit,
              salesUnitMultiplier,
              baseUnitMultiplier: qty / b2c_pu_multiplier,
            })
          }
        />
        <FunctionField
          source="sa_found"
          label="Found"
          sortBy="sa_found"
          className={classes.whitespaceNowrap}
          render={({
            sa_found: qty,
            base_pu_label: baseUnit,
            b2c_pu_label: salesUnit,
            base_pu_multiplier: salesUnitMultiplier,
            b2c_pu_multiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit,
              baseUnit,
              salesUnitMultiplier,
              baseUnitMultiplier: qty / b2c_pu_multiplier,
            })
          }
        />
        <FunctionField
          source="sa_expired"
          label="Expired"
          sortBy="sa_expired"
          render={({ sa_expired }: Record) => sa_expired || ""}
        />
        <FunctionField
          source="sa_damaged"
          label="Damage"
          sortBy="sa_damaged"
          className={classes.whitespaceNowrap}
          render={({
            sa_damaged: qty,
            base_pu_label: baseUnit,
            b2c_pu_label: salesUnit,
            base_pu_multiplier: salesUnitMultiplier,
            b2c_pu_multiplier,
          }: Record) =>
            getQuantityLabel({
              qty,
              salesUnit,
              baseUnit,
              salesUnitMultiplier,
              baseUnitMultiplier: qty / b2c_pu_multiplier,
            })
          }
        />
        <ReferenceField
          source="sa_audited_by"
          label="Audit By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </Datagrid>
    </ReferenceManyField>
  );
};

export default AuditSystemExpand;
