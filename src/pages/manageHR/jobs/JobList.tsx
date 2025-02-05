import { Link as MuiLink } from "@mui/material";
import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  Link,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import AroggaDateField from "@/components/common/AroggaDateField";
import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { convertToSlug } from "@/utils/helpers";
import JobFilter from "./JobFilter";

const JobList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Job List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList("jobView", "jobEdit");

  return (
    <List
      {...rest}
      title="List of Job"
      perPage={25}
      filters={<JobFilter children={""} />}
      sort={{ field: "j_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid
        rowClick={navigateFromList}
        bulkActionButtons={permissions?.includes("jobDelete")}
      >
        <TextField source="j_id" label="ID" />
        <AroggaDateField source="j_created" label="Created At" />
        <ReferenceField
          source="j_created_by"
          label="Created By"
          reference="v1/users"
          link="show"
          sortBy="j_created_by"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <TextField source="j_title" label="Title" />
        <ReferenceField
          source="j_designation"
          label="Designation"
          reference="v1/rank"
          link="show"
          sortBy="j_designation"
        >
          <TextField source="r_title" />
        </ReferenceField>
        <TextField source="j_department" label="Department" />
        <TextField source="j_a_count" label="Application Count" />
        <TextField source="j_status" label="Status" />
        <FunctionField
          // @ts-ignore
          onClick={(e: MouseEvent) => e.stopPropagation()}
          label="Application"
          render={(record: Record) => {
            if (!record?.j_a_count) return;

            return (
              <Link
                to={{
                  pathname: "/v1/jobApplications",
                  search: `filter=${JSON.stringify({
                    _j_id: record.j_id,
                  })}`,
                }}
              >
                View
              </Link>
            );
          }}
        />
        <FunctionField
          // @ts-ignore
          onClick={(e: MouseEvent) => e.stopPropagation()}
          label="Website"
          render={({ j_id, j_title }: Record) => (
            <MuiLink
              href={`${
                process.env.REACT_APP_WEBSITE_URL
              }/jobs/${j_id}/${convertToSlug(j_title)}`}
              target="_blank"
              rel="noopener"
            >
              View
            </MuiLink>
          )}
        />
      </Datagrid>
    </List>
  );
};

export default JobList;
