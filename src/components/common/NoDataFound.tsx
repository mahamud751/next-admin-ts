import { FC } from "react";

type NoDataFoundProps = {
  message?: string;
};

const NoDataFound: FC<NoDataFoundProps> = ({ message = "No data found!" }) => (
  <div
    style={{
      textAlign: "center",
    }}
  >
    <h4>{message}</h4>
  </div>
);

export default NoDataFound;
