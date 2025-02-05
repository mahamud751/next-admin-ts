import { FC } from "react";
import {
  FunctionField,
  Link,
  RaRecord as Record,
  ReferenceField,
  Show,
  ShowProps,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";
import CustomChipField from "@/components/common/CustomChipField";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const RegionShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Region Show");

  const classes = useAroggaStyles();

  return (
    <Show {...props}>
      <ColumnShowLayout>
        <TextField source="r_id" label="ID" />
        <FunctionField
          label="Title"
          sortBy="r_name"
          // @ts-ignore
          onClick={(e: MouseEvent) => e.stopPropagation()}
          render={(record: Record & { r_id: string }) => (
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
        <CustomChipField source="rt" label="Type" id="rt_id" value="rt_name" />
        <FunctionField
          label="Status"
          render={(record: Record) => (
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
        >
          <TextField source="u_name" />
        </ReferenceField>
        <AroggaDateField source="r_modified_at" label="Modified At" />
        <ReferenceField
          source="r_modified_by"
          label="Modified By"
          reference="v1/users"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </ColumnShowLayout>
    </Show>
  );
};

export default RegionShow;
