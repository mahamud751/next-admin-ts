import { Link } from "@mui/material";
import { FC } from "react";

import { isArray, isEmpty } from "@/utils/helpers";

type TrackingProps = {
  data: {
    src: string;
    title: string;
  }[];
};

const Tracking: FC<TrackingProps> = ({ data = [] }) => {
  if (isEmpty(data)) return;

  const formattedData = isArray(data) ? data : [data];

  return formattedData?.map((item, i) => (
    <Link
      key={i}
      href={item?.src}
      target="_blank"
      rel="noopener"
      style={{ marginRight: 10 }}
    >
      {item?.title}
    </Link>
  ));
};

export default Tracking;
