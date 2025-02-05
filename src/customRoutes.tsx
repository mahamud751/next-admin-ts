import { Route } from "react-router-dom";

import { LabZoneList, LabZoneShow } from "./pages/manageLabTest/manageZoneMain";
import LabReport from "./pages/manageLabTest/manageLabReport/LabReport";
import SwitchToPage from "./pages/switchTo";
import PrivateRoute from "./components/common/PrivateRoute";
import DailyReports2Page from "./pages/manageFinance/dailyReports2";
import ProductReview from "./pages/manageReview/productReview";

const routes = [
  <PrivateRoute exact path="/daily-reports-2" component={DailyReports2Page} />,
  <PrivateRoute exact path="/lab-reports" component={LabReport} />,
  <PrivateRoute exact path="/zone-main" component={LabZoneList} />,
  <PrivateRoute exact path="/zone-main/:id" component={LabZoneShow} />,
  <PrivateRoute
    exact
    path="/productReview/:reviewStatusType"
    component={ProductReview}
  />,
  <PrivateRoute exact path="/switch-to" component={SwitchToPage} />,
];

export default routes;
