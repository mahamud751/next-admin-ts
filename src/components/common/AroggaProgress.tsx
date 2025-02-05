import { FC } from "react";
import { LinearProgress } from "react-admin";

type AroggaProgressProps = {
  position?: "relative" | "absolute" | "fixed" | "static" | "sticky";
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  transform?: string;
};

const AroggaProgress: FC<AroggaProgressProps> = ({
  position = "absolute",
  top = "50%",
  left = "50%",
  transform = "translate(-50%, -50%)",
  ...style
}) => (
  <div
    style={{
      position,
      top,
      left,
      transform,
      ...style,
    }}
  >
    <LinearProgress />
  </div>
);

export default AroggaProgress;
