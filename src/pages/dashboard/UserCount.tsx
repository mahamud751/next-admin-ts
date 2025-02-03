import { Card, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type UserCountProps = {
  userCountState: any;
  setUserCountState: (userCountState: object) => void;
  usersReportData: any;
  COLORS: string[];
};

const UserCount: FC<UserCountProps> = ({
  userCountState,
  setUserCountState,
  usersReportData,
  COLORS,
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6">User Count</Typography>
    </CardContent>
    <ResponsiveContainer height={300}>
      <LineChart
        data={usersReportData}
        margin={{
          left: 35,
          right: 35,
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          wrapperStyle={{
            height: "300px",
            outline: "none",
          }}
        />
        <Legend
          onClick={(e) => {
            let newUserCountState = {
              ...userCountState,
            };
            //@ts-ignore
            newUserCountState[e.dataKey] = !userCountState[e.dataKey];
            setUserCountState(newUserCountState);
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke={COLORS[0]}
          hide={!!userCountState.total}
        />
        <Line
          type="monotone"
          dataKey="ordered"
          stroke={COLORS[1]}
          hide={!!userCountState.ordered}
        />
        <Line
          type="monotone"
          dataKey="repeated"
          stroke={COLORS[2]}
          hide={!!userCountState.repeated}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

export default UserCount;
