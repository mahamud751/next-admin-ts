import { FC } from "react";
import {
  AutocompleteInput,
  Filter,
  FilterProps,
  ReferenceInput,
} from "react-admin";

import ApplicantStatusInput from "@/components/manageHR/hiring/ApplicantStatusInput";

const ApplicantFilter: FC<FilterProps> = (props) => (
  <Filter {...props}>
    <ReferenceInput
      source="_j_id"
      label="Job List"
      variant="outlined"
      reference="v1/job"
      resettable
      alwaysOn
    >
      <AutocompleteInput optionValue="j_id" optionText="j_title" />
    </ReferenceInput>
    <ApplicantStatusInput source="_status" variant="outlined" alwaysOn />
  </Filter>
);

export default ApplicantFilter;
