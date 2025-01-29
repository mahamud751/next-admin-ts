import { Button } from "@mui/material";
import { SaveButton, SimpleForm, Toolbar } from "react-admin";
import { makeStyles } from "@mui/styles";

import { Check2Icon } from "@/components/icons";
import { useRequest } from "@/hooks";

const CustomForm = ({ body, handleDialogClose, onSuccess, s_qc_id }: any) => {
  const classes = useStyle();
  const { refetch: handleDoneAction } = useRequest(
    `/lab-order/api/v1/admin/coverages/${s_qc_id}`,
    {
      method: "PUT",
      body: body,
    },
    {
      onSuccess: () => {
        handleDialogClose();
        onSuccess();
      },
    }
  );
  const CustomToolbar = (props: any) => (
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
    <SimpleForm save={handleDoneAction} toolbar={<CustomToolbar />}>
      <div className={classes.updateBox}>
        <div>
          <Check2Icon />
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "none" }}></div>
            <div className="name">
              <strong>Are you sure want to Update ? </strong>
            </div>
          </div>
        </div>
      </div>
    </SimpleForm>
  );
};
const useStyle = makeStyles(() => ({
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
}));
export default CustomForm;
