import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import EmployeeBankCreateEdit from "../../../components/manageHR/employeeBanks/EmployeeBankCreateEdit";
import { useDocumentTitle } from "../../../hooks";

const EmployeeBankCreate: FC<CreateProps> = (props) => {
    useDocumentTitle("Arogga | Employee Bank Create");

    return (
        <Create {...props}>
            <SimpleForm redirect="list">
                <EmployeeBankCreateEdit page="create" />
            </SimpleForm>
        </Create>
    );
};

export default EmployeeBankCreate;
