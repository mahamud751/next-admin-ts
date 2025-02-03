/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import DollarIcon from "@mui/icons-material/AttachMoney";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Title, usePermissions } from "react-admin";

import CardWithIcon from "@/components/dashboard/CardWithIcon";
import PieChartCustomTooltip from "@/components/dashboard/PieChartCustomTooltip";
import Welcome from "@/components/dashboard/Welcome";
import { useDocumentTitle, useRequest } from "@/hooks";
import { toFixedNumber } from "@/utils/helpers";
import Filter from "./Filter";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import PopularMedicines from "./PopularMedicines";
import UserCount from "./UserCount";
import LoaderOrButton from "@/components/common/LoaderOrButton";

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

const Dashboard = (props) => {
  useDocumentTitle("Arogga | Dashboard");

  const classes = useStyles(props);
  const { permissions } = usePermissions();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterSelected, setFilterSelected] = useState("");
  const [usersPie, setUsersPie] = useState([]);
  const [ordersPie, setOrdersPie] = useState([]);
  const [orderCountState, setOrderCountState] = useState({});
  const [orderValueState, setOrderValueState] = useState({});
  const [userCountState, setUserCountState] = useState({});
  const [promotionalCallHideState, setPromotionalCallHideState] = useState({});
  const [agentHideState, setAgentHideState] = useState({});
  const [delHideState, setDelHideState] = useState({});
  const [packingHideState, setPackingHideState] = useState({});
  const [checkingHideState, setCheckingHideState] = useState({});

  const isAdminDashboardViewPermission =
    permissions?.includes("adminDashboardView");
  const isRoleOperator = permissions?.includes("role:operator");

  const { data: summaryData, refetch: refetchSummary } = useRequest(
    `/v1/report/summary/?dateFrom=${fromDate}&dateTo=${toDate}`
  );

  const {
    data: ordersData,
    isSuccess: isSuccessOrders,
    refetch: refetchOrders,
  } = useRequest(`/v1/report/orders/?dateFrom=${fromDate}&dateTo=${toDate}`);

  const {
    data: usersData,
    isSuccess: isSuccessUsers,
    refetch: refetchUsers,
  } = useRequest(`/v1/report/users/?dateFrom=${fromDate}&dateTo=${toDate}`);

  const {
    data: promotionalCallData,
    isLoading: isLoadingPromotionalCall,
    refetch: refetchPromotionalCall,
    reset: resetPromotionalCall,
  } = useRequest(
    `/v1/report/promotionalCalls/?dateFrom=${fromDate}&dateTo=${toDate}`
  );

  const {
    data: agentPerformanceData,
    refetch: refetchAgentPerformance,
    reset: resetAgentPerformance,
  } = useRequest(`/v1/agentPerformance/?dateFrom=${fromDate}&dateTo=${toDate}`);

  const {
    data: deOrdersData,
    isLoading: isLoadingDeOrders,
    refetch: refetchDeOrders,
    reset: resetDeOrders,
  } = useRequest(`/v1/report/deOrders/?dateFrom=${fromDate}&dateTo=${toDate}`);

  const {
    data: packedByData,
    isLoading: isLoadingPackedBy,
    refetch: refetchPackedBy,
    reset: resetPackedBy,
  } = useRequest(`/v1/report/packedBy/?dateFrom=${fromDate}&dateTo=${toDate}`);

  const {
    data: checkedByData,
    isLoading: isLoadingCheckedBy,
    refetch: refetchCheckedBy,
    reset: resetCheckedBy,
  } = useRequest(`/v1/report/checkedBy/?dateFrom=${fromDate}&dateTo=${toDate}`);

  const {
    data: popularMedicinesData,
    isLoading: isLoadingPopularMedicines,
    refetch: refetchPopularMedicines,
    reset: resetPopularMedicines,
  } = useRequest(
    `/v1/report/popularMedicines/?dateFrom=${fromDate}&dateTo=${toDate}`
  );

  useEffect(() => {
    if (!ordersData) return;

    if (ordersData.orders.orderCount) {
      const ordersPieObj = sumObjectsByKey(...ordersData?.orders?.orderCount);
      delete ordersPieObj.total;
      const ordersPieArr = Object.keys(ordersPieObj).map((item) => ({
        label: item,
        value: ordersPieObj[item],
      }));
      setOrdersPie(ordersPieArr);
    }
  }, [isSuccessOrders]);

  useEffect(() => {
    if (!usersData) return;

    if (usersData.users) {
      const userPieObj = sumObjectsByKey(...usersData.users);
      userPieObj.total = userPieObj.total - userPieObj.ordered;
      userPieObj.ordered = userPieObj.ordered - userPieObj.repeated;
      const userPieArr = Object.keys(userPieObj).map((item) => ({
        label: "total" === item ? "Not Ordered" : item,
        value: userPieObj[item],
      }));
      setUsersPie(userPieArr);
    }
  }, [isSuccessUsers]);

  useEffect(() => {
    if (isAdminDashboardViewPermission && fromDate && toDate) {
      // refetchSummary();
      // refetchOrders();
      // refetchUsers();
    }
    if (isRoleOperator && fromDate && toDate) {
      // refetchAgentPerformance();
    }
  }, [isAdminDashboardViewPermission, isRoleOperator, fromDate, toDate]);

  useEffect(() => {
    if (filterSelected) {
      handleFilter(filterSelected);
    } else {
      const dashboardFilter = localStorage.getItem("dashboard-filter")
        ? localStorage.getItem("dashboard-filter")
        : "Last 30 days";
      handleFilter(dashboardFilter);
    }
  }, [filterSelected]);

  const {
    users,
    prev_users,
    orders,
    prev_orders,
    revenue,
    prev_revenue,
    profit,
    prev_profit,
    gmv,
    prev_gmv,
    avg_basket_size,
    prev_avg_basket_size,
  } = summaryData?.summary ? summaryData?.summary : [];

  const usersReportData = usersData?.users ? usersData?.users : [];
  const { orderCount, orderValue } = ordersData?.orders
    ? ordersData?.orders
    : [];

  const sumObjectsByKey = (...objs: any[]) => {
    return objs.reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k) && "date" !== k) a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
  };

  const handleFilter = (e) => {
    setFilterSelected(e);

    !!promotionalCallData?.agents && resetPromotionalCall();
    !!agentPerformanceData && resetAgentPerformance();
    !!deOrdersData?.deOrders && resetDeOrders();
    !!packedByData?.packedBy && resetPackedBy();
    !!checkedByData?.checkedBy && resetCheckedBy();
    !!popularMedicinesData?.popularMedicines && resetPopularMedicines();

    switch (e) {
      case "Today":
        setFromDate(DateTime.now().toFormat("yyyy-MM-dd"));
        setToDate(DateTime.now().toFormat("yyyy-MM-dd"));
        break;
      case "Yesterday":
        setFromDate(DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd"));
        setToDate(DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd"));
        break;
      case "This week":
        setFromDate(DateTime.now().startOf("week").toFormat("yyyy-MM-dd"));
        setToDate(DateTime.now().endOf("week").toFormat("yyyy-MM-dd"));
        break;
      case "Last week":
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
        break;
      case "Last 30 days":
        setFromDate(DateTime.now().minus({ days: 30 }).toFormat("yyyy-MM-dd"));
        setToDate(DateTime.now().toFormat("yyyy-MM-dd"));
        break;
      case "This Month":
        setFromDate(DateTime.now().startOf("month").toFormat("yyyy-MM-dd"));
        setToDate(DateTime.now().endOf("month").toFormat("yyyy-MM-dd"));
        break;
      case "Last Month":
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
        break;
      case "This year":
        setFromDate(DateTime.now().startOf("year").toFormat("yyyy-MM-dd"));
        setToDate(DateTime.now().endOf("year").toFormat("yyyy-MM-dd"));
        break;
      case "Last year":
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
        break;
      case "Custom":
        setFromDate(localStorage.getItem("dashboard-filter-from") || "");
        setToDate(localStorage.getItem("dashboard-filter-to") || "");
        break;
      default:
        break;
    }

    localStorage.setItem("dashboard-filter", e);
  };

  return <Welcome />;

  //  if (!isAdminDashboardViewPermission && !isRoleOperator) return <Welcome />;

  return (
    <div style={{ marginTop: 10 }}>
      <Title title="Dashboard" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          float: "right",
        }}
      >
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
                localStorage.setItem("dashboard-filter-from", e.target.value);
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
                localStorage.setItem("dashboard-filter-to", e.target.value);
              }}
            />
          </>
        )}
        <Filter
          handleFilter={handleFilter}
          filterSelected={filterSelected}
          children={""}
        />
      </div>
      {isAdminDashboardViewPermission && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <CardWithIcon
              icon={PeopleIcon}
              text="Total User"
              takaSymbol={false}
              value={users}
              prev_value={prev_users}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardWithIcon
              icon={AddShoppingCartIcon}
              text="Total Order"
              takaSymbol={false}
              value={orders}
              prev_value={prev_orders}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardWithIcon
              icon={AllInboxIcon}
              text="Delivered Orders"
              takaSymbol={false}
              value={Math.round(revenue / avg_basket_size)}
              prev_value={Math.round(prev_revenue / prev_avg_basket_size)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardWithIcon
              icon={DollarIcon}
              text="Total Revenue"
              takaSymbol={true}
              value={revenue}
              prev_value={prev_revenue}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardWithIcon
              icon={DollarIcon}
              text="Total GMV"
              takaSymbol={true}
              value={gmv}
              prev_value={prev_gmv}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardWithIcon
              icon={LocalAtmIcon}
              text="Total Profit"
              takaSymbol={true}
              value={profit}
              prev_value={prev_profit}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardWithIcon
              icon={ShoppingBasketIcon}
              text="Avarage Basket Size"
              takaSymbol={true}
              value={avg_basket_size}
              prev_value={prev_avg_basket_size}
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={3} style={{ marginTop: 10 }}>
        {isAdminDashboardViewPermission && (
          <>
            <Grid item xs={12} sm={6}>
              <PieChart
                cardTitle="Orders Status"
                data={ordersPie}
                renderCustomizedLabel={renderCustomizedLabel}
                COLORS={COLORS}
                CustomTooltip={PieChartCustomTooltip}
                classes={classes}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PieChart
                cardTitle="Users Status"
                data={usersPie}
                renderCustomizedLabel={renderCustomizedLabel}
                COLORS={COLORS}
                CustomTooltip={PieChartCustomTooltip}
                classes={classes}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order Count</Typography>
                </CardContent>
                <LineChart
                  hideState={orderCountState}
                  setHideState={setOrderCountState}
                  chartData={orderCount}
                  lineData={ordersData?.orders?.legend}
                  COLORS={COLORS}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order Value</Typography>
                </CardContent>
                <LineChart
                  hideState={orderValueState}
                  setHideState={setOrderValueState}
                  chartData={orderValue}
                  lineData={ordersData?.orders?.legend}
                  COLORS={COLORS}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={12}>
              <UserCount
                userCountState={userCountState}
                setUserCountState={setUserCountState}
                usersReportData={usersReportData}
                COLORS={COLORS}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Agent Performance</Typography>
                    {!promotionalCallData?.agents && (
                      <LoaderOrButton
                        label="Load"
                        isLoading={isLoadingPromotionalCall}
                        onClick={refetchPromotionalCall}
                      />
                    )}
                  </Box>
                  {!!promotionalCallData?.agents && (
                    <LineChart
                      from="agent"
                      hideState={promotionalCallHideState}
                      setHideState={setPromotionalCallHideState}
                      chartData={promotionalCallData?.agents?.report}
                      lineData={promotionalCallData?.agents?.legend}
                      COLORS={COLORS}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        {isRoleOperator && (
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Your Performance</Typography>
                {!!agentPerformanceData && (
                  <LineChart
                    from="agent"
                    hideState={agentHideState}
                    setHideState={setAgentHideState}
                    chartData={agentPerformanceData?.report}
                    lineData={agentPerformanceData?.legend}
                    COLORS={COLORS}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
        {isAdminDashboardViewPermission && (
          <>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">
                      Deliveryman Performance
                    </Typography>
                    {!deOrdersData?.deOrders && (
                      <LoaderOrButton
                        label="Load"
                        isLoading={isLoadingDeOrders}
                        onClick={refetchDeOrders}
                      />
                    )}
                  </Box>
                  {!!deOrdersData?.deOrders && (
                    <LineChart
                      from="delivery"
                      hideState={delHideState}
                      setHideState={setDelHideState}
                      chartData={deOrdersData?.deOrders?.report}
                      lineData={deOrdersData?.deOrders?.legend}
                      COLORS={COLORS}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Packing Performance</Typography>
                    {!packedByData?.packedBy && (
                      <LoaderOrButton
                        label="Load"
                        isLoading={isLoadingPackedBy}
                        onClick={refetchPackedBy}
                      />
                    )}
                  </Box>
                  {!!packedByData?.packedBy && (
                    <LineChart
                      from="packing"
                      hideState={packingHideState}
                      setHideState={setPackingHideState}
                      chartData={packedByData?.packedBy?.report}
                      lineData={packedByData?.packedBy?.legend}
                      COLORS={COLORS}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Checking Performance</Typography>
                    {!checkedByData?.checkedBy && (
                      <LoaderOrButton
                        label="Load"
                        isLoading={isLoadingCheckedBy}
                        onClick={refetchCheckedBy}
                      />
                    )}
                  </Box>
                  {!!checkedByData?.checkedBy && (
                    <LineChart
                      from="checking"
                      hideState={checkingHideState}
                      setHideState={setCheckingHideState}
                      chartData={checkedByData?.checkedBy?.report}
                      lineData={checkedByData?.checkedBy?.legend}
                      COLORS={COLORS}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <PopularMedicines
                table="quantity"
                cardTitle="Popular Medicines Qty Wise"
                isLoading={isLoadingPopularMedicines}
                refetch={refetchPopularMedicines}
                data={
                  popularMedicinesData?.popularMedicines
                    ?.popular_medicines_quantity_wise
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PopularMedicines
                table="revenue"
                cardTitle="Popular Medicines Revenue Wise"
                isLoading={isLoadingPopularMedicines}
                refetch={refetchPopularMedicines}
                data={
                  popularMedicinesData?.popularMedicines
                    ?.popular_medicines_revenue_wise
                }
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};
const theme = createTheme({});
const useStyles = makeStyles(() => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    maxWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default Dashboard;
