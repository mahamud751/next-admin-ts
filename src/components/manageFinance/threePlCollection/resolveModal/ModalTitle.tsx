import {
  createTheme,
  IconButton,
  DialogTitle as MuiDialogTitle,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
type Props = {
  onClose: () => void;
};

export default function ModalTitle({ onClose }: Props) {
  const cs = useStyles();
  return (
    <MuiDialogTitle className={cs.dialogTitle}>
      <Typography variant="h5">Resolve settlement</Typography>
      <IconButton onClick={onClose} size="small">
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
}
const theme = createTheme({});
const useStyles = makeStyles(() => ({
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
