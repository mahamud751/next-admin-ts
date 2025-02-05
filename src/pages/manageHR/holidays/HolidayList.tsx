import { FC } from "react";
import { Datagrid, List, ListProps, TextField } from "react-admin";

import AroggaDateField from "@/components/common/AroggaDateField";
import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import HolidayFilter from "./HolidayFilter";

const HolidayList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Holiday List");

  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList("holidayView", "holidayEdit");

  return (
    <List
      {...rest}
      title="List of Holiday"
      perPage={25}
      filters={<HolidayFilter children={""} />}
      sort={{ field: "h_date", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid rowClick={navigateFromList} bulkActionButtons={false}>
        <TextField source="h_type" label="Type" />
        <AroggaDateField source="h_date" label="Date" />
        <TextField source="h_title" label="Title" />
      </Datagrid>
    </List>
  );
};

export default HolidayList;
