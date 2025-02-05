import { FC } from "react";
import {
  BooleanField,
  List,
  ListProps,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import BlogFilter from "./BlogFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const BlogList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Blog List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList("blogPostView", "blogPostEdit");

  return (
    <List
      {...rest}
      title="List of Blog"
      filters={<BlogFilter children={""} />}
      perPage={25}
      sort={{ field: "bp_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={["bp_created_at", "bp_created_by"]}
        bulkActionButtons={permissions?.includes("blogPostDelete")}
      >
        <TextField source="bp_id" label="ID" />
        <TextField source="bp_title" label="Title" />
        <TextField source="bp_type" label="Type" />
        <TextField source="bp_reading_time" label="Reading Time" />
        <TextField source="bp_total_like" label="Total Like" />
        <TextField source="bp_total_comments" label="Total Comment" />
        <BooleanField
          source="bp_is_feature"
          label="Feature?"
          FalseIcon={null}
          looseValue
        />
        <BooleanField
          source="bp_is_active"
          label="Active?"
          FalseIcon={null}
          looseValue
        />
        <AroggaDateField source="bp_created_at" label="Created At" />
        <ReferenceField
          source="bp_created_by"
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

export default BlogList;
