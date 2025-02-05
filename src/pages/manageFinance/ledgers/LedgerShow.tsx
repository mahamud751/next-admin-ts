import { FC } from "react";
import { FileField, Show, ShowProps, TextField } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";
import AroggaDateField from "@/components/common/AroggaDateField";

const LedgerShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Ledger Show");

  return (
    <Show {...rest}>
      <ColumnShowLayout md={6}>
        <AroggaDateField source="l_created" label="Date" />
        <TextField source="u_name" label="Added By" />
        <TextField source="l_reason" label="Reason" />
        <TextField source="l_type" label="Type" />
        <TextField source="l_method" label="Method" />
        <TextField source="l_amount" label="Amount" />
        <FileField
          source="attachedFiles"
          src="src"
          title="title"
          target="_blank"
          label="Related Files"
        />
      </ColumnShowLayout>
    </Show>
  );
};

export default LedgerShow;
