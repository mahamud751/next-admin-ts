import { Route } from "react-router-dom";

import { LabZoneList, LabZoneShow } from "./pages/manageLabTest/manageZoneMain";
import LabReport from "./pages/manageLabTest/manageLabReport/LabReport";
import SwitchToPage from "./pages/switchTo";
import PrivateRoute from "./components/common/PrivateRoute";

const routes = [
  <PrivateRoute exact path="/lab-reports" component={LabReport} />,
  <PrivateRoute exact path="/zone-main" component={LabZoneList} />,
  <PrivateRoute exact path="/zone-main/:id" component={LabZoneShow} />,
  <PrivateRoute exact path="/switch-to" component={SwitchToPage} />,
];

export default routes;
