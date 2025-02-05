import { FC } from "react";
import { RaRecord as Record } from "react-admin";

type UserEmployeeBankOptionTextRendererProps = {
  record?: Record;
  isEmployee?: boolean;
};

const UserEmployeeBankOptionTextRenderer: FC<
  UserEmployeeBankOptionTextRendererProps
> = ({ record, isEmployee }) => {
  if (isEmployee)
    return (
      <span>
        {!!record
          ? `${!!record?.e_name ? record.e_name : ""} ${
              !!record?.e_mobile ? `(${record.e_mobile})` : ""
            }`
          : ""}
      </span>
    );

  return (
    <span>
      {!!record
        ? `${!!record?.e_name ? record.e_name : ""} ${
            !!record?.e_mobile ? `(${record.e_mobile})` : ""
          }`
        : ""}
    </span>
  );
};

export default UserEmployeeBankOptionTextRenderer;
