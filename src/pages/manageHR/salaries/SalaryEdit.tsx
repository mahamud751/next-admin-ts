import { FC } from "react";
import {
    Edit,
    EditProps,
    FormTab,
    TabbedForm,
    useDataProvider,
    useNotify,
    useRedirect,
} from "react-admin";

import SaveDeleteToolbar from "../../../components/SaveDeleteToolbar";
import AdjustmentTab from "../../../components/manageHR/salaries/AdjustmentTab";
import SalaryEditPage from "../../../components/manageHR/salaries/SalaryEditPage";
import { useDocumentTitle } from "../../../hooks";
import SalaryEditActions from "./SalaryEditActions";

const SalaryEdit: FC<EditProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Salary Adjustment Edit");
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();

    const onSave = async (values) => {
        if (!values.s_payment_mode) {
            return notify("Payment method is required!", {
                type: "error",
            });
        }
        if (values.s_payment_mode !== "cash" && !values.s_eb_id) {
            return notify("Select Bank!", {
                type: "error",
            });
        }

        dataProvider
            // @ts-ignore
            .update("v1/salary", {
                id: values.s_id,
                data: {
                    s_payment_mode: values.s_payment_mode,
                    s_eb_id: values.s_eb_id,
                },
            })
            .then(() => {
                notify("Successfully updated!", { type: "success" });
                redirect("list", "/v1/salary");
            })
            .catch((err) =>
                notify(
                    err?.message || "Something went wrong, Please try again!",
                    {
                        type: "error",
                    }
                )
            );
    };

    return (
        <Edit
            mutationMode={
                process.env.REACT_APP_NODE_ENV === "development"
                    ? "pessimistic"
                    : "optimistic"
            }
            // @ts-ignore
            actions={<SalaryEditActions />}
            {...rest}
        >
            <TabbedForm toolbar={<SaveDeleteToolbar isSave />} save={onSave}>
                <FormTab label="Salary">
                    <SalaryEditPage />
                </FormTab>
                <FormTab label="Salary Adjustment">
                    <AdjustmentTab page="edit" />
                </FormTab>
            </TabbedForm>
        </Edit>
    );
};

export default SalaryEdit;
