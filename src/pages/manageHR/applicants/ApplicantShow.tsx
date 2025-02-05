import { FC } from "react";
import {
  EmailField,
  FileField,
  ReferenceField,
  RichTextField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import AroggaDateField from "@/components/common/AroggaDateField";

const ApplicantShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Applicants Show");

  const classes = useAroggaStyles();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout simpleShowLayout={false}>
          <TextField source="a_id" label="ID" />
          <AroggaDateField source="a_created" label="Created At" />
          <ReferenceField
            source="a_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <TextField source="a_name" label="Name" />
          <EmailField source="a_email" label="Email" />
          <TextField source="a_phone" label="Phone No" />
          <TextField
            source="a_status"
            label="Status"
            className={classes.capitalize}
          />
          <TextField source="a_note" label="Internal Notes" />
          <TextField source="a_updated" label="Last Updated" />
          <ReferenceField
            source="a_updated_by"
            label="Last Updated By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </ColumnShowLayout>
        <RichTextField source="a_cover_letter" label="Cover Letter" />
        <FileField
          source="attachedFiles"
          src="src"
          title="title"
          target="_blank"
          label="Related Files"
        />
      </SimpleShowLayout>
    </Show>
  );
};

export default ApplicantShow;
