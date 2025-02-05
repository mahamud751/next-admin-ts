import { FC } from "react";
import {
  BooleanField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

const ShiftShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Shift Show");

  const classes = useAroggaStyles();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="s_title" label="Title" />
        <TextField source="s_time_start" label="Start Time" />
        <TextField source="s_time_end" label="End Time" />
        <TextField
          source="s_shift_type"
          label="Type"
          className={classes.capitalize}
        />
        <BooleanField source="is_active" label="Active?" looseValue />
      </SimpleShowLayout>
    </Show>
  );
};

export default ShiftShow;
