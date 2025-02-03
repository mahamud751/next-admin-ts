import { Box, Button, CircularProgress } from "@mui/material";
import { FC } from "react";

type LoaderOrButtonProps = {
  label: string;
  isLoading?: boolean;
  isLoadingLabel?: boolean;
  onClick: () => void;
  disabled?: boolean;
  loaderSize?: number;
  btnStyle?: any;
  btnVariant?: "contained" | "outlined" | "text" | string;
  btnColor?: "inherit" | "primary" | "secondary" | "default";
  [key: string]: any;
};

const LoaderOrButton: FC<LoaderOrButtonProps> = ({
  label = "Button",
  isLoading = false,
  isLoadingLabel = false,
  onClick = () => {},
  disabled = false,
  loaderSize = 20,
  btnStyle,
  btnVariant = "contained",
  btnColor = "primary",
  ...wrapperStyle
}) => {
  if (isLoading)
    return (
      <Box {...wrapperStyle}>
        <CircularProgress size={loaderSize} />
      </Box>
    );

  return (
    <Box {...wrapperStyle}>
      <Button
        // @ts-ignore
        variant={btnVariant}
        color={btnColor}
        className={btnStyle}
        loading={isLoading ? isLoading : undefined}
        onClick={onClick}
        disabled={disabled}
        disableElevation
      >
        {isLoadingLabel ? (
          <CircularProgress size={loaderSize} color="inherit" />
        ) : (
          label
        )}
      </Button>
    </Box>
  );
};

export default LoaderOrButton;
