import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { Confirm, usePermissions } from "react-admin";
import { useNavigate } from "react-router-dom";
import { useRequest } from "../../../hooks";
import { capitalizeFirstLetter } from "../../../utils/helpers";
type Props = {
  data: any;
  refresh: () => void;
};

export default function Footer({ data, refresh }: Props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [actionModal, setActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const { permissions } = usePermissions();

  const { isLoading, refetch } = useRequest(
    `/v1/productReviewAction/${data?.pr_id}/${
      actionType === "approve" ? "approveAction" : "rejectAction"
    }`,
    {
      method: "POST",
    },
    {
      onSuccess: () => {
        setActionModal(false);
        setActionType(null);
        refresh();
        if (actionType === "approve") {
          navigate("/productReview/approved");
        } else {
          navigate("/productReview/rejected");
        }
      },
    }
  );

  return (
    <>
      <div className={classes.root}>
        <div className={classes.files}>
          {data?.attachedFiles_pr_review_files?.map((d: any) => (
            <a href={d?.src} target="_blank">
              <img
                src={d?.src}
                alt={d?.title}
                width={64}
                height={64}
                className={classes.img}
              />
            </a>
          ))}
        </div>
        {window.location.pathname?.split("/")[2] === "pending" && (
          <div className={classes.actionBtn}>
            {permissions?.includes("approveProductReview") && (
              <>
                <Button
                  className={classes.rejectBtn}
                  onClick={() => {
                    setActionModal(true);
                    setActionType("reject");
                  }}
                >
                  Reject
                </Button>
                <Button
                  className={classes.approveBtn}
                  onClick={() => {
                    setActionModal(true);
                    setActionType("approve");
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Status Chip for Review */}
      {window.location.pathname?.split("/")[2] !== "pending" && (
        <div className={classes.badgeSection}>
          <Chip
            label={capitalizeFirstLetter(data?.pr_status)}
            size="small"
            style={{
              fontWeight: 600,
              padding: "4px 8px",
              color: "white",
              backgroundColor:
                data?.pr_status === "approved"
                  ? "#0BA259"
                  : data?.pr_status === "rejected"
                  ? "#FD4F4F"
                  : "#848884",
            }}
          />
        </div>
      )}

      {/* Confirm modal for approve and reject */}
      <Confirm
        isOpen={actionModal}
        loading={isLoading}
        title={actionType === "approve" ? "Approve" : "Reject"}
        content={`Are you sure you want to ${
          actionType === "approve" ? "approve" : "reject"
        } the review?`}
        onConfirm={refetch}
        onClose={() => {
          setActionModal(false);
          setActionType(null);
        }}
      />
    </>
  );
}
const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: 0,
    marginTop: 24,
  },
  files: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 10,
  },
  img: {
    border: "1px solid #EEEFF2",
    borderRadius: 6,
    objectFit: "cover",
  },
  actionBtn: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 10,
  },
  rejectBtn: {
    backgroundColor: "#FFE9E9",
    border: "none",
    borderRadius: 6,
    color: "#F72121",
    fontWeight: 600,
    width: 120,
  },
  approveBtn: {
    backgroundColor: "rgba(11, 162, 89, 0.12)",
    border: "none",
    borderRadius: 6,
    color: "rgba(4, 144, 76, 1)",
    fontWeight: 600,
    width: 120,
  },
  badgeSection: {
    marginTop: 8,
  },
}));
