import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  List,
  ListProps,
  NumberField,
  RaRecord as Record,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import UserFilter from "./UserFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const UserList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | User List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("userView", "userEdit");

  return (
    <List
      {...rest}
      title="List of User"
      filters={<UserFilter children={""} />}
      perPage={25}
      sort={{ field: "u_created", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid
        rowClick={navigateFromList}
        bulkActionButtons={permissions?.includes("userDelete")}
      >
        <TextField source="u_id" label="ID" />
        <TextField source="u_name" label="Name" />
        <TextField source="u_mobile" label="Mobile" />
        <TextField source="u_o_count" label="Order Count" />
        <TextField
          source="u_role"
          label="Role"
          className={classes.capitalize}
        />
        <FunctionField
          label="Status"
          sortBy="u_status"
          render={(record: Record) => (
            <span
              className={`${classes.capitalize} ${
                record.u_status === "inactive" && classes.textRed
              }`}
            >
              {record?.u_status}
            </span>
          )}
        />
        <NumberField source="u_cash" label="Cash" />
        <TextField source="u_otp" label="OTP" />
        <AroggaDateField source="u_otp_time" label="OTP Created" />
        <TextField source="u_referrer" label="Referrer" />
        <AroggaDateField source="u_created" label="User Created" />
      </Datagrid>
    </List>
  );
};

export default UserList;
