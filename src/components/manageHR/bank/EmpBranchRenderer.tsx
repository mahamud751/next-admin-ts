import { FC } from "react";
import { RaRecord as Record } from "react-admin";

type UserEmployeeOptionTextRendererProps = {
  record?: Record;
  isEmployee?: boolean;
};

const EmpBranchRenderer: FC<UserEmployeeOptionTextRendererProps> = ({
  record,
  isEmployee,
}) => {
  if (isEmployee)
    return (
      <span>
        {!!record ? `${!!record?.b_branch ? record.b_branch : ""}` : ""}
      </span>
    );

  return (
    <span>
      {!!record ? `${!!record?.b_branch ? record.b_branch : ""}` : ""}
    </span>
  );
};

export default EmpBranchRenderer;
