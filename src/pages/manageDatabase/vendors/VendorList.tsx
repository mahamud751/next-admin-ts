import { FC } from "react";
import {
  FunctionField,
  List,
  ListProps,
  Pagination,
  RaRecord,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { convertTo12HourFormat } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import VendorFilter from "./VendorFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const VendorList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Vendor List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("vendorView", "vendorEdit");

  return (
    <List
      {...rest}
      title="List of Vendor"
      filters={<VendorFilter children={""} />}
      perPage={25}
      pagination={<Pagination rowsPerPageOptions={[25, 100, 200]} />}
      sort={{ field: "v_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={["v_tin", "v_bin", "v_created_at", "v_created_by"]}
        bulkActionButtons={permissions?.includes("vendorDelete")}
      >
        <TextField source="v_id" label="ID" />
        <TextField
          source="v_type"
          label="Type"
          className={classes.capitalize}
        />
        <ReferenceField
          source="v_user_id"
          label="User"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <ReferenceField
          source="v_kam_user_id"
          label="KAM"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <TextField source="v_name" label="Name" />
        <TextField source="v_phone" label="Phone" />
        <TextField source="v_tin" label="Tin" />
        <TextField source="v_bin" label="Bin" />
        <ReferenceField
          source="v_bank_id"
          label="Bank"
          reference="v1/bank"
          link="show"
        >
          <FunctionField
            render={(record: RaRecord) =>
              `${record?.b_name} (${record?.b_branch})`
            }
          />
        </ReferenceField>
        <FunctionField
          source="v_cutoff_time"
          label="Cutoff Time"
          render={({ v_cutoff_time }: RaRecord) =>
            convertTo12HourFormat(+v_cutoff_time)
          }
        />
        <TextField source="v_due_day" label="Due Day" />
        <TextField source="v_weight" label="Weight" />
        <FunctionField
          source="v_status"
          label="Status"
          render={(record: RaRecord) => (
            <span
              className={`${classes.capitalize} ${
                record.v_status === "inactive" && classes.textRed
              }`}
            >
              {record?.v_status}
            </span>
          )}
        />
        <AroggaDateField source="v_created_at" label="Created At" />
        <ReferenceField
          source="v_created_by"
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

export default VendorList;
