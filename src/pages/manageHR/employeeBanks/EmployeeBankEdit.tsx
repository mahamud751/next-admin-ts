import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

import SaveDeleteToolbar from "../../../components/SaveDeleteToolbar";
import EmployeeBankCreateEdit from "../../../components/manageHR/employeeBanks/EmployeeBankCreateEdit";
import { useDocumentTitle } from "../../../hooks";

const EmployeeBankEdit: FC<EditProps> = (props) => {
    useDocumentTitle("Arogga | Employee Bank Edit");

    return (
        <Edit
            mutationMode={
                process.env.REACT_APP_NODE_ENV === "development"
                    ? "pessimistic"
                    : "optimistic"
            }
            {...props}
        >
            <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
                <EmployeeBankCreateEdit page="edit" />
            </SimpleForm>
        </Edit>
    );
};

export default EmployeeBankEdit;
