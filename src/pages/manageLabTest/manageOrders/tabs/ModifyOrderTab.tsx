import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import ClearIcon from "@mui/icons-material/Clear";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import WarningIcon from "@mui/icons-material/Warning";

import React, { FC, useEffect, useState } from "react";
import { CreateProps, useEditContext, useRefresh } from "react-admin";

import { useDebounce, useDocumentTitle, useRequest } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import LoaderOrButton from "@/components/common/LoaderOrButton";
import ModifyOrderCalculate from "@/components/manageLabTest/order/ModifyOrderCalculate";

const SearchTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: 64,
      width: "100%",
    },
  },
});
const ModifyOrderTab = (props) => {
  useDocumentTitle("Arogga | Order Create");
  const classes = useStyles();
  const refresh = useRefresh();
  const { record } = useEditContext();
  const [bookFor, setBookFor] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [updateOrderItems, setUpdateOrderItems] = useState([]);
  const [labTestSearchText, setLabTestSearchText] = useState("");
  const debouncedSearch = useDebounce(labTestSearchText, 500);
  const [uniqueFormattedLabItems, setUniqueFormattedLabItems] = useState(
    new Set()
  );

  const [removeOrderItemUqids, setRemoveOrderItemUqids] = useState([]);
  const [selectedLabTest, setSelectedLabTest] = useState({
    id: null,
    externalId: null,
    name: "",
    regularPrice: "",
    discountPrice: "",
  });
  const [selectedLabTests, setSelectedLabTests] = useState([]);
  const item = React.useMemo(
    () => record.items?.map((item) => item) || [],
    [record.items]
  );
  useEffect(() => {
    if (item && item.length > 0) {
      const formattedLabTests = item.map(
        (recordItem: {
          externalId: any;
          id: any;
          name: { en: any };
          unitPrice: any;
          unitPriceDiscount: any;
          patientCount: any;
        }) => ({
          labItemUqid: recordItem.externalId,
          externalId: recordItem.id,
          name: recordItem.name.en,
          regularPrice: recordItem.unitPrice,
          discountPrice: recordItem.unitPriceDiscount,
          patientCount: recordItem?.patientCount,
        })
      );
      setSelectedLabTests(formattedLabTests);
    } else {
      setSelectedLabTests([]);
    }
  }, [record?.items, item]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const { data: labTestOptions = [] } = useRequest(
    `/misc/api/v1/admin/lab-items?status=active&name=${debouncedSearch}&page=1
        &limit=1000&vendorUqid=${record?.vendor?.id}`,
    { method: "GET" },
    {
      isSuccessNotify: false,
      refreshDeps: [debouncedSearch, record?.id, selectedLabTests, record],
      isPreFetching: true,
    }
  );
  const handleChange = (event: any) => {
    setBookFor(event.target.value as string);
  };

  const handleAddNew = () => {
    const newLabTest = {
      labItemUqid: selectedLabTest.id,
      externalId: selectedLabTest.externalId,
      name: selectedLabTest?.name,
      regularPrice: selectedLabTest.regularPrice,
      discountPrice: selectedLabTest.discountPrice,
      patientCount: bookFor,
    };

    if (!uniqueFormattedLabItems.has(newLabTest.labItemUqid)) {
      setUniqueFormattedLabItems(
        new Set(uniqueFormattedLabItems.add(newLabTest.labItemUqid))
      );
      setSelectedLabTests([...selectedLabTests, newLabTest]);
    }
    setSelectedLabTest({
      id: null,
      externalId: null,
      name: "",
      regularPrice: "",
      discountPrice: "",
    });
    setBookFor("");
    refetch();
  };
  const handleCartItemDelete = (cartItemId) => {
    const updatedLabTests = selectedLabTests.filter(
      (item) => item.labItemUqid !== cartItemId
    );

    const matchingLabTest = selectedLabTests.find(
      (item) => item?.labItemUqid === cartItemId
    );

    if (matchingLabTest) {
      setSelectedLabTests(updatedLabTests);
      if (matchingLabTest.externalId) {
        const updatedRemoveOrderItemUqids = [
          ...removeOrderItemUqids,
          matchingLabTest?.externalId,
        ];
        setRemoveOrderItemUqids(updatedRemoveOrderItemUqids);
      }
    }
    refetch();
  };
  const formattedLabItems = Array.from(uniqueFormattedLabItems)
    .map((labItemUqid) => {
      const labTest = selectedLabTests.find(
        (item) => item.labItemUqid === labItemUqid
      );
      if (labTest && !removeOrderItemUqids.includes(labTest.externalId)) {
        return {
          labItemUqid: labItemUqid,
          patientCount: labTest.patientCount,
        };
      }
      return null;
    })
    .filter(Boolean);

  const filteredUpdateOrderItems = updateOrderItems.filter(
    (item) => !removeOrderItemUqids.includes(item.orderItemUqid)
  );

  const {
    data: calculate,
    isSuccess,
    isLoading,
    refetch,
  } = useRequest(
    `/lab-order/api/v1/admin/orders/${record.id}/calculation`,
    {
      method: "PUT",
      body: {
        addLabItems: formattedLabItems,
        updateOrderItems: filteredUpdateOrderItems,
        removeOrderItemUqids: removeOrderItemUqids,
      },
    },
    {
      isSuccessNotify: false,
    }
  );
  const { refetch: onSave } = useRequest(
    `/lab-order/api/v1/admin/orders/${record.id}`,
    {
      method: "PUT",
      body: {
        addLabItems: formattedLabItems,
        updateOrderItems: filteredUpdateOrderItems,
        removeOrderItemUqids: removeOrderItemUqids,
      },
    },
    {
      onSuccess: () => {
        refresh();
      },
    }
  );

  const handleError = (err: any) => {
    setOpenDialog(true);
  };

  return (
    <div className={classes.cartDetails}>
      {selectedLabTests?.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Test ID</TableCell>
                  <TableCell align="left">Test Name</TableCell>
                  <TableCell align="left">Booking for Person</TableCell>
                  <TableCell align="left">MRP</TableCell>
                  <TableCell align="left">Discount Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedLabTests?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row?.labItemUqid}
                    </TableCell>
                    <TableCell align="left">
                      {capitalizeFirstLetterOfEachWord(row?.name)}
                    </TableCell>
                    <TableCell align="left">
                      <FormControl
                        variant="filled"
                        fullWidth
                        size="small"
                        style={{ maxWidth: "50%" }}
                      >
                        <InputLabel id={`book-for-label-${index}`}>
                          Book For
                        </InputLabel>
                        <Select
                          labelId={`book-for-label-${index}`}
                          id={`book-for-select-${index}`}
                          value={row.patientCount}
                          label="Book For"
                          onChange={(event) => {
                            const newValue = event.target.value;
                            const updatedLabTests = selectedLabTests.map(
                              (item) => {
                                if (item.labItemUqid === row.labItemUqid) {
                                  return {
                                    ...item,
                                    patientCount: newValue,
                                  };
                                }
                                return item;
                              }
                            );
                            const existingUpdateItemIndex =
                              updateOrderItems.findIndex(
                                (item) => item.orderItemUqid === row.externalId
                              );

                            const updatedUpdateOrderItems = [
                              ...updateOrderItems,
                            ];

                            if (existingUpdateItemIndex !== -1) {
                              updatedUpdateOrderItems[
                                existingUpdateItemIndex
                              ].patientCount = newValue;
                            } else {
                              updatedUpdateOrderItems.push({
                                orderItemUqid: row.externalId,
                                patientCount: newValue,
                              });
                            }
                            setSelectedLabTests(updatedLabTests);
                            setUpdateOrderItems(updatedUpdateOrderItems);
                            refetch();
                          }}
                          disabled={!row.externalId}
                        >
                          {new Array(5).fill(2).map((item, idx) => (
                            <MenuItem key={idx} value={idx + 1}>
                              {idx + 1} Person
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell align="left">
                      {row?.regularPrice * row?.patientCount}
                    </TableCell>
                    <TableCell align="left">
                      {row?.discountPrice * row?.patientCount}
                    </TableCell>
                    {selectedLabTests?.length > 1 ? (
                      <TableCell align="center">
                        <ClearIcon
                          onClick={() => handleCartItemDelete(row.labItemUqid)}
                          className={classes.clearIcon}
                        />
                      </TableCell>
                    ) : (
                      <TableCell align="center">
                        <HighlightOffTwoToneIcon
                          onClick={() => handleError(row.externalId)}
                          className={classes.clearIcon1}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        ""
      )}

      <div className={classes.addTest_input}>
        <Autocomplete
          fullWidth
          size="medium"
          value={selectedLabTest}
          options={labTestOptions.map((item) => ({
            id: item.id,
            name: item.name.en,
            regularPrice:
              item?.vendorLabItems.length > 0
                ? item.vendorLabItems[0].regularPrice
                : "Not Available",

            discountPrice:
              item?.vendorLabItems.length > 0
                ? item?.vendorLabItems?.[0]?.regularPrice -
                  item?.vendorLabItems?.[0]?.discountPrice
                : "Not Available",
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
          style={{ maxWidth: "40%" }}
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
          onClick={handleAddNew}
          style={{ width: 220 }}
          disabled={!bookFor || !selectedLabTest?.id}
        >
          Add New
        </Button>
      </div>
      <LoaderOrButton
        label="Calculate"
        isLoading={isLoading}
        display="flex"
        justifyContent="center"
        mt={2}
        mb={2}
        onClick={refetch}
      />

      {isSuccess && calculate && <ModifyOrderCalculate calculate={calculate} />}
      <Button size="large" variant="contained" color="primary" onClick={onSave}>
        Save
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <Box>
            <div className={classes.modifyOrder}>
              {/* @ts-ignore */}
              <ClearIcon
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  handleCloseDialog();
                }}
                className={classes.clearIcon1}
              />
            </div>
            <div className={classes.updateBox}>
              <div>
                <WarningIcon className={classes.warningIcon} />
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "none" }}></div>
                  <div className="name">
                    <strong>
                      {" "}
                      The order must have at least 1 (one) lab test
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  cartDetails: {
    borderRadius: 6,
    padding: 25,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  addTest_input: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    gap: "2rem",
    padding: 20,
  },
  updateBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "250px",
  },
  modifyOrder: {
    display: "flex",
    justifyContent: "end",
    width: "100%",
  },
  clearIcon1: {
    color: "gray",
    cursor: "pointer",
  },
  clearIcon: {
    fontSize: 35,
    color: "red",
    marginBottom: 10,
    cursor: "pointer",
  },
  warningIcon: {
    fontSize: 40,
    color: "red",
  },
}));

export default ModifyOrderTab;
