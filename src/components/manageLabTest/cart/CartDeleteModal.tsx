import { Button, Theme, createStyles } from "@mui/material";
import { SaveButton, SimpleForm, Toolbar, useRefresh } from "react-admin";

import { useRequest } from "../../../hooks";
import { Check2Icon } from "../../icons";
import { makeStyles } from "@mui/styles";

const CartDeleteModal = ({ handleCloseDialog, qcId }) => {
  const classes = useStyles();
  const refresh = useRefresh();
  const UploadFile = ({
    id,
    handleDialogClose,
  }: {
    handleDialogClose: any;
    id: number;
  }) => {
    const { refetch: handleRemoveAction } = useRequest(
      `/lab-cart/api/v2/admin/carts/${id}`,
      {
        method: "DELETE",
      },
      {
        onSuccess: () => {
          refresh();
          handleDialogClose();
        },
      }
    );
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
        <Button
          variant="contained"
          disableElevation
          className={classes.buttonCancel}
          onClick={handleDialogClose}
        >
          Cancel
        </Button>{" "}
        <SaveButton style={{ width: 120 }} label="Confirm" />
      </Toolbar>
    );
    return (
      <SimpleForm save={handleRemoveAction} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />
            <p style={{ fontWeight: "bold" }}>
              Do you want to remove this cart ?
            </p>
          </div>
        </div>
      </SimpleForm>
    );
  };
  return (
    <div>
      <UploadFile id={qcId || 0} handleDialogClose={handleCloseDialog} />
    </div>
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonCancel: {
      backgroundColor: "red",
      marginRight: 10,
      width: 120,
    },
    updateBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      width: "250px",
    },
  })
);

export default CartDeleteModal;
