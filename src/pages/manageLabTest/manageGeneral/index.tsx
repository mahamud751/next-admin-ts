import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { BooleanInput, Confirm, SimpleForm, Title } from "react-admin";
import { useState } from "react";
import { makeStyles } from "@mui/styles";

import { useRequest } from "@/hooks";

const General = () => {
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState("");
  const [sampleCollectionFee, setSampleCollectionFee] = useState("");
  const [maxExternalMaterCost, setmaterialFee] = useState("");
  const [partnerCollectionConveyance, setPartnerCollectionConveyance] =
    useState("");
  const [isDeliveryFeeEnable, setIsDeliveryFeeEnable] = useState(true);
  const [isSampleCollectionFeeEnable, setIsSampleCollectionFeeEnable] =
    useState(true);
  const [
    isPartnerCollectionConveyanceEnabled,
    setIsPartnerCollectionConveyanceEnabled,
  ] = useState(true);
  const [requestBody, setRequestBody] = useState<any>({});
  const { data } = useRequest(
    "/misc/api/v1/admin/lab-setting",
    {
      method: "GET",
    },
    {
      isPreFetching: true,
      onSuccess: (json) => {
        setDeliveryFee(json.data.hardCopyConveyance);
        setSampleCollectionFee(json.data.collectionConveyance);
        setmaterialFee(json.data.maxExternalMaterCost);
        setPartnerCollectionConveyance(json.data.partnerCollectionConveyance);
      },
      isSuccessNotify: false,
    }
  );
  const handleIsDeliveryFeeEnable = (value) => {
    if (!value) {
      setIsDeliveryFeeEnable(false);
    } else {
      setIsDeliveryFeeEnable(true);
    }
  };
  const handleIsSampleCollectionFeeEnable = (value) => {
    if (!value) {
      setIsSampleCollectionFeeEnable(false);
    } else {
      setIsSampleCollectionFeeEnable(true);
    }
  };
  const handleIsPartnerCollectionConveyance = (value) => {
    if (!value) {
      setIsPartnerCollectionConveyanceEnabled(false);
    } else {
      setIsPartnerCollectionConveyanceEnabled(true);
    }
  };
  const { isLoading, refetch: handleSubmit } = useRequest(
    `/misc/api/v1/admin/lab-setting`,
    {
      method: "PUT",
      body: requestBody,
    },
    {
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );
  return (
    <Box m={4}>
      <Title title="List of Lab Settings" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper>
            <Box className={classes.box}>
              <SimpleForm toolbar={null}>
                <>
                  {" "}
                  <Typography color="primary" variant="subtitle1">
                    Hard Copy Conveyance
                  </Typography>
                  <div className={classes.flex}>
                    <TextField
                      type="number"
                      label="Enter hard copy conveyance"
                      variant="outlined"
                      size="small"
                      value={parseFloat(deliveryFee)}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      className={classes.title}
                    />
                    <BooleanInput
                      label={false}
                      source="isHardCopyConveyanceEnabled"
                      onChange={handleIsDeliveryFeeEnable}
                      defaultValue={data?.isHardCopyConveyanceEnabled}
                      className={classes.divide}
                    />
                  </div>
                </>
                <Box className={classes.buttonPosition}>
                  <Button
                    color="primary"
                    disabled={deliveryFee?.length <= 0}
                    variant="contained"
                    onClick={() => {
                      setRequestBody({
                        hardCopyConveyance: deliveryFee,
                        isHardCopyConveyanceEnabled: isDeliveryFeeEnable,
                      });
                      setIsDialogOpen(true);
                    }}
                    className={classes.update}
                  >
                    Update
                  </Button>
                </Box>
              </SimpleForm>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Box className={classes.box}>
              <SimpleForm toolbar={null}>
                <>
                  <Typography color="primary" variant="subtitle1">
                    Sample Collection Conveyance
                  </Typography>
                  <div className={classes.flex}>
                    <TextField
                      type="number"
                      label="Enter sample collection conveyance"
                      variant="outlined"
                      size="small"
                      value={parseFloat(sampleCollectionFee)}
                      onChange={(e) => setSampleCollectionFee(e.target.value)}
                      className={classes.title}
                    />
                    <BooleanInput
                      label={false}
                      source="isCollectionConveyanceEnabled"
                      onChange={handleIsSampleCollectionFeeEnable}
                      defaultValue={data?.isCollectionConveyanceEnabled}
                      className={classes.divide}
                    />
                  </div>
                </>
                <Box className={classes.buttonPosition}>
                  <Button
                    color="primary"
                    disabled={sampleCollectionFee?.length <= 0}
                    variant="contained"
                    onClick={() => {
                      setRequestBody({
                        collectionConveyance: sampleCollectionFee,
                        isCollectionConveyanceEnabled:
                          isSampleCollectionFeeEnable,
                      });
                      setIsDialogOpen(true);
                    }}
                    className={classes.update}
                  >
                    Update
                  </Button>
                </Box>
              </SimpleForm>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Box className={classes.box}>
              <SimpleForm toolbar={null}>
                <Typography color="primary" variant="subtitle1">
                  Max External Material Charge
                </Typography>
                <TextField
                  type="number"
                  label="Enter max external material charge"
                  variant="outlined"
                  size="small"
                  value={parseFloat(maxExternalMaterCost)}
                  onChange={(e) => setmaterialFee(e.target.value)}
                  className={classes.title}
                />

                <Box className={classes.buttonPosition}>
                  <Button
                    color="primary"
                    disabled={maxExternalMaterCost?.length <= 0}
                    variant="contained"
                    onClick={() => {
                      setRequestBody({
                        maxExternalMaterCost,
                      });
                      setIsDialogOpen(true);
                    }}
                    style={{ width: 200, marginTop: 20 }}
                  >
                    Update
                  </Button>
                </Box>
              </SimpleForm>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Box className={classes.box}>
              <SimpleForm toolbar={null}>
                <>
                  <Typography color="primary" variant="subtitle1">
                    Sample Collection Conveyance{" "}
                    <span className={classes.partner}>(Partner)</span>
                  </Typography>
                  <div className={classes.flex}>
                    <TextField
                      type="number"
                      label="Enter partner collection conveyance"
                      variant="outlined"
                      size="small"
                      value={parseFloat(partnerCollectionConveyance)}
                      onChange={(e) =>
                        setPartnerCollectionConveyance(e.target.value)
                      }
                      className={classes.title}
                    />
                    <BooleanInput
                      label={false}
                      source="isPartnerCollectionConveyanceEnabled"
                      onChange={handleIsPartnerCollectionConveyance}
                      defaultValue={data?.isPartnerCollectionConveyanceEnabled}
                      className={classes.divide}
                    />
                  </div>
                </>
                <Box className={classes.buttonPosition}>
                  <Button
                    color="primary"
                    disabled={partnerCollectionConveyance?.length <= 0}
                    variant="contained"
                    onClick={() => {
                      setRequestBody({
                        partnerCollectionConveyance,
                        isPartnerCollectionConveyanceEnabled:
                          isPartnerCollectionConveyanceEnabled,
                      });
                      setIsDialogOpen(true);
                    }}
                    className={classes.update}
                  >
                    Update
                  </Button>
                </Box>
              </SimpleForm>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Confirm
        isOpen={isDialogOpen}
        loading={isLoading}
        title={`Are you sure you want to  this Update`}
        content={false}
        onConfirm={handleSubmit}
        onClose={() => setIsDialogOpen(false)}
      />
    </Box>
  );
};

export default General;

const useStyles = makeStyles({
  box: {
    padding: 20,
  },
  flex: {
    display: "flex",
  },
  title: {
    width: "100%",
    marginTop: 20,
  },
  divide: {
    marginTop: 20,
    marginLeft: 20,
  },
  buttonPosition: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  partner: {
    color: "red",
  },
  update: {
    width: 200,
  },
});
