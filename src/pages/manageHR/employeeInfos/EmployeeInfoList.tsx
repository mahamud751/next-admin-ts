import { FC } from "react";
import {
  FileField,
  List,
  ListProps,
  ReferenceField,
  TextField,
} from "react-admin";

import AroggaDateField from "@/components/common/AroggaDateField";
import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import EmployeeInfoFilter from "./EmployeeInfoFilter";

const EmployeeInfoList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Employee Info List");

  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList(
    "employeeInfoView",
    "employeeInfoEdit"
  );

  return (
    <List
      {...rest}
      title="List of Employee Info"
      perPage={25}
      filters={<EmployeeInfoFilter children={""} />}
      sort={{ field: "ei_id", order: "ASC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        bulkActionButtons={false}
      >
        <TextField source="ei_e_id" label="Employee ID" />
        <ReferenceField
          source="ei_e_id"
          label="Employee"
          reference="v1/employee"
          link="show"
          sortBy="ei_e_id"
        >
          <TextField source="e_name" />
        </ReferenceField>
        <AroggaDateField source="ei_date_of_birth" label="Birth Date" />
        <TextField source="ei_blood_group" label="Blood Group" />
        <TextField source="ei_nid" label="NID" />
        <TextField source="ei_tin" label="TIN" />
        <TextField source="ei_license" label="Driving License" />
        <TextField source="ei_passport" label="Passport" />
        <FileField
          source="attachedFiles_ei_cheque_photo"
          src="src"
          title="Cheque Files"
          target="_blank"
          label="Cheque Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
        <FileField
          source="attachedFiles_ei_tin_photo"
          src="src"
          title="Tin Files"
          target="_blank"
          label="Tin Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
        <TextField
          source="ei_birth_certificate"
          label="Birth Certificate Number"
        />
        <FileField
          source="attachedFiles_ei_birth_certificate_photo"
          src="src"
          title="Birth Certificate"
          target="_blank"
          label="Birth Certificate Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
        <FileField
          source="attachedFiles_ei_nid_photo"
          src="src"
          title="NID Files"
          target="_blank"
          label="NID Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
        <FileField
          source="attachedFiles_ei_license_photo"
          src="src"
          title="License Files"
          target="_blank"
          label="License Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
        <FileField
          source="attachedFiles_ei_passport_photo"
          src="src"
          title="Passport Files"
          target="_blank"
          label="Passport Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
      </CustomizableDatagrid>
    </List>
  );
};

export default EmployeeInfoList;
