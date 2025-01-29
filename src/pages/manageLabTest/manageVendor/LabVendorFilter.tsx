import { FC } from "react";
import { Filter, FilterProps, SelectInput, TextInput } from "react-admin";

import { useRequest } from "@/hooks";

const LabVendorFilter: FC<FilterProps> = (props) => {
  const { data: Order } = useRequest(
    `/v1/zones?onlyMainZones=1`,
    {},
    {
      isBaseUrl: true,
      isSuccessNotify: false,
      isPreFetching: true,
    }
  );
  const toChoices = Order?.zones?.map((item) => ({
    id: item,
    name: item,
  }));
  return (
    <Filter {...props}>
      <TextInput
        source="name"
        label="Search By Name"
        variant="outlined"
        resettable
        alwaysOn
      />
      <SelectInput
        source="status"
        variant="outlined"
        choices={[
          { id: "active", name: "Active" },
          { id: "inactive", name: "Inactive" },
        ]}
        alwaysOn
      />
      <SelectInput
        source="zone"
        variant="outlined"
        choices={toChoices}
        resettable
        alwaysOn
      />
    </Filter>
  );
};

export default LabVendorFilter;
