import { FC } from "react";
import {
  FunctionField,
  Link,
  List,
  ListProps,
  RaRecord,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import RegionFilter from "./RegionFilter";
import AroggaDateField from "@/components/common/AroggaDateField";
import CustomChipField from "@/components/common/CustomChipField";

const RegionList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Region List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("regionView", "regionEdit");

  return (
    <List
      {...rest}
      title="List of Region"
      perPage={25}
      filter={{ _details: 1 }}
      filters={<RegionFilter children={""} />}
      sort={{ field: "r_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={["r_created_at", "r_created_by"]}
        bulkActionButtons={permissions?.includes("regionDelete")}
      >
        <TextField source="r_id" label="ID" />
        <FunctionField
          label="Title"
          sortBy="r_name"
          // @ts-ignore
          onClick={(e: MouseEvent) => e.stopPropagation()}
          render={(record: RaRecord) => (
            <Link
              to={{
                pathname: "/v1/block",
                search: `filter=${JSON.stringify({
                  _region_id: record.r_id,
                })}`,
              }}
            >
              {record.r_name}
            </Link>
          )}
        />
        <CustomChipField
          source="rt"
          label="Type"
          id="rt_id"
          value="rt_name"
          page="list"
        />
        <FunctionField
          label="Status"
          sortBy="r_status"
          render={(record: RaRecord) => (
            <span
              className={`${classes.capitalize} ${
                record.r_status === "inactive" && classes.textRed
              }`}
            >
              {record?.r_status}
            </span>
          )}
        />
        <TextField source="r_description" label="Description" />
        <AroggaDateField source="r_created_at" label="Created At" />
        <ReferenceField
          source="r_created_by"
          label="Created By"
          reference="v1/users"
          sortBy="r_created_by"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default RegionList;
