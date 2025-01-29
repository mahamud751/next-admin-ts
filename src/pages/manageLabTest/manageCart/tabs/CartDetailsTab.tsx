import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/system";
import { useState } from "react";
import { useEditContext, useNotify, useRefresh } from "react-admin";

import { useDebounce, useRequest } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getFormattedDate,
} from "@/utils/helpers";
import { httpClient } from "@/utils/http";

import {
  AddressIcon,
  CalenderIcon,
  CartItemCountIcon,
  DiscountPriceIcon,
  RegularPriceIcon,
} from "@/components/icons";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

const SearchTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: 64,
      width: "100%",
    },
  },
});

const LTCartDetails = () => {
  const classes = useStyles();
  const aroggaClasses = useAroggaStyles();
  const { record } = useEditContext();
  const refresh = useRefresh();
  const notify = useNotify();
  const [bookFor, setBookFor] = useState("");
  const [labTestSearchText, setLabTestSearchText] = useState("");
  const debouncedSearch = useDebounce(labTestSearchText, 500);
  const [selectedLabTest, setSelectedLabTest] = useState({
    id: null,
    name: "",
  });
  const { data: labTestOptions = [] } = useRequest(
    `/misc/api/v1/admin/lab-items?page=1&limit=10000&status=active&name=${debouncedSearch}`,
    { method: "GET" },
    {
      isSuccessNotify: false,
      refreshDeps: [debouncedSearch, record.id],
      isPreFetching: true,
    }
  );
  const { refetch: addNewCartItem } = useRequest(undefined, undefined, {
    onSuccess: (json) => {
      setSelectedLabTest({
        id: null,
        name: "",
      });
      setBookFor("");
      refresh();
    },
  });
  const handleChange = (event: any) => {
    setBookFor(event.target.value as string);
  };
  const handleAddNewCartItem = () => {
    addNewCartItem({
      endpoint: `/lab-cart/api/v2/admin/carts/${record.id}/items`,
      method: "POST",
      body: {
        labItemUqid: selectedLabTest.id,
        patientCount: bookFor,
      },
    });
  };
  const handleCartItemDelete = (cartItemId) => {
    httpClient(
      `/lab-cart/api/v2/admin/carts/${record.id}/items/${cartItemId}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        notify("Item deleted successfully", { type: "success" });
        refresh();
      })
      .catch((error) => {
        notify(`Failed to delete item ${error}`, { type: "error" });
      });
  };
  return (
    <>
      <div className={classes.cartDetails}>
        <Grid container spacing={1}>
          <Grid alignItems="center" item md={4} container>
            <CartItemCountIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Item Count
              </Typography>

              <Typography variant="body1">{record.itemCount}</Typography>
            </Box>
          </Grid>
          <Grid alignItems="center" item md={4} container>
            <DiscountPriceIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Discount
              </Typography>
              <Typography variant="body1">৳ {record.discountAmount}</Typography>
            </Box>
          </Grid>
          <Grid alignItems="center" item md={4} container>
            <RegularPriceIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Total Amount
              </Typography>
              <Typography variant="body1">৳ {record.subtotalAmount}</Typography>
            </Box>
          </Grid>

          <Grid
            alignItems="center"
            item
            md={4}
            container
            style={{ marginTop: 10 }}
          >
            <CalenderIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Update Date and Time
              </Typography>
              <Typography variant="body1">
                {getFormattedDate(record.updatedAt)}
              </Typography>
            </Box>
          </Grid>

          <Grid
            alignItems="center"
            item
            md={8}
            container
            style={{ marginTop: 10 }}
          >
            <AddressIcon />
            <Box marginLeft={2}>
              <Typography variant="body2" color="textSecondary">
                Address
              </Typography>
              <Typography variant="body1" className={aroggaClasses.capitalize}>
                {record?.userLocation?.location} ({record?.userLocation?.zone})
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
      <div className={classes.cartDetails}>
        <Typography variant="h5">Add Test</Typography>
        <div className={classes.addTest_input}>
          <Autocomplete
            fullWidth
            size="medium"
            value={selectedLabTest}
            options={labTestOptions.map((item) => ({
              id: item.id,
              name: item.name.en,
            }))}
            getOptionLabel={(option) => option.name}
            filterOptions={(options) => options}
            onInputChange={(event, newInputValue) => {
              setLabTestSearchText(newInputValue);
            }}
            onChange={(event, newValue) => {
              setSelectedLabTest(newValue as typeof selectedLabTest);
            }}
            renderInput={(params) => (
              <SearchTextField {...params} label={"Search Test*"} />
            )}
          />
          <FormControl
            variant="filled"
            fullWidth
            size="small"
            style={{ maxWidth: "50%" }}
          >
            <InputLabel id="demo-simple-select-label">Book For</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={bookFor}
              label="Book For"
              onChange={handleChange}
            >
              {new Array(5).fill(2).map((item, index) => (
                <MenuItem key={index} value={index + 1}>
                  {index + 1} Person
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={handleAddNewCartItem}
            disabled={!bookFor || !selectedLabTest?.id}
            style={{ width: 220 }}
          >
            Add New
          </Button>
        </div>
        {record?.items?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell align="left">Test Name</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Booking for Person</TableCell>
                  <TableCell align="left">MRP</TableCell>
                  <TableCell align="left">Discount</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {record.items?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">
                      {capitalizeFirstLetterOfEachWord(row.item.name.en)}
                    </TableCell>
                    <TableCell align="left">
                      {capitalizeFirstLetterOfEachWord(row.item.itemType)}
                    </TableCell>
                    <TableCell align="left">{row.patientCount}</TableCell>
                    <TableCell align="left">{row.unitPrice}</TableCell>
                    <TableCell align="left">{row.unitPriceDiscount}</TableCell>
                    <TableCell align="center">
                      <ClearIcon
                        onClick={() => handleCartItemDelete(row.id)}
                        style={{
                          color: "#EF1962",
                          cursor: "pointer",
                        }}
                      />
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
      </div>
    </>
  );
};

const useStyles = makeStyles(() => ({
  cartDetails: {
    border: "1px solid #EAEBEC",
    borderRadius: 6,
    padding: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  addTest_input: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    gap: "2rem",
  },
}));

export default LTCartDetails;
