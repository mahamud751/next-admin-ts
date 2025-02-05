import { FC } from "react";
import {
  BooleanField,
  Datagrid,
  List,
  ListProps,
  ReferenceField,
  TextField,
} from "react-admin";

import AroggaDateField from "@/components/common/AroggaDateField";
import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ShiftFilter from "./ShiftScheduleFilter";

const ShiftScheduleList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Shift Schedule List");

  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList(
    "shiftScheduleView",
    "shiftScheduleEdit"
  );

  return (
    <List
      {...rest}
      title="List of Shift Schedule"
      filters={<ShiftFilter children={""} />}
      perPage={25}
      sort={{ field: "ss_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid rowClick={navigateFromList} bulkActionButtons={false}>
        <TextField source="ss_id" label="Schedule ID" />
        <TextField source="s_id" label="Shift ID" />
        <ReferenceField
          source="s_id"
          label="Shift Type"
          reference="v1/shift"
          link={false}
          sortBy="s_id"
        >
          <TextField source="s_shift_type" className={classes.capitalize} />
        </ReferenceField>
        <ReferenceField
          source="s_id"
          label="Shift Title"
          reference="v1/shift"
          link={false}
          sortBy="s_id"
        >
          <TextField source="s_title" />
        </ReferenceField>
        <AroggaDateField source="ss_date" label="Date" />
        <TextField source="s_time_start" label="Start Time" />
        <TextField source="s_time_end" label="End Time" />
        <BooleanField
          source="ss_is_active"
          label="Active?"
          FalseIcon={null}
          looseValue
        />
      </Datagrid>
    </List>
  );
};

export default ShiftScheduleList;
