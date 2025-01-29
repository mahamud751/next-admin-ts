import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { CSSProperties, FC } from "react";
import { Labeled } from "react-admin";

type CustomFieldProps = {
  label: string;
  value: string | number;
  className?: string;
  style?: CSSProperties;
};

const CustomField: FC<CustomFieldProps> = ({
  label,
  value,
  className,
  style,
}) => {
  const classes = useStyles();

  const Wrapper = ({ children }) => (
    <Labeled label={label}>
      <Typography
        variant="body2"
        className={`${classes.typography} ${className}`}
        style={style}
      >
        {children}
      </Typography>
    </Labeled>
  );

  if (typeof value === "string" && value?.includes("\n")) {
    const splitedValues = value.split("\n")?.filter(Boolean);

    return (
      <Wrapper>
        {splitedValues.map((splitedValue, index) => (
          <span key={index}>
            {splitedValue}
            <br />
          </span>
        ))}
      </Wrapper>
    );
  }

  return <Wrapper>{value}</Wrapper>;
};

export default CustomField;

const useStyles = makeStyles({
  typography: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: "1.1876em",
    letterSpacing: "0.00938em",
  },
});
