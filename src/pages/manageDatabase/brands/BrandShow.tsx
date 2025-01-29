import { FC } from "react";
import {
  BooleanField,
  ReferenceField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import AroggaDateField from "@/components/common/AroggaDateField";
import AroggaImageField from "@/components/common/AroggaImageField";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const BrandShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Brand Show");

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={6} simpleShowLayout={false}>
          <TextField source="pb_id" label="ID" />
          <TextField source="pb_name" label="Name" />
          <TextField source="pb_info" label="Information" />
          <ReferenceField
            source="pb_uid"
            label="User"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <TextField
            source="pb_payment_term_condition"
            label="Payment Term & Condition"
          />
          <TextField source="pb_payment_terms" label="Payment Terms" />
          <BooleanField source="pb_is_feature" label="Feature?" looseValue />
          <AroggaDateField source="pb_created_at" label="Created At" />
          <ReferenceField
            source="pb_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </ColumnShowLayout>
        <AroggaImageField source="attachedFiles_pb_logo" label="Logo" />
        <AroggaImageField source="attachedFiles_pb_banner" label="Banner" />
      </SimpleShowLayout>
    </Show>
  );
};

export default BrandShow;
