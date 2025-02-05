import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";

const UserTransactionFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput source="_search" label="Search" variant="outlined" alwaysOn />
    <TextInput
      source="_entity_id"
      label="Entity ID"
      variant="outlined"
      alwaysOn
    />
    <ReferenceInput
      source="_u_id"
      label="User"
      variant="outlined"
      reference="v1/users"
      alwaysOn
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionValue="u_id"
        helperText={false}
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
      />
    </ReferenceInput>
    <SelectInput
      source="_status"
      label="Status"
      variant="outlined"
      choices={[
        { id: "pending", name: "Pending" },
        { id: "confirmed", name: "Confirmed" },
        { id: "withdrawing", name: "Withdrawing" },
        { id: "withdrawn", name: "Withdrawn" },
      ]}
    />
    <SelectInput
      source="_title"
      label="Title"
      variant="outlined"
      choices={[
        {
          id: "Order cancel",
          name: "Order cancel",
        },
        {
          id: "Payment",
          name: "Payment",
        },
        {
          id: "Arogga cash used",
          name: "Arogga cash used",
        },
        {
          id: "Promotional bonus",
          name: "Promotional bonus",
        },
        {
          id: "deducted",
          name: "Deducted",
        },
        {
          id: "Cashback",
          name: "Cashback",
        },
        {
          id: "Referral bonus",
          name: "Referral bonus",
        },
        {
          id: "Refund",
          name: "Refund",
        },
        {
          id: "Arogga cash received",
          name: "Arogga cash received",
        },
        {
          id: "Order return",
          name: "Order return",
        },
        {
          id: "Arogga cash deducted",
          name: "Arogga cash deducted",
        },
      ]}
    />
    <SelectInput
      source="_withdraw_method"
      label="Withdraw Method"
      variant="outlined"
      choices={[
        {
          id: "bKash",
          name: "bKash",
        },
        {
          id: "sslCommerz",
          name: "SSL Commerz",
        },
      ]}
    />
    <TextInput
      source="_withdraw_mobile"
      label="Withdraw Mobile"
      variant="outlined"
    />
    <ReferenceInput
      source="_collected_by"
      label="Collected By"
      variant="outlined"
      reference="v1/users"
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionValue="u_id"
        helperText={false}
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
      />
    </ReferenceInput>
    <ReferenceInput
      source="_deposited_to"
      label="Deposited By"
      variant="outlined"
      reference="v1/users"
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionValue="u_id"
        helperText={false}
        optionText={<UserEmployeeOptionTextRenderer />}
        inputText={userEmployeeInputTextRenderer}
      />
    </ReferenceInput>
  </Filter>
);

export default UserTransactionFilter;
