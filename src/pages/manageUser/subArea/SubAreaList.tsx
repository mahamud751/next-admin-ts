import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useNavigateFromList } from "../../../hooks";
import SubAreaFilter from "./SubAreaFilter";

const SubAreaList: FC<ListProps> = ({ ...rest }) => {
  const { permissions } = usePermissions();
  useDocumentTitle("Arogga | Location List");

  const navigateFromList = useNavigateFromList("subAreaView", "subAreaEdit");

  return (
    <List
      {...rest}
      title="List of Sub-Area"
      perPage={25}
      sort={{ field: "sa_id", order: "DESC" }}
      filters={<SubAreaFilter children={""} />}
    >
      <Datagrid rowClick={navigateFromList}>
        <TextField source="sa_id" label="ID" />
        <TextField source="sa_title" label="Title" />
        <ReferenceField
          source="sa_l_id"
          label="Location"
          reference="v1/location"
          link="show"
        >
          <FunctionField
            render={(record: Record) =>
              `${record.l_division} (${record.l_district}, ${record.l_area})`
            }
          />
        </ReferenceField>

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
          link="show"
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
      </Datagrid>
    </List>
  );
};

export default SubAreaList;
