import { Paper } from "@mui/material";
import { FC } from "react";

const Welcome: FC = () => (
  <Paper
    elevation={3}
    style={{
      position: "relative",
      width: "50%",
      height: "50%",
      margin: "auto",
      borderRadius: ".75rem",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <h4 style={{ color: "#1e2022" }}>Welcome to Arogga</h4>
      <p>We're happy to see you in our community.</p>
    </div>
  </Paper>
);

export default Welcome;
