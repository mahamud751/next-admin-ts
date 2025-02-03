import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, SetStateAction, useState } from "react";
import {
  ListProps,
  SaveButton,
  SimpleForm,
  Toolbar,
  useEditContext,
  useRefresh,
} from "react-admin";

import { useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import {
  capitalizeFirstLetterOfEachWord,
  getColorByStatus,
  getFormattedDate,
} from "@/utils/helpers";
import ClearBtn from "@/components/manageLabTest/Button/ClearBtn";
import { Check2Icon } from "@/components/icons";
import EditIcon from "@/components/icons/EditIcon";

const RefundOrderTab = () => {
  const classes = useStyles();
  const aroggaClasses = useAroggaStyles();
  const { record } = useEditContext();
  const refresh = useRefresh();
  const [currentPage, setCurrentPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [, setDialogId] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [qc, setQcId] = useState<any | null>(null);
  const handleOpenDialog = (row: any) => {
    setQcId(row);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setDialogId(null);
    setOpenDialog(false);
  };
  const handleOpenDialog2 = (row: any) => {
    setQcId(row);
    setOpenDialog2(true);
  };
  const handleCloseDialog2 = () => {
    setDialogId(null);
    setOpenDialog2(false);
  };
  const { data: Order, total } = useRequest(
    `/lab-order/api/v1/admin/orders/${record?.id}/payment-postings?page=${
      currentPage + 1
    }&limit=${rowsPerPage}&sortOrder=ASC`,
    { method: "GET" },
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };
  const UploadFile2 = ({
    handleDialogClose2,
    s_qc_id,
  }: {
    handleDialogClose2: any;
    s_qc_id: number;
  }) => {
    const { refetch: save } = useRequest(
      `/lab-order/api/v1/admin/orders/${record?.id}/payment-postings/${s_qc_id}`,
      {
        method: "PUT",
      },
      {
        onSuccess: () => {
          handleDialogClose2();
          refresh();
        },
      }
    );
    const CustomToolbar = (props) => (
      <Toolbar {...props}>
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
      <SimpleForm onSubmit={save} toolbar={<CustomToolbar />}>
        <div className={classes.updateBox}>
          <div>
            <Check2Icon />
            <p style={{ fontWeight: "bold" }}>
              Do you want to udpate this order ?
            </p>
          </div>
        </div>
      </SimpleForm>
    );
  };
  return (
    <>
      {Order?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Created At</TableCell>
                <TableCell>Attempt Count</TableCell>
                <TableCell align="left">Details</TableCell>
                <TableCell align="left">Last Error</TableCell>
                <TableCell align="left">Type</TableCell>
                <TableCell align="left">Stage</TableCell>
                <TableCell align="left">Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Order?.map((row) => {
                const color = getColorByStatus(row?.stage);
                return (
                  <TableRow key={row.id}>
                    <TableCell
                      component="th"
                      align="left"
                      style={{ width: 180 }}
                    >
                      {getFormattedDate(row.createdAt)}
                    </TableCell>
                    <TableCell align="left">{row?.attemptCount}</TableCell>
                    <TableCell align="left">
                      {/* @ts-ignore */}
                      <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          handleOpenDialog(row);
                        }}
                      >
                        Details
                      </Button>{" "}
                    </TableCell>
                    <TableCell align="left">
                      {row?.lastError?.message}
                    </TableCell>

                    <TableCell
                      align="left"
                      className={aroggaClasses.capitalize}
                    >
                      {row.type}
                    </TableCell>
                    <TableCell align="left">
                      <div
                        style={{
                          width: 93,
                          backgroundColor: color,
                          color: "#FFFFFF",
                          borderRadius: 42,
                          textAlign: "center",
                          paddingTop: 5,
                          paddingBottom: 5,
                        }}
                      >
                        {capitalizeFirstLetterOfEachWord(row?.stage)}
                      </div>
                      {row?.stage === "pending" && (
                        <>
                          {/* @ts-ignore */}
                          <Button
                            disableElevation
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation();
                              handleOpenDialog2(row.id);
                            }}
                          >
                            <EditIcon />
                          </Button>
                        </>
                      )}
                    </TableCell>
                    <TableCell
                      component="th"
                      align="left"
                      style={{ width: 180 }}
                    >
                      {getFormattedDate(row.updatedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/* @ts-ignore */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
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
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <>
            <div className={classes.flex}>
              <ClearBtn handleCloseDialog={handleCloseDialog} />
            </div>
            <Grid className={classes.orderDiv} container spacing={1}>
              <Grid alignItems="center" item md={12} container>
                <Typography variant="body2" className={classes.title}>
                  Main Details
                </Typography>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Net Amount
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.netAmount}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Net Total Paid Amount
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.netTotalPaidAmount}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Pay Amount
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.payAmount}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Total Paid Amount
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.totalPaidAmount}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid className={classes.orderDiv} container spacing={1}>
              <Grid alignItems="center" item md={12} container>
                <Typography variant="body2" className={classes.title}>
                  Create Amount
                </Typography>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sp Amount
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_amount}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sp Item Count
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_item_count}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sp Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_payment_method}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sp Payment Type
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_payment_type}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sp Service
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_service}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sp Service ID
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_service_id}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sp Service User ID
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_service_user_id}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sp Service Location ID
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_user_location_id}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid className={classes.orderDiv} container spacing={1}>
              <Grid alignItems="center" item md={12} container>
                <Typography variant="body2" className={classes.title}>
                  Sp Amount Details
                </Typography>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Arogga Cash
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_amount_details?.arogga_cash}
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Bonus Cashback_expense
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.bonus_cashback_expense
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Cash Balance Used Liability
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.cash_balance_used_liability
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Cost of Service
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.cost_of_service
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Coupon Discount Expense
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.coupon_discount_expense
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Delivery Conveyance Income
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.delivery_fee_income
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    General Discount Expense
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.general_discount_expense
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    lab Material Charge
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.lab_material_charge
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Lab Vendor Payable
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.lab_vendor_payable
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Rounding Expense
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.rounding_expense
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Service Charge Income
                  </Typography>
                  <Typography variant="body1">
                    {
                      qc?.details?.createInput?.sp_amount_details
                        ?.service_charge_income
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid alignItems="center" item md={3} container>
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sub Total
                  </Typography>
                  <Typography variant="body1">
                    {qc?.details?.createInput?.sp_amount_details?.subtotal}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogContent>
          <UploadFile2
            s_qc_id={qc || 0}
            handleDialogClose2={handleCloseDialog2}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const useStyles = makeStyles(() => ({
  flex: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  orderDiv: {
    borderBottom: "1px solid #E0E0E0",
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
  },
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
export default RefundOrderTab;
