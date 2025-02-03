import { Box, Grid } from "@mui/material";
import React, { FC } from "react";
import { Create, DateInput, SelectInput, SimpleForm } from "react-admin";

import { useRequest } from "@/hooks";

const ReScheduledCreate =
  () =>
  (props, { qcId, handleDialogClose }) => {
    const UploadFile = ({}: { handleDialogClose: any; s_qc_id: number }) => {
      const { data: schedule } = useRequest(
        "/lab-order/api/v1/shared/schedule-times",
        {},
        { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
      );
      return (
        <div>
          <Create {...props} submitOnEnter={false} redirect="list">
            <SimpleForm>
              <Box style={{ width: "100%", padding: 10 }}>
                <Grid item lg={4}>
                  <DateInput
                    source="scheduleDate"
                    label="ScheduleDate"
                    variant="outlined"
                    fullWidth
                    alwaysOn
                  />
                </Grid>
                <Grid item lg={4}>
                  <SelectInput
                    variant="outlined"
                    label="Schedule Time"
                    source="scheduleTimeUqid"
                    choices={schedule?.map((item) => ({
                      id: item.id,
                      name: item.title.en,
                    }))}
                    fullWidth
                    alwaysOn
                  />
                </Grid>
              </Box>
            </SimpleForm>
          </Create>
        </div>
      );
    };
    return (
      <React.Fragment>
        <UploadFile s_qc_id={qcId || 0} handleDialogClose={handleDialogClose} />
      </React.Fragment>
    );
  };

export default ReScheduledCreate;
