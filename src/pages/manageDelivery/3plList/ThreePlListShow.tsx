import { FC } from "react";
import { FunctionField, Show, ShowProps, TextField } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const ThreePlListShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | 3PL Config Show");
  return (
    <Show {...props}>
      <ColumnShowLayout>
        <TextField source="tc_name" label="Name" />
        <FunctionField
          source="sa_status"
          label="Status"
          render={(record) => `${record.sa_status ? "Active" : "Inactive"}`}
        />
      </ColumnShowLayout>
    </Show>
  );
};

export default ThreePlListShow;
