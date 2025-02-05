import { FileField, TextField } from "react-admin";

import AroggaDateField from "../../../../components/AroggaDateField";
import ColumnShowLayout from "../../../../components/ColumnShowLayout";
import { useRequest } from "../../../../hooks";

const InfoTab = (props) => {
    const { data } = useRequest(
        `/v1/employeeInfo?_e_id=${props.record.e_id}`,
        {},
        { isPreFetching: true, isWarningNotify: false }
    );

    const record = data?.[0];

    return (
        <ColumnShowLayout>
            <TextField
                source="ei_residential_address"
                label="Residential Address"
                record={record}
            />
            <AroggaDateField
                source="ei_date_of_birth"
                label="Birth Date"
                record={record}
            />
            <TextField
                source="ei_blood_group"
                label="Blood Group"
                record={record}
            />
            <FileField
                source="attachedFiles_ei_birth_certificate_photo"
                src="src"
                title="Birth Certificate"
                target="_blank"
                label="Birth Certificate"
                record={record}
            />
            <TextField source="ei_nid" label="NID" record={record} />
            <FileField
                source="attachedFiles_ei_nid_photo"
                src="src"
                title="NID Files"
                target="_blank"
                label="NID Files"
                record={record}
            />
            <TextField source="ei_tin" label="TIN" record={record} />
            <FileField
                source="attachedFiles_ei_tin_photo"
                src="src"
                title="Tin Files"
                target="_blank"
                label="Tin Files"
                record={record}
            />
            <TextField
                source="ei_license"
                label="Driving License"
                record={record}
            />
            <FileField
                source="attachedFiles_ei_license_photo"
                src="src"
                title="License Files"
                target="_blank"
                label="License Files"
                record={record}
            />
            <TextField source="ei_passport" label="Passport" record={record} />
            <FileField
                source="attachedFiles_ei_passport_photo"
                src="src"
                title="Passport Files"
                target="_blank"
                label="Passport Files"
                record={record}
            />
            <FileField
                source="attachedFiles_ei_cheque_photo"
                src="src"
                title="Cheque Files"
                target="_blank"
                label="Cheque Files"
                record={record}
            />
        </ColumnShowLayout>
    );
};

export default InfoTab;
