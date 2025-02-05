import { FC } from "react";
import { BooleanField, Show, ShowProps, TextField } from "react-admin";

import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import { useDocumentTitle } from "@/hooks";

const BankShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Bank Show");

  return (
    <Show {...props}>
      <ColumnShowLayout md={6}>
        <TextField source="b_id" label="ID" />
        <TextField source="b_name" label="Name" />
        <TextField source="b_branch" label="Branch" />
        <TextField source="b_routing_number" label="Routing Number" />
        <TextField source="b_short_code" label="Short Code" />
        <BooleanField source="b_active" label="Active?" looseValue />
      </ColumnShowLayout>
    </Show>
  );
};

export default BankShow;
