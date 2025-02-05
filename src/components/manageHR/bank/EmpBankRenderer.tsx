import { FC } from "react";
import { RaRecord as Record } from "react-admin";

type UserEmployeeOptionTextRendererProps = {
  record?: Record;
  isEmployee?: boolean;
};

const EmpBankRenderer: FC<UserEmployeeOptionTextRendererProps> = ({
  record,
  isEmployee,
}) => {
  if (isEmployee)
    return (
      <span>{!!record ? `${!!record?.b_name ? record.b_name : ""}` : ""}</span>
    );

  return (
    <span>{!!record ? `${!!record?.b_name ? record.b_name : ""}` : ""}</span>
  );
};

export default EmpBankRenderer;
