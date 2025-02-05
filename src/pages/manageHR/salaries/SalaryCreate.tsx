import { FC, useCallback } from "react";
import {
    Create,
    CreateProps,
    SimpleForm,
    useMutation,
    useNotify,
    useRedirect,
} from "react-admin";

import SalaryCreatePage from "../../../components/manageHR/salaries/SalaryCreatePage";
import { useDocumentTitle } from "../../../hooks";
import { logger } from "../../../utils/helpers";

const SalaryCreate: FC<CreateProps> = (props) => {
    useDocumentTitle("Arogga | Salary Adjustment Create");

    const redirect = useRedirect();
    const notify = useNotify();
    const [mutate] = useMutation();

    const onSave = useCallback(
        async (values) => {
            try {
                await mutate(
                    {
                        type: "create",
                        resource: "v1/salaryAdjustment",
                        payload: { data: values },
                    },
                    { returnPromise: true }
                );
                redirect("list", "/v1/salary");
            } catch (err) {
                logger(err);
                notify("Something went wrong, Please try again!", {
                    type: "error",
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [mutate]
    );

    return (
        <Create {...props}>
            <SimpleForm redirect="list" save={onSave}>
                <SalaryCreatePage
                    // @ts-ignore
                    salaryRecord={props.history.location.state?.salaryRecord}
                />
            </SimpleForm>
        </Create>
    );
};

export default SalaryCreate;
