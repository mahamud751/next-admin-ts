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
    data: object[];
    renderCustomizedLabel: FC<any>;
    COLORS: string[];
    CustomTooltip: FC<any>;
    classes: any;
};

const PieChartComponent: FC<PieChartComponentProps> = ({
    data,
    renderCustomizedLabel,
    COLORS,
    CustomTooltip,
    classes,
}) => (
    <ResponsiveContainer height={300}>
        <PieChart width={500} height={500}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                isAnimationActive={false}
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
);

export default PieChartComponent;
