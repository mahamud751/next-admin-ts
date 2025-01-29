import { Button } from "@mui/material";
import { SaveButton, SimpleForm, Toolbar } from "react-admin";

import { useRequest } from "@/hooks";

import { makeStyles } from "@mui/styles";
import { Check2Icon } from "@/components/icons";

const CustomCreate = ({
  body,
  handleDialogClose,
  onSuccess,
  s_qc_id,
  s_qc_id2,
  refetch,
}: any) => {
  const classes = useStyle();
  const { refetch: handleDoneAction } = useRequest(
    `/lab-order/api/v1/admin/order-patients/${s_qc_id}/reports/${s_qc_id2}`,
    {
      method: "PUT",
      body: body,
    },
    {
      onSuccess: () => {
        handleDialogClose();
        onSuccess();
        refetch();
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
export default CustomCreate;
