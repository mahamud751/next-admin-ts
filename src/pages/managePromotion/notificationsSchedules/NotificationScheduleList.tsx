import { FC } from "react";
import {
  List,
  ListProps,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import NotificationScheduleFilter from "./NotificationScheduleFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const NotificationScheduleList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Notification Schedule List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();

  return (
    <List
      {...rest}
      title="List of Notification Schedule"
      filters={<NotificationScheduleFilter children={""} />}
      perPage={25}
      sort={{ field: "ns_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick="show"
        hideableColumns={["ns_created_by"]}
        bulkActionButtons={permissions?.includes("notificationScheduleDelete")}
      >
        <TextField source="ns_id" label="ID" />
        <TextField source="ns_name" label="Name" />
        <TextField source="ns_channels" label="Channels" />
        <TextField
          source="ns_status"
          label="Status"
          className={classes.capitalize}
        />

        <AroggaDateField source="ns_date_time" label="Date" />
        <AroggaDateField source="ns_created_at" label="Created At" />
        <ReferenceField
          source="ns_created_by"
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

export default NotificationScheduleList;
