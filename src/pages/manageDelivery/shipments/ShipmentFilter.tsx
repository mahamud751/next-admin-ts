import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { userEmployeeInputTextRenderer } from "@/utils/helpers";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";

const ShipmentFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      source="_order_sequence"
      label="Search by ID"
      variant="outlined"
      alwaysOn
    />
    <SelectInput
      source="_status"
      label="Status"
      variant="outlined"
      choices={[
        { id: "pending", name: "Pending" },
        { id: "picker_assigned", name: "Picker Assigned" },
        { id: "picked", name: "Picked" },
        { id: "packer_assigned", name: "Packer Assigned" },
        { id: "packed", name: "Packed" },
        { id: "wrong_checked", name: "Wrong Checked" },
        { id: "sorting", name: "Sorting" },
        { id: "sorted", name: "Sorted" },
        { id: "in_bag", name: "In Bag" },
        { id: "delivering", name: "Delivering" },
        { id: "delivered", name: "Delivered" },
        { id: "cancelled", name: "Cancelled" },
        { id: "rescheduled", name: "Rescheduled" },
        { id: "received", name: "Received" },
        { id: "closed", name: "Closed" },
      ]}
      alwaysOn
    />
    <SelectInput
      source="_type"
      label="Type"
      variant="outlined"
      choices={[
        { id: "delivery", name: "Delivery" },
        { id: "issue", name: "Issue" },
        { id: "return", name: "Return" },
      ]}
      alwaysOn
    />
    <FormatedBooleanInput source="_m_cold" label="Cold?" />
    <FormatedBooleanInput source="_is_b2b" label="B2B?" />
    <FormatedBooleanInput source="_outside_dhaka" label="Outside Dhaka?" />
    <FormatedBooleanInput source="_packed_wrong" label="Packed Wrong?" />
    <ReferenceInput
      source="_s_zone_id"
      label="Zone"
      reference="v1/zone"
      variant="outlined"
      filter={{
        _perPage: "100",
      }}
      allowEmpty
      alwaysOn
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionText={(value) => (value && value?.z_name) || ""}
      />
    </ReferenceInput>
    {/* TODO: Have to understand */}
    <TextInput source="_qc_status" label="QC Status" variant="outlined" />
    <NumberInput source="_order_id" label="Order ID" variant="outlined" />
    <TaxonomiesByVocabularyInput
      fetchKey="shift_type"
      source="_delivery_option"
      label="Delivery Option"
    />
    <SelectInput
      source="_payment_method"
      label="Payment Method"
      variant="outlined"
      choices={[
        { id: "online", name: "Online" },
        { id: "cod", name: "Cash On Delivery" },
      ]}
    />
    <ReferenceInput
      source="_delivery_man_id"
      label="Delivery Man"
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
      source="_packer_assigned_by"
      label="Packer Assigned By"
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
      source="_packed_by"
      label="Packed By"
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
      source="_delivered_by"
      label="Delivered By"
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
      source="_scheduled_by"
      label="Scheduled By"
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
      source="_deposited_by"
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

export default ShipmentFilter;
