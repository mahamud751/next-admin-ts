import { Box } from "@mui/material";
import { DeleteButton, SaveButton, Toolbar } from "react-admin";

type SaveDeleteToolbarProps = {
  isSave: boolean;
  isSaveDisabled?: boolean;
  isDelete?: boolean;
  [key: string]: any;
};

const SaveDeleteToolbar = ({
  isSave = false,
  isSaveDisabled = false,
  isDelete = false,
  ...rest
}: SaveDeleteToolbarProps) => (
  <Toolbar {...rest}>
    {isSave && (
      <SaveButton
        //@ts-ignore
        redirect="list"
        submitOnEnter={false}
        disabled={isSaveDisabled}
      />
    )}
    {isDelete && (
      <Box display="flex" justifyContent="flex-end" width="100%">
        <DeleteButton {...rest} />
      </Box>
    )}
  </Toolbar>
);

export default SaveDeleteToolbar;
