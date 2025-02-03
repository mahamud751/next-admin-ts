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
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import AroggaDateField from "@/components/common/AroggaDateField";
import AroggaImageField from "@/components/common/AroggaImageField";
import ObjectField from "@/components/common/ObjectField";

const NotificationShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Notification Show");

  const classes = useAroggaStyles();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={3} simpleShowLayout={false}>
          <TextField source="n_id" label="ID" />
          <ReferenceField
            source="n_true_user"
            label="User"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <TextField source="n_title" label="Title" />
          <TextField
            source="n_type"
            label="Type"
            className={classes.capitalize}
          />
          <TextField source="n_button_title" label="Button Title" />
          <TextField source="n_button_link" label="Button Link" />
          <TextField
            source="n_status"
            label="Status"
            className={classes.capitalize}
          />
          <TextField source="n_description" label="Description" />
          <BooleanField source="n_is_read" label="Read?" looseValue />
          <BooleanField source="n_is_public" label="Public?" looseValue />
          <BooleanField source="n_is_active" label="Active?" looseValue />
          <AroggaDateField source="n_created_at" label="Created At" />
          <ReferenceField
            source="n_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <AroggaDateField source="n_modified_at" label="Modified At" />
          <ReferenceField
            source="n_modified_by"
            label="Modified By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </ColumnShowLayout>
        <ObjectField source="n_params" label="Params" />
        <AroggaImageField
          source="attachedFiles_n_images"
          label="Attached Images"
        />
      </SimpleShowLayout>
    </Show>
  );
};

export default NotificationShow;
