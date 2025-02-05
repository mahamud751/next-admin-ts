import { FC } from "react";
import {
  FunctionField,
  RaRecord as Record,
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

const PagesShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Page Show");

  const classes = useAroggaStyles();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={6} simpleShowLayout={false}>
          <TextField source="p_id" label="ID" />
          <AroggaDateField source="p_created" label="Created At" />
          <AroggaDateField source="p_updated" label="Updated At" />
          <TextField source="p_title" label="Title" />
          <TextField source="p_slug" label="Slug" />
          <FunctionField
            label="Status"
            render={(record: Record) => (
              <span
                className={`${classes.capitalize} ${
                  record.p_status === "pending" && classes.textRed
                }`}
              >
                {record?.p_status}
              </span>
            )}
          />
        </ColumnShowLayout>
        <RichTextField source="p_content" label="Content" />
      </SimpleShowLayout>
    </Show>
  );
};

export default PagesShow;
