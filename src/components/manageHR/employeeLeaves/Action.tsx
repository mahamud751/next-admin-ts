import { Box } from "@mui/material";
import { FC } from "react";
import { Button, RaRecord as Record } from "react-admin";

type ActionProps = {
  label?: string;
  record?: Record;
  leaveDetailChangesInfo: object;
  setAction: (
    action: "pending" | "cancelled" | "rejected" | "approved"
  ) => void;
  setEmployeeLeaveId: (employeeLeaveId: number) => void;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
};

const Action: FC<ActionProps> = ({
  record: { el_status, el_id } = { el_status: "", el_id: 0 }, // Default record if not provided
  leaveDetailChangesInfo,
  setAction,
  setEmployeeLeaveId,
  setIsDialogOpen,
  label = "Action", // Default value for label
}) => {
  if (el_status === "cancelled") return null;

  if (el_status !== "pending" && el_status !== "cancelled")
    return (
      <Button
        label="Move to pending"
        variant="contained"
        color="secondary"
        onClick={(e) => {
          e.stopPropagation();
          setAction("pending");
          setEmployeeLeaveId(el_id);
          setIsDialogOpen(true);
        }}
      />
    );

  return (
    <Box display="flex">
      <Button
        label="Cancel"
        variant="contained"
        style={{
          backgroundColor: "#6c757d",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setAction("cancelled");
          setEmployeeLeaveId(el_id);
          setIsDialogOpen(true);
        }}
      />
      <Box ml={1} />
      <Button
        label="Reject"
        variant="contained"
        style={{
          backgroundColor: "#dc3545",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setAction("rejected");
          setEmployeeLeaveId(el_id);
          setIsDialogOpen(true);
        }}
      />
      <Box ml={1} />
      <Button
        label="Approve"
        variant="contained"
        style={{
          backgroundColor: "#008069",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setAction("approved");
          setEmployeeLeaveId(el_id);
          setIsDialogOpen(true);
        }}
      />
    </Box>
  );
};

export default Action;
