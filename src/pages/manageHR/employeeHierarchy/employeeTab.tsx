import AroggaProgress from "@/components/common/AroggaProgress";
import { useRequest } from "@/hooks";
import OrganizationalChart from "./tree/orgChart";
const EmployeeTab = () => {
  const { data: employees, isLoading } = useRequest(
    "/admin/v1/employeeHierarchy/employee",
    {},
    { isBaseUrl: true, isPreFetching: true }
  );
  return (
    <div style={{ minHeight: "500px" }}>
      {isLoading ? (
        <AroggaProgress />
      ) : (
        <OrganizationalChart data={employees} />
      )}
    </div>
  );
};

export default EmployeeTab;
