import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import {
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useEditContext,
  useNotify,
  useRefresh,
} from "react-admin";
import EditIcon from "@mui/icons-material/Edit";

import { labTestUploadDataProvider } from "@/dataProvider";
import {
  capitalizeFirstLetterOfEachWord,
  toFixedNumber,
} from "@/utils/helpers";
import ClearBtn from "@/components/manageLabTest/Button/ClearBtn";

const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton label="Vendor Price Update" />
  </Toolbar>
);

const VendorPrice = () => {
  const classes = useStyles();
  const notify = useNotify();
  const { record } = useEditContext();

  const refresh = useRefresh();
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);

  const mainVendor = record?.vendorLabItems?.find((v) => v.id === qcId);

  const [basePrice, setBasePrice] = useState<string | null>(
    mainVendor?.basePrice || null
  );
  const [materialCost, setMaterialCost] = useState<string | null>(
    mainVendor?.materialCost || null
  );
  const [margin, setMargin] = useState<string | null>(
    mainVendor?.margin || null
  );
  const [externalMaterialCost, setExternalMaterialCost] = useState<
    string | null
  >(mainVendor?.margin || null);
  const [discount, setDiscount] = useState<string | null>(
    mainVendor?.discountPrice || null
  );
  const [status, setStatus] = useState<string | null>(
    mainVendor?.status || null
  );

  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(null);
    setOpenDialog(false);
  };

  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    setBasePrice(mainVendor?.basePrice || null);
    setMaterialCost(mainVendor?.materialCost || null);
    setMargin(mainVendor?.margin || null);
    setExternalMaterialCost(mainVendor?.externalMaterialCost || null);
    setDiscount(mainVendor?.discountPrice || null);
    setStatus(mainVendor?.status || null);
  }, [mainVendor]);

  useEffect(() => {
    const basePriceValue = parseFloat(basePrice || record?.basePrice || "0");
    const materialCostValue = parseFloat(materialCost || "0") || 0;
    const marginValue = parseFloat(margin || "0") || 0;
    const calculatedTotal = basePriceValue + materialCostValue + marginValue;
    setTotal(calculatedTotal);
  }, [basePrice, materialCost, margin, record?.basePrice]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const onSave = async (data) => {
    const payload = {
      itemUqid: record?.id,
      vendorUqid: mainVendor?.vendor?.id,
      basePrice: data.basePrice,
      materialCost: data.materialCost,
      margin: data.margin,
      externalMaterialCost: data.externalMaterialCost,
      discountPrice: data.discountPrice,
      status: status,
    };

    try {
      await labTestUploadDataProvider.update(
        `misc/api/v1/admin/vendor/modify-item-price`,
        {
          data: payload,
        }
      );
      notify("Successfully lab test created!", { type: "success" });
      refresh();
    } catch (err: any) {
      notify(err.message || "Failed!", { type: "warning" });
    }
  };
  return (
    <>
      <div className={classes.cartDetails}>
        {record?.vendorLabItems?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Vendor Name</TableCell>
                  <TableCell align="left">Base Price</TableCell>
                  <TableCell align="left">Material Cost</TableCell>
                  <TableCell align="left">Margin</TableCell>
                  <TableCell align="left">Regular Price</TableCell>
                  <TableCell align="left">External Material Cost</TableCell>
                  <TableCell align="left">Discount Price</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left"> Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {record?.vendorLabItems?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell align="left">
                      {row?.vendor?.name?.en || "No Name"}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row.basePrice).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row?.materialCost).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row?.margin).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row?.regularPrice).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      {toFixedNumber(row?.externalMaterialCost).toFixed(2)}
                    </TableCell>

                    <TableCell align="left">
                      {toFixedNumber(row?.discountPrice).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      <p
                        style={{
                          backgroundColor:
                            (row.status === "active" ? "#4CAF50" : "#FFB547") +
                            "10",
                          color:
                            row.status === "inactive" ? "#FFB547" : "#4CAF50",
                          borderRadius: 42,
                          textAlign: "center",
                          paddingTop: 5,
                          paddingBottom: 5,
                          textTransform: "capitalize",
                        }}
                      >
                        {row?.status}
                      </p>
                    </TableCell>

                    <TableCell align="left">
                      {/* @ts-ignore */}
                      <Button
                        disableElevation
                        onClick={(e: MouseEvent) => {
                          handleOpenDialog(row.id);
                        }}
                        style={{
                          backgroundColor:
                            (row.status === "active" ? "#4CAF50" : "#FFB547") +
                            "10",
                          color:
                            row.status === "inactive" ? "#FFB547" : "#4CAF50",
                          borderRadius: 42,
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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
              {" "}
              <div className={classes.flex}>
                <Typography variant="h5">
                  Update{" "}
                  {capitalizeFirstLetterOfEachWord(
                    record?.vendorLabItems?.find((v) => v.id === qcId)?.vendor
                      ?.name?.en
                  )}{" "}
                  Price
                </Typography>
                <ClearBtn handleCloseDialog={handleCloseDialog} />
              </div>
              <Grid container className={classes.locationArea}>
                <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar />}>
                  <>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {" "}
                        <div className={classes.card}>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <TextInput
                                source="basePrice"
                                variant="outlined"
                                label="Base price"
                                fullWidth
                                defaultValue={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                disabled={record?.itemType === "package"}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextInput
                                source="materialCost"
                                variant="outlined"
                                label="Material Cost"
                                fullWidth
                                defaultValue={materialCost}
                                onChange={(e) =>
                                  setMaterialCost(e.target.value)
                                }
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextInput
                                source="margin"
                                variant="outlined"
                                label="Margin"
                                fullWidth
                                defaultValue={margin}
                                onChange={(e) => setMargin(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                id="outlined-basic"
                                label="MRP Price"
                                variant="outlined"
                                fullWidth
                                value={total !== null ? total : "0.00"}
                                disabled
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextInput
                                source="externalMaterialCost"
                                variant="outlined"
                                label="External Material Cost"
                                fullWidth
                                defaultValue={externalMaterialCost}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextInput
                                source="discountPrice"
                                variant="outlined"
                                label="Discount Price"
                                fullWidth
                                defaultValue={discount}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl
                                variant="outlined"
                                fullWidth
                                className={classes.status}
                              >
                                <InputLabel id="status-select-label">
                                  Status
                                </InputLabel>
                                <Select
                                  labelId="status-select-label"
                                  id="status-select"
                                  value={status}
                                  onChange={handleStatusChange}
                                  label="Status"
                                >
                                  <MenuItem value={"active"}>Active</MenuItem>
                                  <MenuItem value={"inactive"}>
                                    Inactive
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </div>
                      </Grid>
                    </Grid>
                  </>
                </SimpleForm>
              </Grid>
            </>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

const useStyles = makeStyles(() => ({
  label: {
    background: "#f6f6f6",
    fontWeight: "bold",
    fontSize: 20,
  },
  card: {
    display: "flex",
    justifyContent: "end",
    margin: "10px 0",
    border: "1px solid #E0E0E0",
    padding: 10,
  },
  cartDetails: {
    border: "1px solid #EAEBEC",
    borderRadius: 6,
    padding: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  locationArea: {
    width: "100%",
    margin: "20px 0px 20px 0px",
    background: "#FFFFFF",
    border: "1px dashed #3ECBA5",
    borderRadius: 6,
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  status: {
    width: 300,
  },
}));

export default VendorPrice;
