import { FC, useCallback } from "react";
import {
  Create,
  CreateProps,
  SimpleForm,
  useCreate,
  useNotify,
  useRedirect,
} from "react-admin";

import SalaryCreatePage from "@/components/manageHR/salaries/SalaryCreatePage";
import { useDocumentTitle } from "@/hooks";
import { logger } from "@/utils/helpers";

const SalaryCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Salary Adjustment Create");

  const redirect = useRedirect();
  const notify = useNotify();
  const [create] = useCreate();

  const onSave = useCallback(
    async (values) => {
      try {
        await create("v1/salaryAdjustment", { data: values });
        redirect("list", "/v1/salary");
        notify("Salary adjustment created successfully!", { type: "success" });
      } catch (err) {
        logger(err);
        notify("Something went wrong, Please try again!", { type: "error" });
      }
    },
    [create, redirect, notify]
  );

  return (
    <Create {...props} redirect="list">
      <SimpleForm onSubmit={onSave}>
        <SalaryCreatePage
          // @ts-ignore
          salaryRecord={props.history.location.state?.salaryRecord}
        />
      </SimpleForm>
    </Create>
  );
};

export default SalaryCreate;
