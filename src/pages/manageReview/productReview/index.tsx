// import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from "react-router-dom";
import ReviewContent from "./ReviewContent";
import { useDocumentTitle } from "../../../hooks";
import { useState } from "react";
import { FaCircle } from "react-icons/fa";

type Props = {};

export default function ProductReview({}: Props) {
  useDocumentTitle("Arogga | Product Review");
  const { reviewStatusType } = useParams() as any;
  const [pendingCount, setPendingCount] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();

  const reviewType = [
    {
      label: "Pending",
      type: "pending",
    },
    {
      label: "Approved",
      type: "approved",
    },
    {
      label: "Rejected",
      type: "rejected",
    },
    {
      label: "All",
      type: "all",
    },
  ];
  return (
    <div className={classes.root}>
      {/* Status wise button */}
      <div className={classes.typeSelectBtn}>
        {reviewType?.map((d: { label: string; type: string }) => (
          <button
            className={
              reviewStatusType === `${d?.type}`
                ? classes.typeActiveBtn
                : classes.typeBtn
            }
            onClick={() => {
              navigate(`/productReview/${d?.type}`);
            }}
          >
            {d.label}{" "}
            {d?.type === "pending" && (
              <span className={classes.batchCount}>
                <FaCircle size={8} /> {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Component Render based on statusType */}
      {reviewStatusType && (
        <ReviewContent
          reviewStatus={reviewStatusType}
          setPendingCount={setPendingCount}
        />
      )}
    </div>
  );
}
const useStyles = makeStyles(() => ({
  root: {
    marginTop: 24,
  },
  typeSelectBtn: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 16,
  },
  typeBtn: {
    padding: "10px 12px",
    borderRadius: 6,
    background: "transparent",
    color: "#667085",
  },
  typeActiveBtn: {
    background: "#F1F7F7!important",
    padding: "10px 12px",
    borderRadius: 6,
    color: "#0E7673",
    fontWeight: 600,
  },
  batchCount: {
    background: "#FFFFFF",
    border: "1px solid #D0D5DD",
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: "12px",
  },
}));
