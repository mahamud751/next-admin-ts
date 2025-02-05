import { Paper } from "@mui/material";
import { Tab, TabbedShowLayout, Title } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import DepartmentTab from "./departmentTab";
import DesignationTab from "./designationTab";
import EmployeeTab from "./employeeTab";

const EmployeeHierarchy = () => {
  useDocumentTitle("Arogga | Employee Hierarchy");
  return (
    <Paper style={{ marginTop: 15 }}>
      <Title title="Employee Hierarchy" />
      <div style={{ marginTop: "10px", paddingBottom: 20, height: "100%" }}>
        <TabbedShowLayout syncWithLocation={false}>
          <Tab label="Department Hierarchy">
            <DepartmentTab />
          </Tab>
          <Tab label="Designation Hierarchy">
            <DesignationTab />
          </Tab>
          <Tab label="Employee Hierarchy">
            <EmployeeTab />
          </Tab>
        </TabbedShowLayout>
      </div>
    </Paper>
  );
};

export default EmployeeHierarchy;
