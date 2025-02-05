import { FC } from "react";
import {
  BooleanField,
  ReferenceField,
  Show,
  ShowProps,
  TextField,
} from "react-admin";

import AroggaDateField from "@/components/common/AroggaDateField";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

const ShiftScheduleShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Shift Schedule Show");

  const classes = useAroggaStyles();

  return (
    <Show {...props}>
      <ColumnShowLayout md={6}>
        <TextField source="ss_id" label="ID" />
        <TextField source="ss_s_id" label="Schedule ID" />
        <ReferenceField
          source="s_id"
          label="Shift"
          reference="v1/shift"
          link="show"
          sortBy="s_id"
        >
          <TextField source="s_title" />
        </ReferenceField>
        <TextField source="s_title" label="Title" />
        <AroggaDateField source="ss_date" label="Date" />
        <TextField source="s_time_start" label="Start Time" />
        <TextField source="s_time_end" label="End Time" />
        <TextField
          source="s_shift_type"
          label="Type"
          className={classes.capitalize}
        />
        <BooleanField source="ss_is_active" label="Active?" looseValue />
      </ColumnShowLayout>
    </Show>
  );
};

export default ShiftScheduleShow;
