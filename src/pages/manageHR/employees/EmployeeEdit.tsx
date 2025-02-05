import { FC } from "react";
import { Edit, EditProps, SimpleForm, TransformData } from "react-admin";

import SaveDeleteToolbar from "../../../components/SaveDeleteToolbar";
import EmployeeCreateEdit from "../../../components/manageHR/employees/EmployeeCreateEdit";
import { useDocumentTitle } from "../../../hooks";

const transform: TransformData = ({
    id,
    holidays,
    holidaysSelect,
    shifts,
    eShiftType,
    user: { u_sex, u_email, u_role },
    ...rest
}) => ({
    ...rest,
    u_sex,
    shifts: shifts?.map((s_id) => ({ s_id })),
    holidays: holidays?.map((eh_holiday_type) => ({ eh_holiday_type })),
    user: { u_email, u_role },
});

const EmployeeEdit: FC<EditProps> = (props) => {
    useDocumentTitle("Arogga | Employee Edit");

    return (
        <Edit {...props} transform={transform}>
            <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
                <EmployeeCreateEdit page="edit" />
            </SimpleForm>
        </Edit>
    );
};

export default EmployeeEdit;
