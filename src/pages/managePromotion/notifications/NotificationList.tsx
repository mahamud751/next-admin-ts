import { FC } from "react";
import {
  BooleanField,
  ImageField,
  List,
  ListProps,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import NotificationFilter from "./NotificationFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const NotificationList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Notification List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList(
    "notificationView",
    "notificationEdit"
  );

  return (
    <List
      {...rest}
      title="List of Notification"
      filters={<NotificationFilter children={""} />}
      perPage={25}
      sort={{ field: "n_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={["n_button_link", "n_created_at", "n_created_by"]}
        bulkActionButtons={permissions?.includes("notificationDelete")}
      >
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
        <BooleanField
          source="n_is_read"
          label="Read?"
          FalseIcon={null}
          looseValue
        />
        <BooleanField
          source="n_is_public"
          label="Public?"
          FalseIcon={null}
          looseValue
        />
        <BooleanField
          source="n_is_active"
          label="Active?"
          FalseIcon={null}
          looseValue
        />
        <ImageField
          source="attachedFiles_n_images"
          label="Attached Images"
          className="small__img"
          src="src"
          title="title"
        />
        <AroggaDateField source="n_created_at" label="Created At" />
        <ReferenceField
          source="n_created_by"
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

export default NotificationList;
