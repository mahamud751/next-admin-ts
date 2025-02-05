import { FC } from "react";
import {
  FunctionField,
  ReferenceField,
  Show,
  ShowProps,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const SubAreaShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Sub-Area Show");

  return (
    <Show {...props}>
      <ColumnShowLayout>
        <TextField source="sa_id" label="ID" />
        <TextField source="sa_l_id" label="Location ID" />
        <TextField source="sa_title" label="Title" />
        {/* <TextField source="sa_zone" label="Zone" /> */}
        <ReferenceField
          source="sa_zone_id"
          label="Zone"
          reference="v1/zone"
          link="show"
        >
          <TextField source="z_name" />
        </ReferenceField>
        {/* <TextField source="sa_exp_zone" label="Exp Zone" /> */}
        <ReferenceField
          source="sa_exp_zone"
          label="Exp Zone"
          reference="v1/zone"
          link={false}
        >
          <TextField source="z_name" />
        </ReferenceField>
        <FunctionField
          source="sa_is_free_delivery"
          label="Free Delivery"
          render={(record) => `${record.sa_is_free_delivery ? "Yes" : "No"}`}
        />
        <FunctionField
          source="sa_status"
          label="Status"
          render={(record) => `${record.sa_status ? "Active" : "Inactive"}`}
        />

        <TextField source="sa_comment" label="Comment" />
      </ColumnShowLayout>
    </Show>
  );
};

export default SubAreaShow;
