import { Card, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type PieChartComponentProps = {
  cardTitle: string;
  data: object[];
  renderCustomizedLabel: FC<any>;
  COLORS: string[];
  CustomTooltip: FC<any>;
  classes: any;
};

const PieChartComponent: FC<PieChartComponentProps> = ({
  cardTitle,
  data,
  renderCustomizedLabel,
  COLORS,
  CustomTooltip,
  classes,
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{cardTitle}</Typography>
    </CardContent>
    <ResponsiveContainer height={300}>
      <PieChart width={500} height={500}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          isAnimationActive={false}
          //@ts-ignore
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="label"
        >
          {!!data?.length &&
            data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip classes={classes} />}
          wrapperStyle={{
            outline: "none",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

export default PieChartComponent;
