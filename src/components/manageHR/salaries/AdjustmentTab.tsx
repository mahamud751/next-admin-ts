import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FC, useState } from "react";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";

import AdjustmentDialog from "./AdjustmentDialog";
import NoDataFound from "@/components/common/NoDataFound";

type AdjustmentTabProps = {
  page?: "edit";
  [key: string]: any;
};

const AdjustmentTab: FC<AdjustmentTabProps> = ({ page, ...rest }) => {
  const { values } = useWatch();

  const [action, setAction] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { data, refetch: refetchSalaryAdjustment } = useRequest(
    `/v1/salaryAdjustment?_sa_s_id=${rest.record?.s_id}`,
    {},
    { isPreFetching: true, isWarningNotify: false }
  );

  const handleAction = (action, item) => {
    setAction(action);
    setSelectedItem(item);
    setIsOpenDialog(true);
  };

  const handleDialogClose = () => {
    setIsOpenDialog(false);
    values.sa_amount = undefined;
    values.sa_type = undefined;
    values.sa_reason = undefined;
  };

  if (!data?.length)
    return <NoDataFound message="No salary adjustment data found!" />;

  return (
    <div
      style={
        page === "edit"
          ? { marginTop: 20, marginBottom: 28 }
          : { marginBottom: 10 }
      }
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Reason</TableCell>
              {page === "edit" && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.sa_id}>
                <TableCell>{item.sa_id}</TableCell>
                <TableCell>{item.sa_created_at}</TableCell>
                <TableCell>{item.sa_amount}</TableCell>
                <TableCell>{item.sa_type}</TableCell>
                <TableCell>{item.sa_reason}</TableCell>
                {page === "edit" && (
                  <TableCell>
                    <Button onClick={() => handleAction("update", item)}>
                      <EditIcon />
                    </Button>
                    <Button onClick={() => handleAction("delete", item)}>
                      <HighlightOffIcon />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AdjustmentDialog
        action={action}
        selectedItem={selectedItem}
        open={isOpenDialog}
        handleDialogClose={handleDialogClose}
        refetchSalaryAdjustment={refetchSalaryAdjustment}
      />
    </div>
  );
};

export default AdjustmentTab;
