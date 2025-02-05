import { Route } from "react-router-dom";

import PrivateRoute from "./components/common/PrivateRoute";

import Zone from "./pages/manageDelivery/zones/Index";
import DailyReports2Page from "./pages/manageFinance/dailyReports2";
import DepartmentsPage from "./pages/manageHR/departments";
import DesignationsPage from "./pages/manageHR/designations";
import DesignationPermissionPage from "./pages/manageHR/designations/designationPermission";
import EmployeeDashboard from "./pages/manageHR/employeeDashboard/employeeDashboard";
import EmployeeHierarchy from "./pages/manageHR/employeeHierarchy/employeeHierarchy";
import LabReport from "./pages/manageLabTest/manageLabReport/LabReport";
import ZonesListMain from "./pages/manageLabTest/manageZoneMain/LabZoneList";
import ZoneShowMain from "./pages/manageLabTest/manageZoneMain/LabZoneShow";
import { PromotionalMessagePage } from "./pages/managePromotion";
import { MenuItemList } from "./pages/manageSite/menuItems";
import PermissionsPage from "./pages/manageUser/permissions";
import PermissionsList from "./pages/manageUser/permissionsList";
import PrescriptionPage from "./pages/manageUser/prescriptions";

import SwitchToPage from "./pages/switchTo";
import ProductReview from "./pages/manageReview/productReview";
import TestDetailsCreate from "./components/manageLabTest/LabTests/TestDetailsCreate";
import TestDetailsEdit from "./components/manageLabTest/LabTests/TestDetailsEdit";

const routes = [
  <PrivateRoute exact path="/departments" component={DepartmentsPage} />,
  <PrivateRoute exact path="/designations" component={DesignationsPage} />,
  <PrivateRoute
    exact
    path="/designation-permission/:designationId"
    component={DesignationPermissionPage}
  />,
  <PrivateRoute exact path="/menu-items/:id" component={MenuItemList} />,
  // <PrivateRoute exact path="/sa-settings" component={SuperAdminSettingsPage} />,
  // <PrivateRoute exact path="/settings" component={SettingsPage} />,
  // <PrivateRoute exact path="/unblockIp" component={UnBlockIpPage} />,
  // <PrivateRoute exact path="/ledger" component={LedgerPage} />,
  // <PrivateRoute exact path="/trial-balance" component={TrialBalancePage} />,
  // <PrivateRoute
  //   exact
  //   path="/income-statement"
  //   component={IncomeStatementPage}
  // />,
  // <PrivateRoute exact path="/balance-sheet" component={BalanceSheet} />,
  // <PrivateRoute exact path="/quotation/:id" component={QuotationCreate} />,
  // <PrivateRoute exact path="/prescriptions" component={PrescriptionPage} />,
  // <PrivateRoute exact path="/live-info" component={LiveInfoPage} />,
  // <PrivateRoute exact path="/system-status" component={SystemStatusPage} />,
  <PrivateRoute exact path="/permissions" component={PermissionsPage} />,
  <PrivateRoute exact path="/permissions-list" component={PermissionsList} />,
  <PrivateRoute exact path="/switch-to" component={SwitchToPage} />,
  <PrivateRoute
    exact
    path="/promotional-messages"
    component={PromotionalMessagePage}
  />,
  <PrivateRoute
    exact
    path="/employeeDashboard"
    component={EmployeeDashboard}
  />,
  <PrivateRoute exact path="/lab-reports" component={LabReport} />,
  <PrivateRoute exact path="/daily-reports-2" component={DailyReports2Page} />,
  <PrivateRoute exact path="/zone-main" component={ZonesListMain} />,
  <PrivateRoute exact path="/zone-main/:id" component={ZoneShowMain} />,
  <PrivateRoute
    exact
    path="/misc/api/v1/admin/lab-items/addNew/:id"
    component={TestDetailsCreate}
  />,
  <PrivateRoute
    exact
    path="/misc/api/v1/admin/lab-items/update/:id"
    component={TestDetailsEdit}
  />,
  // <Route
  //   exact
  //   path="/user-history/:userIdForSelectedHistory"
  //   // @ts-ignore
  //   component={UserHistoryPage}
  // />,
  // <Route exact path="/site-settings" component={SiteSettingsPage} />,
  <PrivateRoute
    exact
    path="/employeeDashboard"
    component={EmployeeDashboard}
  />,
  <PrivateRoute
    exact
    path="/employeeHierarchy"
    component={EmployeeHierarchy}
  />,
  // <PrivateRoute
  //   exact
  //   path="/printingAppVersion"
  //   component={PrintingAppFileUplaod}
  // />,
  <PrivateRoute exact path="/zone" component={Zone} />,
  <PrivateRoute
    exact
    path="/productReview/:reviewStatusType"
    component={ProductReview}
  />,
];

export default routes;
