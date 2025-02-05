import { FC, useEffect } from "react";
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

import "../../../assets/style.css";
import LineChartCustomTooltip from "./LineChartCustomTooltip";

type LineChartComponentProps = {
    from?: "";
    hideState: object;
    setHideState: (hideState: object) => void;
    chartData: any;
    lineData: any;
    COLORS: string[];
};

const LineChartComponent: FC<LineChartComponentProps> = ({
    from,
    hideState,
    setHideState,
    chartData,
    lineData,
    COLORS,
}) => {
    const userSum = {};

    chartData?.map((item) => {
        Object.keys(item).map((key) => {
            if (!key.includes("_attendance_count") && key !== "date") {
                userSum[key] = userSum[key]
                    ? userSum[key] + item[key]
                    : item[key];
            }
            return key;
        });

        return item;
    });

    const shortByUser = Object.keys(userSum).sort(
        (a, b) => userSum[b] - userSum[a]
    );

    const isFrom = false;
    useEffect(() => {
        if (!from) return;

        const hideState = lineData?.reduce((prev, current) => {
            if (isFrom) {
                if (shortByUser.slice(0, 11).indexOf(current) === -1) {
                    prev[current] = true;
                    return prev;
                }
                if (current === "total") {
                    prev[current] = true;
                    return prev;
                }
                return prev;
            }
            prev[current] = false;
            return prev;
        }, {});
        setHideState(hideState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lineData]);

    if (isFrom) {
        chartData?.filter((item) => {
            lineData.map((line) => {
                if (item[line] === undefined) {
                    item[line] = 0;
                    return item;
                }
                return item;
            });
            return item;
        });
    }

    return (
        <ResponsiveContainer height={lineData?.length > 20 ? 400 : 300}>
            <LineChart
                data={chartData || []}
                margin={{ left: 35, right: 35, top: 5, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                    content={isFrom ? <LineChartCustomTooltip /> : null}
                    wrapperStyle={{
                        height: "300px",
                        outline: "none",
                        pointerEvents: "auto",
                        overflow: "auto",
                    }}
                />
                {isFrom ? (
                    <Legend
                        wrapperStyle={{
                            height: "60px",
                            overflow: "auto",
                            ...(lineData?.length > 20 && { height: "100px" }),
                        }}
                        formatter={(value) => (
                            <span className="recharts-legend-item-text">
                                {value.split("_")[1] || "Total"} (
                                {userSum[value]})
                            </span>
                        )}
                        onClick={(e) => {
                            let newHideState = { ...hideState };
                            newHideState[e.dataKey] = !hideState[e.dataKey];
                            setHideState(newHideState);
                        }}
                    />
                ) : (
                    <Legend
                        onClick={(e) => {
                            let newHideState = { ...hideState };
                            newHideState[e.dataKey] = !hideState[e.dataKey];
                            setHideState(newHideState);
                        }}
                    />
                )}
                {!!shortByUser?.length &&
                    shortByUser.map((item, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={item}
                            xlinkShow="new"
                            stroke={COLORS[index % COLORS.length]}
                            hide={!!hideState?.[item]}
                        />
                    ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent;
