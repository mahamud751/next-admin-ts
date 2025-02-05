import { FC } from "react";
import {
  BooleanField,
  List,
  ListProps,
  NumberField,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import UserTransactionFilter from "./UserTransactionFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const UserTransactionList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | User Transaction List");
  const { permissions } = usePermissions();
  const classes = useAroggaStyles();
  const exporter = useExport(rest);

  return (
    <List
      {...rest}
      title="List of User Transaction"
      filters={<UserTransactionFilter children={""} />}
      perPage={25}
      sort={{ field: "ut_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        bulkActionButtons={permissions?.includes("userTransactionDelete")}
      >
        <TextField source="ut_id" label="ID" />
        <AroggaDateField source="ut_created_at" label="Date" />
        <ReferenceField
          source="ut_u_id"
          label="User"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <TextField source="ut_entity" label="Entity" />
        <TextField source="ut_title" label="Title" />
        <TextField source="ut_from" label="From" />
        <NumberField source="ut_amount" label="Amount" />
        <NumberField source="ut_cash_amount" label="Cash Amount" />
        <NumberField source="ut_bonus_amount" label="Bonus Amount" />
        <NumberField source="ut_balance" label="Balance" />
        <NumberField source="ut_cash_balance" label="Cash Balance" />
        <NumberField source="ut_bonus_balance" label="Bonus Balance" />
        <BooleanField
          source="ut_allow_withdraw"
          label="Allow Withdraw?"
          FalseIcon={null}
          looseValue
        />
        <TextField
          source="ut_withdraw_instruction"
          label="Withdraw Instruction"
        />
        <TextField source="ut_withdraw_method" label="Withdraw Method" />
        <TextField source="ut_withdraw_mobile" label="Withdraw Mobile" />
        <TextField
          source="ut_status"
          label="Status"
          className={classes.capitalize}
        />
        <TextField source="ut_parent_id" label="Parent ID" />
        <TextField source="ut_sp_id" label="Service Payment ID" />
        <ReferenceField
          source="ut_collected_by"
          label="Collected By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <ReferenceField
          source="ut_deposited_to"
          label="Deposited To"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default UserTransactionList;
