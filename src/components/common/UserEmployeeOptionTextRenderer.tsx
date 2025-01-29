import { FC } from "react";
import { RaRecord } from "react-admin";

type UserEmployeeOptionTextRendererProps = {
  record?: RaRecord;
  isEmployee?: boolean;
};

const UserEmployeeOptionTextRenderer: FC<
  UserEmployeeOptionTextRendererProps
> = ({ record }) => {
  let name;
  let mobileNo;

  if (record?.e_name || record?.e_mobile) {
    name = record?.e_name || "";
    mobileNo = record?.e_mobile || "";
  } else {
    name = record?.u_name || "";
    mobileNo = record?.u_mobile || "";
  }

  return (
    <>
      {!!record
        ? `${name} ${name && mobileNo ? `(${mobileNo})` : mobileNo}`
        : ""}
    </>
  );
};

export default UserEmployeeOptionTextRenderer;
