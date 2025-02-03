const LineChartCustomTooltip = ({ payload, label, active }: any) => {
    if (!active) return null;

    return (
        <div
            className="recharts-default-tooltip"
            style={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                padding: 10,
            }}
        >
            <p className="recharts-tooltip-label" style={{ margin: 0 }}>
                {label}
            </p>
            {payload?.map((entry, i) => (
                <li
                    className="recharts-tooltip-item"
                    key={`tooltip-item-${i}`}
                    style={{
                        display: "block",
                        paddingTop: 4,
                        paddingBottom: 4,
                        color: entry.color || "#000",
                    }}
                >
                    <span className="recharts-tooltip-item-name">
                        <span>{entry.name.split("_")[1] || entry.name}</span>
                    </span>
                    <span className="recharts-tooltip-item-separator">: </span>
                    <span className="recharts-tooltip-item-value">
                        <span>
                            {entry.value}
                            {entry.payload[entry.name + "_order_count"] &&
                                ` (${
                                    entry.payload[entry.name + "_order_count"]
                                })`}
                        </span>
                    </span>
                    <span className="recharts-tooltip-item-unit">
                        {entry.unit || ""}
                    </span>
                </li>
            ))}
        </div>
    );
};

export default LineChartCustomTooltip;
