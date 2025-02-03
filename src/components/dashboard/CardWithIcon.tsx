import { Box, Card, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import { FC, createElement } from "react";

import cartouche from "../../assets/images/cartouche.png";
import cartoucheDark from "../../assets/images/cartoucheDark.png";
import { toFixedNumber } from "@/utils/helpers";

type CardWithIconProps = {
  icon: FC<any>;
  text: string;
  takaSymbol: boolean;
  value?: any;
  prev_value?: any;
};

const CardWithIcon: FC<CardWithIconProps> = ({
  icon,
  text,
  takaSymbol,
  value,
  prev_value,
  ...rest
}) => {
  const classes = useStyles(rest);

  return (
    <Card>
      <div className={classes.main}>
        <Box width="2em" className="icon" mr={2}>
          {createElement(icon, { fontSize: "large" })}
        </Box>
        <Box width="100%">
          <Typography
            className={classes.title}
            align="right"
            color="textSecondary"
          >
            {text}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {value - prev_value >= 0 ? (
                <p
                  style={{
                    margin: 0,
                    color: "green",
                    display: "flex",
                    fontSize: "13px",
                  }}
                >
                  {<ArrowUpwardIcon style={{ fontSize: "17px" }} />}
                  {!!value && !!prev_value
                    ? toFixedNumber(((value - prev_value) / prev_value) * 100)
                    : "0"}
                  %
                </p>
              ) : (
                <p
                  style={{
                    margin: 0,
                    color: "#EF1962",
                    fontSize: "13px",
                    display: "flex",
                  }}
                >
                  {<ArrowDownwardIcon style={{ fontSize: "17px" }} />}
                  {!!value && !!prev_value
                    ? toFixedNumber(((value - prev_value) / prev_value) * 100)
                    : "0"}
                  %
                </p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>
                {takaSymbol && <span style={{ fontFamily: "Arial" }}>৳</span>}
                {!!value
                  ? text === "Avarage Basket Size"
                    ? toFixedNumber(value)
                    : parseInt(value)
                  : "0"}
              </h2>
              <h2 style={{ margin: 0, fontSize: 20 }}>
                {takaSymbol && !!value
                  ? text === "Avarage Basket Size"
                    ? `$${toFixedNumber(value / 85)}`
                    : `$${parseInt((value / 85)?.toString())}`
                  : ""}
              </h2>
              <p style={{ margin: 0, fontSize: 12 }}>
                {takaSymbol && <span style={{ fontFamily: "Arial" }}>৳</span>}
                {!!prev_value ? parseInt(prev_value) : "0"}
                {takaSymbol && !!prev_value
                  ? "($" + toFixedNumber(prev_value / 85) + ")"
                  : ""}
              </p>
            </div>
          </div>
        </Box>
      </div>
    </Card>
  );
};
const theme = createTheme({});
const useStyles = makeStyles(() => ({
  card: {
    minHeight: 52,
    display: "flex",
    flexDirection: "column",
    flex: "1",
    "& a": {
      textDecoration: "none",
      color: "inherit",
    },
  },
  main: () => ({
    overflow: "inherit",
    padding: "8px 16px",
    background: `url(${
      theme.palette.mode === "dark" ? cartoucheDark : cartouche
    }) no-repeat`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& .icon": {
      color: theme.palette.mode === "dark" ? "inherit" : "#dc2440",
    },
  }),
  title: {},
}));

export default CardWithIcon;
