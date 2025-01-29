import { makeStyles } from "@mui/styles";
import { CSSProperties, FC, useState } from "react";

type AroggaButtonProps = {
  label: string;
  type?: "primary" | "secondary" | "success" | "danger";
  disabled?: boolean;
  style?: CSSProperties;
  onClick: () => void;
};

const ButtonStyle = {
  primary: {
    default: {
      background: "#A7B1C4",
      border: "1px solid #8F98A8",
      color: "#FFFFFF",
      cursor: "pointer",
    },
    hover: {
      background: "#8F98A8",
      border: "1px solid #8F98A8",
      color: "#FFFFFF",
    },
    disabled: {
      background: "#CCCCCC",
      border: "1px solid #AAAAAA",
      color: "#666666",
      cursor: "not-allowed",
    },
  },
  secondary: {
    default: {
      background: "#F2F2F2",
      border: "1px solid #BDBDBD",
      color: "#4F4F4F",
      cursor: "pointer",
    },
    hover: {
      background: "#BDBDBD",
      border: "1px solid #BDBDBD",
      color: "#4F4F4F",
    },
    disabled: {
      background: "#DDDDDD",
      border: "1px solid #BBBBBB",
      color: "#888888",
      cursor: "not-allowed",
    },
  },
  success: {
    default: {
      background: "#DCFAF2",
      color: "#008069",
      border: "1px solid #3ECBA5",
      cursor: "pointer",
    },
    hover: {
      background: "#3ECBA5",
      color: "#FFFFFF",
      border: "1px solid #3ECBA5",
    },
    disabled: {
      background: "#DDDDDD",
      border: "1px solid #BBBBBB",
      color: "#888888",
      cursor: "not-allowed",
    },
  },
  danger: {
    default: {
      background: "#FFDEE9",
      color: "#EF1962",
      border: "1px solid #EF1962",
      cursor: "pointer",
    },
    hover: {
      background: "#EF1962",
      color: "#FFFFFF",
      border: "1px solid #EF1962",
    },
    disabled: {
      background: "#DDDDDD",
      border: "1px solid #BBBBBB",
      color: "#888888",
      cursor: "not-allowed",
    },
  },
};

const AroggaButton: FC<AroggaButtonProps> = ({
  label = "Button",
  type = "primary",
  disabled = false,
  style,
  onClick,
}) => {
  const classes = useStyles();
  const [isHover, setIsHover] = useState(false);

  return (
    <input
      type="button"
      value={label}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={disabled ? undefined : onClick}
      className={classes.button}
      style={{
        ...ButtonStyle[type].default,
        ...(isHover && !disabled ? ButtonStyle[type].hover : {}),
        ...(disabled ? ButtonStyle[type].disabled : {}),
        ...style,
      }}
      disabled={disabled}
    />
  );
};

const useStyles = makeStyles(() => ({
  button: {
    padding: "5px 10px",
    borderRadius: 4,
    fontSize: 16,
  },
}));

export default AroggaButton;
