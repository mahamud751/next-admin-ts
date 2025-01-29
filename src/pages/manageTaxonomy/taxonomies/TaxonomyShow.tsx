import { FC } from "react";
import {
  ReferenceField,
  RichTextField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import AroggaDateField from "@/components/common/AroggaDateField";
import AroggaImageField from "@/components/common/AroggaImageField";

const TaxonomyShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Taxonomy Term Show");

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout simpleShowLayout={false}>
          <TextField source="t_id" label="ID" />
          <TextField source="t_title" label="Title" />
          <TextField source="t_machine_name" label="Machine Name" />
          <ReferenceField
            source="t_v_id"
            label="Vocabulary"
            reference="v1/vocabulary"
          >
            <TextField source="v_title" />
          </ReferenceField>
          <ReferenceField
            source="t_parent_id"
            label="Parent"
            reference="v1/taxonomy"
          >
            <TextField source="t_title" />
          </ReferenceField>
          <TextField source="t_weight" label="Weight" />
          <AroggaDateField source="t_created_at" label="Created At" />
          <ReferenceField
            source="t_created_by"
            label="Created By"
            reference="v1/users"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <AroggaDateField source="t_modified_at" label="Modified At" />
          <ReferenceField
            source="t_modified_by"
            label="Modified By"
            reference="v1/users"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </ColumnShowLayout>
        <AroggaImageField source="attachedFiles_t_icon" label="Attached Icon" />
        <AroggaImageField
          source="attachedFiles_t_banner"
          label="Attached Banner"
        />
        <RichTextField source="t_description" label="Description" />
      </SimpleShowLayout>
    </Show>
  );
};

export default TaxonomyShow;
