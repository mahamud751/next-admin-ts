import { Route } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import { LabZoneList, LabZoneShow } from "./pages/manageLabTest/manageZoneMain";
import LabReport from "./pages/manageLabTest/manageLabReport/LabReport";

const routes = [
  <PrivateRoute exact path="/lab-reports" component={LabReport} />,
  <PrivateRoute exact path="/zone-main" component={LabZoneList} />,
  <PrivateRoute exact path="/zone-main/:id" component={LabZoneShow} />,
];

export default routes;
