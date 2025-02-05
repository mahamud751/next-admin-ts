import { FC } from "react";
import { Create, CreateProps, SimpleForm, TransformData } from "react-admin";

import EmployeeCreateEdit from "@/components/manageHR/employees/EmployeeCreateEdit";
import { useDocumentTitle } from "@/hooks";

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
  e_payment_mode: "cash",
  shifts: shifts?.map((s_id) => ({ s_id })),
  holidays: holidays?.map((eh_holiday_type) => ({ eh_holiday_type })),
  user: { u_email, u_role },
});

const EmployeeCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Employee Create");

  return (
    <Create {...props} transform={transform} redirect="list">
      <SimpleForm>
        <EmployeeCreateEdit
          page="create"
          // @ts-ignore
          userRecord={props.history.location.state?.userRecord}
        />
      </SimpleForm>
    </Create>
  );
};

export default EmployeeCreate;
