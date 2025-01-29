import { Backdrop, CircularProgress } from "@mui/material";
import { FC } from "react";

type AroggaBackdropProps = {
  isLoading: boolean;
};

const AroggaBackdrop: FC<AroggaBackdropProps> = ({ isLoading }) => (
  <Backdrop
    open={isLoading}
    style={{
      zIndex: 9,
      color: "#178069",
      height: "100vh",
      width: "100vw",
    }}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

export default AroggaBackdrop;
