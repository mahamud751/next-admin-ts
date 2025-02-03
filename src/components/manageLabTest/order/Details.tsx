import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import { FunctionField } from "react-admin";

import { useRequest } from "@/hooks";
import { getColorByStatus, getFormattedDate } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import Calender from "../../icons/Calender";
import OrderStatus from "../../icons/OrderStatus";
import CollectorAssignModal from "./CollectorAssignModal";
import DuePayModal from "./DuePayModal";
import ScheduleModal from "./ScheduleModal";
import {
  AddressIcon,
  CalenderIcon,
  CollectorIcon,
  DiscountPriceIcon,
  OrderCountIcon,
  PaymentMethodIcon,
  RegularPriceIcon,
} from "../../icons";
import ClearBtn from "../Button/ClearBtn";

const Details = ({ record }) => {
  const classes = useStyles();
  const aroggaClasses = useAroggaStyles();

  const { data: orderData, refetch: orderRefetch } = useRequest(
    `/lab-order/api/v1/admin/orders/${record.id}`,
    {},
    {
      isBaseUrl: true,
      isPreFetching: true,
      isSuccessNotify: false,
      refreshDeps: [record.id],
    }
  );

  const [recordData] = useState(record);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [openDialog4, setOpenDialog4] = useState(false);
  const [newZoneAdded, setNewZoneAdded] = useState<number | null>(null);
  const [qcId, setQcId] = useState<number | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [zone, setZone] = useState<string | null>(null);
  const [editMode] = useState({
    address: false,
    collector: false,
  });

  const handleOpenDialog = (id: number, zone: string) => {
    setQcId(id);
    setZone(zone);
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
    if (newZoneAdded) {
      setNewZoneAdded(Date.now());
    }
  };
  const handleOpenDialog2 = (id: number) => {
    setQcId(id);
    setOpenDialog2(true);
  };
  const handleDialogClose2 = () => {
    setOpenDialog2(false);
  };
  const handleOpenDialog3 = (id: number, text: string) => {
    setQcId(id);
    setText(text);
    setOpenDialog3(true);
  };

  const handleDialogClose3 = () => {
    setOpenDialog3(false);
  };
  const handleOpenDialog4 = (text: string) => {
    setText(text);
    setOpenDialog4(true);
  };

  const handleDialogClose4 = () => {
    setOpenDialog4(false);
  };
  return (
    <div className={classes.orderDetails}>
      <Grid className={classes.orderDiv} container spacing={1}>
        <Grid alignItems="center" item md={3} container>
          <OrderCountIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Order ID
            </Typography>
            <Typography variant="body1">{recordData?.orderNumber}</Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <Calender />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Create Date and Time
            </Typography>
            <Typography variant="body1">
              {getFormattedDate(recordData?.createdAt)}
            </Typography>
          </Box>
        </Grid>

        <Grid alignItems="center" item md={3} container>
          <OrderCountIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Test Count
            </Typography>
            <Typography variant="body1">{orderData?.itemCount}</Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <OrderStatus />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Order Status
            </Typography>
            <Typography
              variant="body1"
              className={aroggaClasses.capitalize}
              style={{
                color: getColorByStatus(orderData?.orderStatus),
              }}
            >
              {orderData?.orderStatus}
            </Typography>
            {orderData?.orderStatus === "cancelled" && (
              <InfoIcon
                className={classes.infoIcon}
                // @ts-ignore
                onClick={() => handleOpenDialog4(orderData?.reason)}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={1} style={{ marginTop: 10 }}>
        <Grid alignItems="center" item md={3} container>
          <DiscountPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Discount
            </Typography>
            <Typography variant="body1">
              ৳{orderData?.discountAmount}
            </Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Net Amount
            </Typography>
            <Typography variant="body1">৳{orderData?.netAmount}</Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Arogga Cash Used
            </Typography>
            <Typography variant="body1">৳{orderData?.cash}</Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Cash Balance Used
            </Typography>
            <Typography variant="body1">
              ৳{orderData?.cashBalanceUsed}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={1} style={{ marginTop: 10 }}>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Bonus Balance Used
            </Typography>
            <Typography variant="body1">
              ৳{orderData?.bonusBalanceUsed}
            </Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Total Amount
            </Typography>
            <Typography variant="body1">৳{orderData?.totalAmount}</Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Paid Amount
            </Typography>
            <Typography variant="body1">৳{orderData?.paidAmount}</Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Due Amount
            </Typography>
            <Typography variant="body1">৳{orderData?.dueAmount}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid className={classes.discount} container spacing={1}>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Refund Arogga Cash
            </Typography>
            <Typography variant="body1">৳{orderData?.refundCash}</Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <DiscountPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Refund Amount
            </Typography>
            <Typography variant="body1">৳{orderData?.refundAmount}</Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <PaymentMethodIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Payment Method
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ color: "red", textTransform: "uppercase" }}
              className={aroggaClasses.capitalize}
            >
              {orderData?.paymentMethod}
            </Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <PaymentMethodIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Payment Status
            </Typography>
            <Typography
              variant="body1"
              className={aroggaClasses.capitalize}
              style={{
                color: orderData?.paymentStatus === "paid" ? "#1DA099" : "red",
              }}
            >
              {orderData?.paymentStatus}
            </Typography>
            {orderData?.paymentStatus !== "paid" &&
              orderData?.paymentMethod === "cod" &&
              orderData.orderStatus !== "pending" && (
                <>
                  {/* @ts-ignore */}
                  <EditIcon
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      //@ts-ignore
                      handleOpenDialog3(
                        //@ts-ignore
                        orderData?.id,
                        orderData?.dueAmount
                      );
                    }}
                    style={{
                      color: "#ED6C02",
                      cursor: "pointer",
                    }}
                  />
                </>
              )}
          </Box>
        </Grid>
      </Grid>
      <Grid className={classes.discount} container spacing={1}>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Lab Material Charge
            </Typography>
            <Typography variant="body1">
              ৳{orderData?.labMaterialCharge}
            </Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Collection Conveyance
            </Typography>
            <Typography variant="body1">
              ৳{orderData?.collectionConveyance}
            </Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Hard Copy Conveyance
            </Typography>
            <Typography variant="body1">
              ৳{orderData?.hardCopyConveyance}
            </Typography>
          </Box>
        </Grid>

        <Grid alignItems="center" item md={3} container>
          <RegularPriceIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Hard Copy
            </Typography>

            <Typography variant="body1">
              {orderData?.isHardCopyRequired === true ? "Yes" : "No"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid
        style={{
          paddingTop: 20,
          paddingBottom: 20,
        }}
        container
        spacing={1}
      >
        <Grid alignItems="center" item md={6} container>
          <AddressIcon />
          <Box marginLeft={2}>
            <div>
              <div className={classes.address}>
                <Typography variant="body2" color="textSecondary">
                  Sample Collection Address
                </Typography>
              </div>
              {editMode.address === true ? (
                <TextField size="small" style={{ width: 50 }} />
              ) : (
                <>
                  <Typography variant="body1">
                    {record?.userLocation?.name}
                  </Typography>
                  <Typography variant="body1">
                    {record?.userLocation?.mobileNumber}
                  </Typography>
                  <br />
                  <Typography variant="body1">
                    {record?.userLocation?.location}
                  </Typography>
                  <Typography variant="body1">
                    ({record?.userLocation?.zone})
                  </Typography>
                </>
              )}
            </div>
          </Box>
        </Grid>
        {/* <Grid alignItems="center" item md={3} container>
                    <AddressIcon />
                    <Box marginLeft={2}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                Zone
                            </Typography>
                        </div>

                        <Typography variant="body1">
                            {record?.userLocation?.zone}
                        </Typography>
                    </Box>
                </Grid> */}
        <Grid alignItems="center" item md={3} container>
          <CalenderIcon />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Schedule Date
            </Typography>
            <Typography variant="body2">
              {orderData?.isScheduleExpired === true ? (
                <span style={{ color: "red" }}>
                  {orderData?.formattedScheduleDate}
                  <br />
                  {orderData?.scheduleTimeRange.en}
                </span>
              ) : (
                <>
                  {" "}
                  {orderData?.formattedScheduleDate}
                  <br />
                  {orderData?.scheduleTimeRange.en}
                </>
              )}
            </Typography>
            {/* @ts-ignore */}
            <EditIcon
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                //@ts-ignore
                handleOpenDialog2(
                  //@ts-ignore
                  recordData?.id
                );
              }}
              className={classes.editIcon}
            />
          </Box>
        </Grid>
        <Grid alignItems="center" item md={3} container>
          <CollectorIcon />

          <FunctionField
            label="Actions"
            render={(record: any) => (
              <Box marginLeft={2}>
                <div className={classes.address}>
                  <Typography variant="body2" color="textSecondary">
                    Assign Collector
                  </Typography>
                </div>
                <Typography variant="body1">
                  {record?.assignedTo?.name}
                </Typography>

                {/* @ts-ignore */}
                <EditIcon
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    //@ts-ignore
                    handleOpenDialog(
                      //@ts-ignore
                      record.id,
                      record?.userLocation?.zone
                    );
                  }}
                  className={classes.editIcon}
                />
              </Box>
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} style={{ marginBottom: 10 }}>
        <Grid alignItems="center" item md={3} container>
          <OrderStatus />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Vendor Name
            </Typography>
            <Typography variant="body1" className={aroggaClasses.capitalize}>
              {orderData?.vendor?.name?.en}
            </Typography>
          </Box>
        </Grid>
        <Grid alignItems="center" item md={6} container>
          <OrderStatus />
          <Box marginLeft={2}>
            <Typography variant="body2" color="textSecondary">
              Vendor Branch Address
            </Typography>
            <Typography variant="body1" className={aroggaClasses.capitalize}>
              {orderData?.vendor?.branchAddress}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent style={{ maxWidth: "850px" }}>
          <CollectorAssignModal
            handleDialogClose={handleDialogClose}
            qcId={qcId}
            zone={zone}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog2} onClose={handleDialogClose2}>
        <DialogContent style={{ maxWidth: "850px" }}>
          <ScheduleModal
            orderRefetch={orderRefetch}
            qcId={qcId}
            handleDialogClose2={handleDialogClose2}
            data={orderData}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog3} onClose={handleDialogClose3}>
        <DialogContent style={{ maxWidth: "850px" }}>
          <DuePayModal
            orderRefetch={orderRefetch}
            text={text}
            handleDialogClose3={handleDialogClose3}
            data={orderData}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog4} onClose={handleDialogClose}>
        <DialogContent style={{ maxWidth: "850px" }}>
          <ClearBtn handleCloseDialog={handleDialogClose4} />
          <div className={classes.reasonDiv}>
            <Typography variant="h5">Cancel Reason</Typography>
          </div>
          <div className={classes.reasonDiv}>
            <Typography variant="h5" className={classes.reason}>
              {text}
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  orderDetails: {
    border: "1px solid #EAEBEC",
    borderRadius: 6,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  orderDiv: {
    borderBottom: "1px solid #E0E0E0",
    paddingTop: 20,
    paddingBottom: 20,
  },
  address: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  discount: {
    borderBottom: "1px solid #E0E0E0",
    paddingTop: 10,
    paddingBottom: 20,
  },
  editIcon: {
    color: "#ED6C02",
    cursor: "pointer",
  },
  reason: {
    color: "red",
  },
  reasonDiv: {
    width: 400,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
  },
  infoIcon: {
    color: "#969BAD",
    cursor: "pointer",
  },
}));

export default Details;
