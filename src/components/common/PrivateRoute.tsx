import { Navigate, Route } from "react-router-dom";

import { useGetCurrentUser } from "@/hooks";

const PrivateRoute = ({ path, component: Component, ...rest }) => {
  // React admin usePermissions hook is not used here because of value is undefined when initial load.
  const { permissions } = useGetCurrentUser();

  if (
    (path === "/departments" && !permissions?.includes("departmentMenu")) ||
    (path === "/designations" && !permissions?.includes("rankMenu")) ||
    (path === "/designation-permission/:designationId" &&
      !permissions?.includes("rankMenu")) ||
    (path === "/menu-items/:id" &&
      (!permissions?.includes("menuMenu") ||
        !permissions?.includes("menuView"))) ||
    (path === "/sa-settings" && !permissions?.includes("superAdmin")) ||
    (path === "/settings" && !permissions?.includes("settingsMenu")) ||
    (path === "/ledger" && !permissions?.includes("ledgerMenu")) ||
    (path === "/trial-balance" && !permissions?.includes("trialBalanceMenu")) ||
    (path === "/balance-sheet" && !permissions?.includes("balanceSheetMenu")) ||
    (path === "/income-statement" &&
      !permissions?.includes("incomeStatementMenu")) ||
    (path === "/prescriptions" && !permissions?.includes("prescriptionMenu")) ||
    (path === "/promotional-messages" &&
      !permissions?.includes("promotionalMessageMenu")) ||
    (path === "/live-info" && !permissions?.includes("liveInfoMenu")) ||
    (path === "/system-status" && !permissions?.includes("viewSystemStatus")) ||
    (path === "/employeeDashboard" &&
      !permissions?.includes("employeeAttendanceMenu")) ||
    (path === "/employeeHierarchy" &&
      !permissions?.includes("employeeHierarchyMenu")) ||
    ((path === "/permissions" || path === "/permissions-list") &&
      !permissions?.includes("permissionMenu")) ||
    (path === "/switch-to" &&
      process.env.NEXT_PUBLIC_NODE_ENV === "development") ||
    (path === "/lab-reports" && !permissions?.includes("labReportMenu")) ||
    (path === "/daily-reports-2" &&
      (!permissions?.includes("dailyReportMenu") ||
        !permissions?.includes("dailyReportView")))
  ) {
    return <Navigate to="/not-found" />;
  }

  // @ts-ignore
  return <Route {...rest} path component={Component} />;
};

export default PrivateRoute;
