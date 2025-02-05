import { FC } from "react";
import { Show, ShowProps, Tab, TabbedShowLayout } from "react-admin";

import { useDocumentTitle } from "../../../hooks";
import {
    AttendanceTab,
    BankTab,
    GeneralTab,
    HistoryTab,
    InfoTab,
    LeaveTab,
    LoanTab,
    SalaryTab,
} from "./tabs";

const EmployeeShow: FC<ShowProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Employee Show");

    return (
        <Show {...rest}>
            <TabbedShowLayout>
                <Tab label="General">
                    <GeneralTab />
                </Tab>
                <Tab label="Info">
                    <InfoTab />
                </Tab>
                <Tab label="Leave">
                    <LeaveTab />
                </Tab>
                <Tab label="Salary">
                    <SalaryTab />
                </Tab>
                <Tab label="Loan">
                    <LoanTab />
                </Tab>
                <Tab label="Attendance">
                    <AttendanceTab />
                </Tab>
                <Tab label="History">
                    <HistoryTab />
                </Tab>
                <Tab label="Banks">
                    <BankTab />
                </Tab>
            </TabbedShowLayout>
        </Show>
    );
};

export default EmployeeShow;
