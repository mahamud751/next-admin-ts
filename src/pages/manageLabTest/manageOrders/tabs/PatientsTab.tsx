import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEditContext } from "react-admin";

import { useRequest } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import AssignTestModal from "@/components/manageLabTest/order/AssignTestModal";
import PatientModal from "@/components/manageLabTest/order/PatientModal";
import TestModal from "@/components/manageLabTest/order/TestModal";
import ReportShow from "@/components/manageLabTest/order/ReportShow";

const PatientsTab = () => {
  const { record } = useEditContext();
  const classes = useStyles();
  const { data: Order, refetch } = useRequest(
    `/lab-order/api/v1/admin/orders/${record.id}/patients`,
    {},
    {
      isPreFetching: true,
      refreshDeps: [record.id],
      isSuccessNotify: false,
    }
  );
  return (
    <div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "10px 0px",
              width: "25%",
            }}
          >
            <Typography variant="h6">
              Item Left: {record?.remainItemCount}
            </Typography>
            <Typography variant="h6">
              Patient Count Left: {record?.remainPatientCount}
            </Typography>
          </div>
        </div>
        {Order?.length === 0 ? (
          <Grid
            style={{
              borderBottom: "1px solid #E0E0E0",
              paddingTop: 20,
              paddingBottom: 20,
            }}
            container
            spacing={1}
          >
            <Grid alignItems="center" item md={2} container>
              <Typography variant="body2" color="textSecondary">
                No Record Found
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <>
            {Order?.map((row) => (
              <Card className={classes.root} key={row.id}>
                <CardContent style={{ padding: 0 }}>
                  <div className={classes.cartDetails}>
                    <Grid container spacing={1}>
                      <Grid alignItems="center" item md={2} container>
                        <Box marginLeft={2}>
                          <Typography variant="body2" color="textSecondary">
                            Patient Name
                          </Typography>
                          <Typography variant="body1">{row.name}</Typography>
                        </Box>
                      </Grid>
                      <Grid alignItems="center" item md={2} container>
                        <Box marginLeft={2}>
                          <Typography variant="body2" color="textSecondary">
                            Gender
                          </Typography>
                          <Typography variant="body1">
                            {capitalizeFirstLetterOfEachWord(row?.gender)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid alignItems="center" item md={2} container>
                        <Box marginLeft={2}>
                          <Typography variant="body2" color="textSecondary">
                            Age
                          </Typography>

                          <Typography variant="body1">{row?.age} </Typography>
                        </Box>
                      </Grid>

                      <Grid alignItems="center" item md={2} container>
                        <Box marginLeft={2}>
                          <Typography variant="body2" color="textSecondary">
                            Weight
                          </Typography>

                          <Typography variant="body1">
                            {row?.weight}{" "}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid alignItems="center" item md={1} container>
                        <Box marginLeft={2}>
                          <Typography variant="body2" color="textSecondary">
                            Relation
                          </Typography>
                          <Typography variant="body1">
                            {capitalizeFirstLetterOfEachWord(row?.relation)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid alignItems="center" item md={1} container>
                        <Box marginLeft={2}>
                          <Typography variant="body2" color="textSecondary">
                            Tests Selected
                          </Typography>

                          <Typography variant="body1">
                            {row?.testCount}{" "}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid alignItems="center" item md={2} container>
                        <div style={{ display: "flex" }}>
                          <TestModal
                            record={record}
                            refetch={refetch}
                            row={row}
                          />
                          <AssignTestModal
                            record={record}
                            refetch={refetch}
                            row={row}
                          />
                          <ReportShow row={row} />
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
        <PatientModal record={record} Order={Order} refetch={refetch} />
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  flex: {
    display: "flex",
    justifyContent: "end",
    width: "100%",
  },
  root: {
    maxWidth: "100%",
    marginBottom: 20,
  },
  cartDetails: {
    border: "1px solid #EAEBEC",
    padding: "2px 15px",
    background: "var(--grey-grey-100, #F5F5F5)",
  },
}));
export default PatientsTab;
