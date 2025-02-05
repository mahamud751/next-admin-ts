import { makeStyles } from "@material-ui/core";
import { FC } from "react";

type PieChartCustomTooltipProps = {
    active: boolean;
    payload: any;
};

const PieChartCustomTooltip: FC<PieChartCustomTooltipProps> = ({
    active,
    payload,
}) => {
    const classes = useStyles();

    if (active && payload && payload.length) {
        return (
            <div className={classes.customTooltip}>
                <p
                    style={{
                        margin: 0,
                        textTransform: "capitalize",
                        fontWeight: 600,
                    }}
                >{`${payload[0].name}`}</p>
                <p style={{ margin: 0, fontWeight: 500 }}>{payload[0].value}</p>
            </div>
        );
    }

    return null;
};

const useStyles = makeStyles({
    customTooltip: {
        backgroundColor: "white",
        color: "black",
        padding: 10,
        borderRadius: 5,
    },
});

export default PieChartCustomTooltip;
