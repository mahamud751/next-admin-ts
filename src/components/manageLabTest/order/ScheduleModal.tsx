import { Box, Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import {
  DateInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  Toolbar,
} from "react-admin";

import { useRequest } from "@/hooks";
import ClearBtn from "../Button/ClearBtn";

const ScheduleModal = ({ qcId, handleDialogClose2, orderRefetch, data }) => {
  const classes = useStyles();
  const UploadFile2 = ({
    handleDialogClose2,
  }: {
    handleDialogClose2: any;
    id: number;
  }) => {
    const { data: schedule } = useRequest(
      "/lab-order/api/v1/shared/schedule-times",
      {},
      { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
    );
    const mainScheduleTimeId = schedule?.find(
      (pd) => pd?.title?.en === data?.scheduleTimeRange?.en
    );
    const [scheduleDate, setScheduleDate] = useState(data?.scheduleStartAt);
    const [scheduleTime, setScheduleTime] = useState(mainScheduleTimeId?.id);
    const { refetch: onSave } = useRequest(
      `/lab-order/api/v1/admin/orders/${data?.id}/rescheduling`,
      {
        method: "PUT",
        body: {
          scheduleDate: scheduleDate,
          scheduleTimeUqid: scheduleTime || mainScheduleTimeId?.id,
        },
      },
      {
        onSuccess: () => {
          orderRefetch();
          handleDialogClose2();
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
          onClick={handleDialogClose2}
        >
          Cancel
        </Button>{" "}
        <SaveButton style={{ width: 120 }} label="Confirm" />
      </Toolbar>
    );
    return (
      <SimpleForm save={onSave} toolbar={<CustomToolbar />}>
        <Box style={{ width: "100%", padding: 10 }}>
          <ClearBtn handleCloseDialog={handleDialogClose2} />
          <Grid item lg={12}>
            <DateInput
              source="scheduleDate"
              label="ScheduleDate"
              variant="outlined"
              alwaysOn
              fullWidth
              defaultValue={data?.scheduleStartAt}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </Grid>
          <Grid item lg={12}>
            <SelectInput
              variant="outlined"
              label="Schedule Time"
              source="scheduleTimeUqid"
              fullWidth
              alwaysOn
              choices={schedule?.map((item) => ({
                id: item.id,
                name: item.title.en,
              }))}
              onChange={(e) => setScheduleTime(e.target.value)}
              defaultValue={mainScheduleTimeId?.id}
            />
          </Grid>
        </Box>
      </SimpleForm>
    );
  };
  return (
    <div>
      {" "}
      <UploadFile2 id={qcId || 0} handleDialogClose2={handleDialogClose2} />
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

export default ScheduleModal;
