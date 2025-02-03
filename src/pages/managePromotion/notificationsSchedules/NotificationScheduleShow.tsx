import AroggaDateField from "@/components/common/AroggaDateField";
import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import { FC } from "react";
import {
  ReferenceField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const NotificationScheduleShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Notification Schedule Show");

  const classes = useAroggaStyles();

  return (
    <Show {...rest}>
      <SimpleShowLayout>
        <TextField source="ns_id" label="ID" />
        <TextField source="ns_name" label="Name" />
        <TextField source="ns_channels" label="Channels" />
        <TextField
          source="ns_status"
          label="Status"
          className={classes.capitalize}
        />

        <AroggaDateField source="ns_created_at" label="Created At" />
        <ReferenceField
          source="ns_created_by"
          label="Created By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </SimpleShowLayout>
    </Show>
  );
};

export default NotificationScheduleShow;
