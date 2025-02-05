import UserEmployeeBankOptionTextRenderer from "@/components/common/UserEmployeeBankOptionTextRenderer";
import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

const EmployeeBankInfoFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <TextInput
      label="Search"
      source="_search"
      variant="outlined"
      resettable
      alwaysOn
    />
    <ReferenceInput
      source="_emp_id"
      label="Employee"
      variant="outlined"
      reference="v1/employee"
    >
      <AutocompleteInput
        matchSuggestion={() => true}
        optionValue="e_id"
        helperText={false}
        optionText={<UserEmployeeBankOptionTextRenderer isEmployee />}
        inputText={(record: { e_name: string; e_mobile: string }) =>
          !!record ? `${record.e_name} (${record.e_mobile})` : ""
        }
      />
    </ReferenceInput>
    <SelectInput
      source="eb_status"
      label="Status"
      variant="outlined"
      choices={[
        { id: "active", name: "Active" },
        { id: "inactive", name: "Not Active" },
      ]}
    />
  </Filter>
);

export default EmployeeBankInfoFilter;
