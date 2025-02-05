import { FC } from "react";
import {
  FileField,
  ReferenceField,
  RichTextField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import AroggaDateField from "@/components/common/AroggaDateField";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import { useDocumentTitle } from "@/hooks";

const JobShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Job Show");

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout simpleShowLayout={false}>
          <TextField source="j_id" label="ID" />
          <AroggaDateField source="j_created" label="Created At" />
          <ReferenceField
            source="j_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <TextField source="j_title" label="Title" />
          <TextField source="j_designation" label="Designation" />
          <TextField source="j_department" label="Department" />
          <TextField source="j_status" label="Status" />
          <TextField source="j_location" label="Location" />
          <TextField source="j_type" label="Type" />
          <TextField source="j_a_count" label="Application Count" />
          <TextField source="j_updated" label="Last Updated" />
          <ReferenceField
            source="j_updated_by"
            label="Last Updated By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <FileField
            source="attachedFiles_j_banner"
            src="src"
            title="Attached Files"
            target="_blank"
            label="Attached Files"
            // @ts-ignore
            onClick={(e) => e.stopPropagation()}
          />
        </ColumnShowLayout>
        <RichTextField source="j_description" label="Description" />
      </SimpleShowLayout>
    </Show>
  );
};

export default JobShow;
