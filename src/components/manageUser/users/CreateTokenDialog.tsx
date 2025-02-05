import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { FC } from "react";
import { useNotify } from "react-admin";

import { useClipboard } from "@/hooks";
import { isEmpty } from "@/utils/helpers";

type Data = {
  api_key: string;
  token_key: string;
  total_keys: number;
};

type CreateTokenDialogProps = {
  open: boolean;
  handleClose: () => void;
  data: Data;
};

const CreateTokenDialog: FC<CreateTokenDialogProps> = ({
  open,
  handleClose,
  data,
}) => {
  const notify = useNotify();
  const clipboard = useClipboard();

  const copyToClipboard = (apiKey) => {
    if (!apiKey) return;

    clipboard.copy(apiKey);
    notify("Copied to clipboard!", { type: "success" });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          <Typography>Copy API Key</Typography>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard(data?.api_key)}
          >
            <FileCopyOutlinedIcon />
          </div>
        </Box>
      </DialogTitle>
      {!isEmpty(data) && (
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>API Key</TableCell>
                <TableCell>Token Key</TableCell>
                <TableCell>Total Keys</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell
                style={{
                  width: 500,
                  wordBreak: "break-all",
                }}
              >
                {data?.api_key}
              </TableCell>
              <TableCell
                style={{
                  width: 300,
                  wordBreak: "break-all",
                }}
              >
                {data?.token_key}
              </TableCell>
              <TableCell>{data?.total_keys}</TableCell>
            </TableBody>
          </Table>
        </DialogContent>
      )}
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTokenDialog;
