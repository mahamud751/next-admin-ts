import { FC } from "react";
import {
  ArrayField,
  BooleanField,
  Datagrid,
  FunctionField,
  RaRecord as Record,
  ReferenceField,
  RichTextField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { getReadableSKU } from "@/utils/helpers";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import AroggaDateField from "@/components/common/AroggaDateField";
import AroggaImageField from "@/components/common/AroggaImageField";

const BlogShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Blog Show");

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={4} simpleShowLayout={false}>
          <TextField source="bp_id" label="ID" />
          <TextField source="bp_title" label="Title" />
          <TextField source="bp_type" label="Type" />
          <TextField source="bp_reading_time" label="Reading Time" />
          <TextField source="bp_total_like" label="Total Like" />
          <TextField source="bp_total_comments" label="Total Comment" />
          <BooleanField source="bp_is_feature" label="Feature?" looseValue />
          <BooleanField source="bp_is_active" label="Active?" looseValue />
          <AroggaDateField source="bp_created_at" label="Created At" />
          <ReferenceField
            source="bp_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <AroggaDateField source="bp_modified_at" label="Modified At" />
          <ReferenceField
            source="bp_modified_by"
            label="Modified By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </ColumnShowLayout>
        <ArrayField source="bp_products" label="Products">
          <Datagrid>
            <ReferenceField
              source="p_id"
              label="Product"
              reference="v1/product"
              link="show"
            >
              <TextField source="p_name" />
            </ReferenceField>
            <ReferenceField
              source="pv_id"
              label="Variant"
              reference="v1/productVariant"
              link={false}
            >
              <FunctionField
                render={(record: Record) => getReadableSKU(record.pv_attribute)}
              />
            </ReferenceField>
          </Datagrid>
        </ArrayField>
        <ArrayField source="bp_youtube" label="Videos">
          <Datagrid>
            <TextField source="title" label="Title" />
            <FunctionField
              label="Video"
              render={({ key, title }: Record) => {
                if (!key) return null;

                return (
                  <iframe
                    title={title}
                    src={`https://www.youtube.com/embed/${key}`}
                    width={280}
                    height={150}
                    frameBorder="0"
                    allowFullScreen
                  />
                );
              }}
            />
          </Datagrid>
        </ArrayField>
        <AroggaImageField
          source="attachedFiles_bp_images"
          label="Attached Images"
        />
        <RichTextField source="bp_description" label="Description" />
      </SimpleShowLayout>
    </Show>
  );
};

export default BlogShow;
