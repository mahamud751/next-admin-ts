import { FC } from "react";
import {
  AutocompleteInput,
  DateInput,
  DateTimeInput,
  Filter,
  FilterProps,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { toFormattedDateTime } from "@/utils/helpers";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

const PurchaseFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_search"
      label="Search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <ReferenceInput
      source="_c_id"
      label="Brand"
      variant="outlined"
      reference="v1/productBrand"
      sort={{ field: "pb_name", order: "ASC" }}
      alwaysOn
    >
      <AutocompleteInput optionValue="pb_id" optionText="pb_name" resettable />
    </ReferenceInput>
    <SelectInput
      source="_payment_method"
      label="Payment Method"
      variant="outlined"
      choices={[
        { id: "payable", name: "Payable" },
        { id: "receivable", name: "Receivable" },
        { id: "cash", name: "Cash" },
        {
          id: "bank",
          name: "Bank",
        },
      ]}
      alwaysOn
    />
    <SelectInput
      source="_status"
      variant="outlined"
      choices={[
        { id: "pending", name: "Pending" },
        { id: "approved", name: "Approved" },
      ]}
      alwaysOn
    />
    <FormatedBooleanInput source="_not_paid" label="Not Paid" alwaysOn />
    <ReferenceInput
      source="_warehouse_id"
      label="Warehouse"
      variant="outlined"
      reference="v1/warehouse"
      filter={{ _role: "warehouse" }}
    >
      <AutocompleteInput optionValue="w_id" optionText="w_title" resettable />
    </ReferenceInput>
    <DateInput source="_start_date" label="Start Date" variant="outlined" />
    <DateInput source="_end_date" label="End Date" variant="outlined" />
    <ReferenceInput
      source="_created_by"
      label="Created By"
      variant="outlined"
      reference="v1/users"
    >
      <AutocompleteInput optionValue="u_id" optionText="u_name" resettable />
    </ReferenceInput>
    <ReferenceInput
      source="_checked_by"
      label="Checked By"
      variant="outlined"
      reference="v1/users"
    >
      <AutocompleteInput optionValue="u_id" optionText="u_name" resettable />
    </ReferenceInput>
    <ReferenceInput
      source="_shelved_by"
      label="Shelved By"
      variant="outlined"
      reference="v1/users"
    >
      <AutocompleteInput optionValue="u_id" optionText="u_name" resettable />
    </ReferenceInput>
    <DateTimeInput
      source="_pp_paid_at"
      label="Paid At"
      variant="outlined"
      parse={(dateTime) =>
        toFormattedDateTime({
          dateString: dateTime,
        })
      }
    />
  </Filter>
);

export default PurchaseFilter;
