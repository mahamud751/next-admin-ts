import { Box, Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { NumberInput, SaveButton, SimpleForm, Toolbar } from "react-admin";

import { useRequest } from "../../../hooks";
import ClearBtn from "../Button/ClearBtn";

const DuePayModal = ({ text, handleDialogClose3, orderRefetch, data }) => {
  const classes = useStyles();
  const [amount, setAmount] = useState(text);

  const { refetch: onSave } = useRequest(
    `/lab-order/api/v1/admin/orders/${data?.id}/cod-collection`,
    {
      method: "PUT",
      body: {
        codAmount: amount,
      },
    },
    {
      onSuccess: () => {
        orderRefetch();
        handleDialogClose3();
      },
    }
  );
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      {/* @ts-ignore */}
      <Button
        variant="contained"
        disableElevation
        className={classes.buttonCancel}
        onClick={handleDialogClose3}
      >
        Cancel
      </Button>{" "}
      <SaveButton style={{ width: 120 }} label="Confirm" />
    </Toolbar>
  );

  return (
    <div>
      <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar />}>
        <Box style={{ width: "100%", padding: 10 }}>
          <ClearBtn handleCloseDialog={handleDialogClose3} />

          <Grid item lg={12}>
            <NumberInput
              source="codAmount"
              label="Amount"
              variant="outlined"
              fullWidth
              value={amount}
              defaultValue={text}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
        </Box>
      </SimpleForm>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  buttonCancel: {
    backgroundColor: "red",
    marginRight: 10,
    width: 120,
  },
}));

export default DuePayModal;
