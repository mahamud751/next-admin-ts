import { FC } from "react";
import { RaRecord as Record } from "react-admin";

type UserEmployeeOptionTextRendererProps = {
  record?: Record;
  isEmployee?: boolean;
};

const EmployeeBankTextRenderer: FC<UserEmployeeOptionTextRendererProps> = ({
  record,
  isEmployee,
}) => {
  if (isEmployee)
    return (
      <span>
        {!!record
          ? `${!!record?.eb_account_title ? record.eb_account_title : ""} ${
              !!record?.eb_bank_id ? `(${record.eb_bank_id})` : ""
            }`
          : ""}
      </span>
    );

  return (
    <span>
      {!!record
        ? `${!!record?.eb_account_title ? record.eb_account_title : ""} ${
            !!record?.eb_bank_id ? `(${record.eb_bank_id})` : ""
          }`
        : ""}
    </span>
  );
};

export default EmployeeBankTextRenderer;
