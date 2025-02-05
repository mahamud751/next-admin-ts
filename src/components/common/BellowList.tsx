import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FC, useEffect, useState } from "react";
import { Confirm } from "react-admin";
import { useRequest } from "@/hooks";

type BellowListProps = {
  total?: number;
  context: string;
};

const BellowList: FC<BellowListProps> = ({ total, context }) => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);

  const {
    data,
    isLoading: isLoading1,
    isSuccess,
    refetch: handleRefresh,
  } = useRequest(
    context === "Ledger" ? "/v1/ledger/balance/" : "/v1/inventory/balance/"
  );

  const { isLoading: isLoading2, refetch: handleSyncMedicines } = useRequest(
    "/v1/purchases/sync/",
    {
      method: "POST",
    },
    {
      isRefresh: true,
      successNotify: "Successfully sync",
      onSuccess: () => setDialogOpen(false),
    }
  );

  useEffect(() => {
    if (("Ledger" === context || "Inventory" === context) && !!data) {
      setTotalBalance(data.totalBalance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  if (!total) return null;

  return (
    <Paper className={classes.paper}>
      <Table className={classes.div}>
        <TableBody>
          {"Ledger" === context && (
            <TableRow>
              <TableCell>Balance:</TableCell>
              <TableCell>{totalBalance}</TableCell>
            </TableRow>
          )}
          {"Inventory" === context && (
            <TableRow>
              <TableCell>Total Price:</TableCell>
              <TableCell>{totalBalance}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className={classes.groupBtn}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleRefresh}
          style={{
            textTransform: "none",
            margin: "5px",
          }}
          disabled={isLoading1}
        >
          {isLoading1 ? (
            <CircularProgress size={25} thickness={2} />
          ) : (
            "Refresh"
          )}
        </Button>
        <Confirm
          title="Sync Medicines"
          content="Are you sure you want to sync inventory medicines?"
          isOpen={dialogOpen}
          loading={isLoading2}
          onConfirm={() => handleSyncMedicines()}
          onClose={() => setDialogOpen(false)}
        />
      </div>
    </Paper>
  );
};

const useStyles = makeStyles(() => ({
  paper: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
  },
  div: {
    width: 300,
    margin: "auto",
  },
  error: {
    color: "#EF1962",
  },
  groupBtn: {
    margin: "auto",
    marginTop: "10px",
  },
}));

export default BellowList;
