import {
    Box,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    makeStyles,
} from "@material-ui/core";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
    AutocompleteInput,
    Link,
    ReferenceInput,
    SimpleForm,
    Title,
} from "react-admin";
import FormatedBooleanInput from "../../../components/FormatedBooleanInput";
import LoaderOrButton from "../../../components/LoaderOrButton";
import TaxonomiesByVocabularyInput from "../../../components/TaxonomiesByVocabularyInput";
import TreeDropdownInput from "../../../components/TreeDropdownInput";
import UserEmployeeOptionTextRenderer from "../../../components/UserEmployeeOptionTextRenderer";
import { useDocumentTitle, useRequest } from "../../../hooks";
import { toFixedNumber } from "../../../utils/helpers";
import EmployeeList from "./EmployeeList";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import PieChartCustomTooltip from "./PieChartCustomTooltip";

const EmployeeDashboard = () => {
    useDocumentTitle("Arogga | Employee Dashboard");

    const classes = useStyles();

    const [fromDate, setFromDate] = useState(
        DateTime.now().toFormat("yyyy-MM-dd")
    );
    const [toDate, setToDate] = useState(DateTime.now().toFormat("yyyy-MM-dd"));
    const [filterSelected, setFilterSelected] = useState("Today");
    const [shiftType, setshiftType] = useState(null);
    const [shift, setshift] = useState("");
    const [department, setdepartment] = useState(null);
    const [includeChildDepartment, setincludeChildDepartment] = useState(false);
    const [employee, setemployee] = useState("");
    const [overviewCountState, setoverviewCountState] = useState({});
    const [attendancePie, setAttendancePie] = useState([]);
    const [isLoadingAbsent, setisLoadingAbsent] = useState(false);
    const [isLoadingActive, setisLoadingActive] = useState(false);

    const sumObjectsByKey = (...objs: any[]) => {
        return objs.reduce((a, b) => {
            for (let k in b) {
                if (b.hasOwnProperty(k) && "date" !== k)
                    a[k] = (a[k] || 0) + b[k];
            }
            return a;
        }, {});
    };
    const COLORS = [
        "#F47A1F",
        "#FDBB2F",
        "#377B2B",
        "#7AC142",
        "#007CC3",
        "#00529B",
    ];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${toFixedNumber(percent * 100, 0)}%`}
            </text>
        );
    };
    const { data, isLoading, refetch } = useRequest(
        `/v1/employeeDashboard?_attendance_date=${fromDate}&_attendance_date_end=${toDate}&_department=${
            department ? department : ""
        }&_include_child_department=${includeChildDepartment}&_shift_type=${
            shiftType ? shiftType : ""
        }&_s_id=${shift}&_employee_id=${employee}`,
        {},
        { isWarningNotify: false }
    );

    useEffect(() => {
        if (data?.overview) {
            refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        fromDate,
        toDate,
        shiftType,
        shift,
        department,
        includeChildDepartment,
        employee,
    ]);

    useEffect(() => {
        if (!data) return;

        if (data.overview) {
            const attendancePieObj = sumObjectsByKey(...data?.overview);
            delete attendancePieObj.total;
            const attendancePieArr = Object.keys(attendancePieObj).map(
                (item) => ({
                    label: item,
                    value: attendancePieObj[item],
                })
            );
            setAttendancePie(attendancePieArr);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const handleFilter = (e) => {
        setFilterSelected(e);
        if (e === "Today") {
            setFromDate(DateTime.now().toFormat("yyyy-MM-dd"));
            setToDate(DateTime.now().toFormat("yyyy-MM-dd"));
        } else if (e === "Yesterday") {
            setFromDate(
                DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd")
            );
            setToDate(DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd"));
        } else if (e === "Tomorrow") {
            setFromDate(
                DateTime.now().plus({ days: 1 }).toFormat("yyyy-MM-dd")
            );
            setToDate(DateTime.now().plus({ days: 1 }).toFormat("yyyy-MM-dd"));
        } else if (e === "This week") {
            setFromDate(DateTime.now().startOf("week").toFormat("yyyy-MM-dd"));
            setToDate(DateTime.now().endOf("week").toFormat("yyyy-MM-dd"));
        } else if (e === "Last week") {
            setFromDate(
                DateTime.now()
                    .minus({ weeks: 1 })
                    .startOf("week")
                    .toFormat("yyyy-MM-dd")
            );
            setToDate(
                DateTime.now()
                    .minus({ weeks: 1 })
                    .endOf("week")
                    .toFormat("yyyy-MM-dd")
            );
        } else if (e === "Last 30 days") {
            setFromDate(
                DateTime.now().minus({ days: 30 }).toFormat("yyyy-MM-dd")
            );
            setToDate(DateTime.now().toFormat("yyyy-MM-dd"));
        } else if (e === "This Month") {
            setFromDate(DateTime.now().startOf("month").toFormat("yyyy-MM-dd"));
            setToDate(DateTime.now().endOf("month").toFormat("yyyy-MM-dd"));
        } else if (e === "Last Month") {
            setFromDate(
                DateTime.now()
                    .minus({ months: 1 })
                    .startOf("month")
                    .toFormat("yyyy-MM-dd")
            );
            setToDate(
                DateTime.now()
                    .minus({ months: 1 })
                    .endOf("month")
                    .toFormat("yyyy-MM-dd")
            );
        } else if (e === "This year") {
            setFromDate(DateTime.now().startOf("year").toFormat("yyyy-MM-dd"));
            setToDate(DateTime.now().endOf("year").toFormat("yyyy-MM-dd"));
        } else if (e === "Last year") {
            setFromDate(
                DateTime.now()
                    .minus({ years: 1 })
                    .startOf("year")
                    .toFormat("yyyy-MM-dd")
            );
            setToDate(
                DateTime.now()
                    .minus({ years: 1 })
                    .endOf("year")
                    .toFormat("yyyy-MM-dd")
            );
        }
    };
    return (
        <Paper style={{ marginTop: 15 }}>
            <Title title="Employee Dashboard" />
            <div style={{ marginTop: "10px" }}>
                <SimpleForm toolbar={null}>
                    <Grid style={{ width: "100%" }} container>
                        <Grid item className={classes.marginRight}>
                            <TaxonomiesByVocabularyInput
                                fetchKey="shift_type"
                                source="_shift_type"
                                label="Shift Type"
                                defaultValue={shiftType}
                                onChange={(e) => setshiftType(e?.target?.value)}
                                resettable
                            />
                        </Grid>
                        {shiftType && (
                            <Grid item className={classes.marginRight}>
                                <ReferenceInput
                                    source="_s_id"
                                    label="Shift"
                                    variant="outlined"
                                    helperText={false}
                                    reference="v1/shift"
                                    sort={{ field: "s_id", order: "DESC" }}
                                    filter={{ _shift_type: shiftType }}
                                    onChange={(e) => setshift(e)}
                                    defaultValue={shift}
                                >
                                    <AutocompleteInput
                                        matchSuggestion={() => true}
                                        optionValue="s_id"
                                        optionText="s_title"
                                        resettable
                                    />
                                </ReferenceInput>
                            </Grid>
                        )}

                        <Grid item className={classes.marginRight}>
                            <TreeDropdownInput
                                reference="/v1/taxonomiesByVocabulary/department"
                                source="_department"
                                label="Department"
                                variant="outlined"
                                keyId="t_id"
                                keyParent="t_parent_id"
                                optionValue="t_machine_name"
                                optionTextValue="t_title"
                                onChange={(e) =>
                                    setdepartment(e?.target?.value)
                                }
                                defaultValue={department}
                                resettable
                            />
                        </Grid>
                        {department && (
                            <FormatedBooleanInput
                                source="_include_child_department"
                                label="Include Child Department"
                                onChange={(e) => setincludeChildDepartment(e)}
                            />
                        )}
                        <Grid item className={classes.marginRight}>
                            <ReferenceInput
                                source="_employee_id"
                                label="Employee"
                                variant="outlined"
                                helperText={false}
                                reference="v1/employee"
                                sort={{ field: "e_id", order: "DESC" }}
                                onChange={(e) => setemployee(e)}
                                defaultValue={employee}
                            >
                                <AutocompleteInput
                                    matchSuggestion={() => true}
                                    optionValue="e_id"
                                    optionText={
                                        <UserEmployeeOptionTextRenderer
                                            isEmployee
                                        />
                                    }
                                    inputText={(record: {
                                        e_name: string;
                                        e_mobile: string;
                                    }) =>
                                        !!record
                                            ? `${record.e_name} (${record.e_mobile})`
                                            : ""
                                    }
                                    resettable
                                />
                            </ReferenceInput>
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel>Filter</InputLabel>
                                <Select
                                    value={filterSelected}
                                    onChange={(e) =>
                                        handleFilter(e.target.value)
                                    }
                                >
                                    <MenuItem value="Today">Today</MenuItem>
                                    <MenuItem value="Yesterday">
                                        Yesterday
                                    </MenuItem>
                                    <MenuItem value="Tomorrow">
                                        Tomorrow
                                    </MenuItem>
                                    <MenuItem value="This week">
                                        This week
                                    </MenuItem>
                                    <MenuItem value="Last week">
                                        Last week
                                    </MenuItem>
                                    <MenuItem value="Last 30 days">
                                        Last 30 days
                                    </MenuItem>
                                    <MenuItem value="This Month">
                                        This Month
                                    </MenuItem>
                                    <MenuItem value="Last Month">
                                        Last Month
                                    </MenuItem>
                                    <MenuItem value="This year">
                                        This year
                                    </MenuItem>
                                    <MenuItem value="Last year">
                                        Last year
                                    </MenuItem>
                                    <MenuItem value="Custom">Custom</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            {filterSelected === "Custom" && (
                                <>
                                    <TextField
                                        label="From"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        className={classes.textField}
                                        defaultValue={fromDate}
                                        onChange={(e) => {
                                            setFromDate(e.target.value);
                                        }}
                                    />
                                    <TextField
                                        label="To"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        className={classes.textField}
                                        defaultValue={toDate}
                                        onChange={(e) => {
                                            setToDate(e.target.value);
                                        }}
                                    />
                                </>
                            )}
                        </Grid>
                    </Grid>
                </SimpleForm>
            </div>
            <div style={{ padding: 15 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={1}
                                >
                                    <Typography variant="h6">
                                        Not Comming ( Leave + Holiday + Weekend
                                        )
                                    </Typography>
                                    <Link
                                        to={{
                                            pathname: "/v1/employeeAttendance",
                                            search: `filter=${JSON.stringify({
                                                _attendance_status: "",
                                                _attendance_status_type:
                                                    "leave,holiday",
                                                _attendance_date: fromDate,
                                                _attendance_date_end: toDate,
                                                _department: department,
                                                _include_child_department:
                                                    includeChildDepartment,
                                                _employee_id: employee,
                                                _shift_type: shiftType,
                                                _s_id: shift,
                                            })}`,
                                        }}
                                        target="_blank"
                                    >
                                        View All
                                    </Link>
                                </Box>
                                <EmployeeList
                                    filter={{
                                        fromDate,
                                        toDate,
                                        shiftType,
                                        shift,
                                        department,
                                        include_child_department:
                                            includeChildDepartment,
                                        employee,
                                        status: "",
                                        status_type: "leave,holiday",
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={1}
                                >
                                    <Typography variant="h6">
                                        Comming
                                    </Typography>
                                    <Link
                                        to={{
                                            pathname: "/v1/employeeAttendance",
                                            search: `filter=${JSON.stringify({
                                                _attendance_status: "active",
                                                _attendance_status_type: "",
                                                _attendance_date: fromDate,
                                                _attendance_date_end: toDate,
                                                _department: department,
                                                _include_child_department:
                                                    includeChildDepartment,
                                                _employee_id: employee,
                                                _shift_type: shiftType,
                                                _s_id: shift,
                                            })}`,
                                        }}
                                        target="_blank"
                                    >
                                        View All
                                    </Link>
                                </Box>
                                <EmployeeList
                                    filter={{
                                        fromDate,
                                        toDate,
                                        shiftType,
                                        shift,
                                        department,
                                        include_child_department:
                                            includeChildDepartment,
                                        employee,
                                        status: "active",
                                        status_type: "",
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={1}
                                >
                                    <Typography variant="h6">
                                        Present
                                    </Typography>
                                    <Link
                                        to={{
                                            pathname: "/v1/employeeAttendance",
                                            search: `filter=${JSON.stringify({
                                                _attendance_status:
                                                    "present,delayed",
                                                _attendance_status_type: "",
                                                _attendance_date: fromDate,
                                                _attendance_date_end: toDate,
                                                _department: department,
                                                _include_child_department:
                                                    includeChildDepartment,
                                                _employee_id: employee,
                                                _shift_type: shiftType,
                                                _s_id: shift,
                                            })}`,
                                        }}
                                        target="_blank"
                                    >
                                        View All
                                    </Link>
                                </Box>
                                <EmployeeList
                                    filter={{
                                        fromDate,
                                        toDate,
                                        shiftType,
                                        shift,
                                        department,
                                        include_child_department:
                                            includeChildDepartment,
                                        employee,
                                        status: "present,delayed",
                                        status_type: "",
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={1}
                                >
                                    <Typography variant="h6">
                                        Delayed
                                    </Typography>
                                    <Link
                                        to={{
                                            pathname: "/v1/employeeAttendance",
                                            search: `filter=${JSON.stringify({
                                                _attendance_status: "",
                                                _attendance_status_type:
                                                    "active",
                                                _attendance_date: fromDate,
                                                _attendance_date_end: toDate,
                                                _department: department,
                                                _include_child_department:
                                                    includeChildDepartment,
                                                _employee_id: employee,
                                                _shift_type: shiftType,
                                                _s_id: shift,
                                            })}`,
                                        }}
                                        target="_blank"
                                    >
                                        View All
                                    </Link>
                                </Box>
                                <EmployeeList
                                    filter={{
                                        fromDate,
                                        toDate,
                                        shiftType,
                                        shift,
                                        department,
                                        include_child_department:
                                            includeChildDepartment,
                                        employee,
                                        status: "delayed",
                                        status_type: "",
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={1}
                                >
                                    <Typography variant="h6">Active</Typography>
                                    {isLoadingActive ? (
                                        <Link
                                            to={{
                                                pathname:
                                                    "/v1/employeeAttendance",
                                                search: `filter=${JSON.stringify(
                                                    {
                                                        _attendance_status: "",
                                                        _attendance_status_type:
                                                            "active",
                                                        _attendance_date:
                                                            fromDate,
                                                        _attendance_date_end:
                                                            toDate,
                                                        _department: department,
                                                        _include_child_department:
                                                            includeChildDepartment,
                                                        _employee_id: employee,
                                                        _shift_type: shiftType,
                                                        _s_id: shift,
                                                    }
                                                )}`,
                                            }}
                                            target="_blank"
                                        >
                                            View All
                                        </Link>
                                    ) : (
                                        <LoaderOrButton
                                            label="Load"
                                            onClick={() =>
                                                setisLoadingActive(true)
                                            }
                                        />
                                    )}
                                </Box>
                                {isLoadingActive && (
                                    <EmployeeList
                                        filter={{
                                            fromDate,
                                            toDate,
                                            shiftType,
                                            shift,
                                            department,
                                            include_child_department:
                                                includeChildDepartment,
                                            employee,
                                            status: "",
                                            status_type: "active",
                                        }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={1}
                                >
                                    <Typography variant="h6">Absent</Typography>
                                    {isLoadingAbsent ? (
                                        <Link
                                            to={{
                                                pathname:
                                                    "/v1/employeeAttendance",
                                                search: `filter=${JSON.stringify(
                                                    {
                                                        _attendance_status:
                                                            "absent",
                                                        _attendance_status_type:
                                                            "",
                                                        _attendance_date:
                                                            fromDate,
                                                        _attendance_date_end:
                                                            toDate,
                                                        _department: department,
                                                        _include_child_department:
                                                            includeChildDepartment,
                                                        _employee_id: employee,
                                                        _shift_type: shiftType,
                                                        _s_id: shift,
                                                    }
                                                )}`,
                                            }}
                                            target="_blank"
                                        >
                                            View All
                                        </Link>
                                    ) : (
                                        <LoaderOrButton
                                            label="Load"
                                            onClick={() =>
                                                setisLoadingAbsent(true)
                                            }
                                        />
                                    )}
                                </Box>
                                {isLoadingAbsent && (
                                    <EmployeeList
                                        filter={{
                                            fromDate,
                                            toDate,
                                            shiftType,
                                            shift,
                                            department,
                                            include_child_department:
                                                includeChildDepartment,
                                            employee,
                                            status: "absent",
                                            status_type: "",
                                        }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h6">
                                        Attendance Overview
                                    </Typography>
                                    {!data?.overview && (
                                        <LoaderOrButton
                                            label="Load"
                                            isLoading={isLoading}
                                            onClick={refetch}
                                        />
                                    )}
                                </Box>
                                {!!data?.overview && (
                                    <LineChart
                                        hideState={overviewCountState}
                                        setHideState={setoverviewCountState}
                                        chartData={
                                            data?.overview ? data.overview : []
                                        }
                                        lineData={data?.overview?.legend}
                                        COLORS={COLORS}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h6">
                                        Attendance Status
                                    </Typography>
                                    {!data?.overview && (
                                        <LoaderOrButton
                                            label="Load"
                                            isLoading={isLoading}
                                            onClick={refetch}
                                        />
                                    )}
                                </Box>
                                {!!data?.overview && (
                                    <PieChart
                                        data={attendancePie}
                                        renderCustomizedLabel={
                                            renderCustomizedLabel
                                        }
                                        COLORS={COLORS}
                                        CustomTooltip={PieChartCustomTooltip}
                                        classes={classes}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        maxWidth: 200,
    },
    marginRight: {
        marginRight: theme.spacing(2),
    },
    formControl: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: 220,
    },
}));

export default EmployeeDashboard;
