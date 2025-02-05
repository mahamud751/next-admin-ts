import { DateTime } from "luxon";

import { useAroggaStyles } from "@/utils/useAroggaStyles";

// TODO: Make this a reusable component for all duration fields
const DurationField = (props) => {
  const classes = useAroggaStyles();

  const { s_status, s_delivered_at, s_created_at } = props?.record || {};

  if (!["pending", "closed", "delivering", "delivered"].includes(s_status))
    return null;

  const date =
    s_status === "delivered"
      ? DateTime.fromSQL(s_delivered_at)
      : DateTime.local();

  const diff = date
    .diff(DateTime.fromSQL(s_created_at), ["days", "hours", "minutes"])
    .toObject();

  if (!diff.days && !diff.hours) return null;

  return (
    <span className={diff.days >= 1 ? classes.textRed : ""}>
      {diff.days}d-{diff.hours}h
    </span>
  );
};

export default DurationField;

DurationField.defaultProps = { label: "Duration" };
