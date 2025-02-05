import { FC } from "react";
import {
  ArrayField,
  BooleanField,
  Datagrid,
  FunctionField,
  RaRecord as Record,
  ReferenceField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { capitalizeFirstLetterOfEachWord, isEmpty } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import AroggaDateField from "@/components/common/AroggaDateField";

const VariantShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Variant Show");

  const classes = useAroggaStyles();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout simpleShowLayout={false} md={6}>
          <TextField source="vt_id" label="ID" />
          <TextField source="vt_title" label="Title" />
          <TextField
            source="vt_field_type"
            label="Field Type"
            className={classes.capitalize}
          />
          <BooleanField source="vt_status" label="Status?" looseValue />
          <FunctionField
            label="Allowed Product Type"
            render={({ vt_allowedProductType }: Record) => {
              if (isEmpty(vt_allowedProductType)) return;

              return vt_allowedProductType
                .map((productType) =>
                  capitalizeFirstLetterOfEachWord(productType)
                )
                .join(", ");
            }}
          />
          <AroggaDateField source="vt_created_at" label="Created At" />
          <ReferenceField
            source="vt_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <AroggaDateField source="vt_modified_at" label="Modified At" />
          <ReferenceField
            source="vt_modified_by"
            label="Modified By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </ColumnShowLayout>
        <ArrayField source="vt_config" label="Config">
          <Datagrid>
            <TextField source="name" />
            <TextField source="weight" />
            <BooleanField source="status" label="Status?" looseValue />
          </Datagrid>
        </ArrayField>
      </SimpleShowLayout>
    </Show>
  );
};

export default VariantShow;
