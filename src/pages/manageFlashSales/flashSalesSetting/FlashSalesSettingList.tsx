import {
  Grid,
  Typography,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState, useEffect, useCallback } from "react";
import { Confirm, ListProps, Title } from "react-admin";
import clsx from "clsx";

import { useDocumentTitle, useRequest } from "../../../hooks";

const FlashSalesSettingList: FC<ListProps> = () => {
  useDocumentTitle("Arogga | Flash Sales Setting");
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmToggleValue, setConfirmToggleValue] = useState(false);
  const handleOpenModal = (newToggleValue: boolean) => {
    setConfirmToggleValue(newToggleValue);
    setIsDialogOpen(true);
  };
  const { data: flashSales } = useRequest(
    `/admin/v1/flashSales`,
    { method: "GET" },
    {
      isBaseUrl: true,
      isSuccessNotify: false,
      isPreFetching: true,
    }
  );

  const { data: flashSalesToggle } = useRequest(
    `/admin/v1/optionsMultiple?flashSalesSettings`,
    { method: "GET" },
    {
      isBaseUrl: true,
      isSuccessNotify: false,
      isPreFetching: true,
    }
  );
  const [settingToggle, setSettingToggle] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleConfirmToggle = () => {
    setSettingToggle(confirmToggleValue);
    toggle({
      flashSalesSettings: {
        toggle: confirmToggleValue ? 1 : 0,
      },
    });
    setIsDialogOpen(false);
  };

  const [toggles, setToggles] = useState({
    active: [] as number[],
    b2b: [] as number[],
    b2c: [] as number[],
  });

  const [editableValues, setEditableValues] = useState({
    b2b_margin: [] as string[],
    b2c_margin: [] as string[],
    stock_days: [] as string[],
    checking_interval: [] as string[],
  });

  useEffect(() => {
    if (flashSales?.length > 0) {
      setToggles({
        active: flashSales.map((sale) => (sale.toggle ? 1 : 0)),
        b2b: flashSales.map((sale) => (sale.b2b ? 1 : 0)),
        b2c: flashSales.map((sale) => (sale.b2c ? 1 : 0)),
      });

      setEditableValues({
        b2b_margin: flashSales.map(
          (sale) => sale.b2b_margin?.toString() || "0"
        ),
        b2c_margin: flashSales.map(
          (sale) => sale.b2c_margin?.toString() || "0"
        ),
        stock_days: flashSales.map(
          (sale) => sale.stock_days?.toString() || "0"
        ),
        checking_interval: flashSales.map(
          (sale) => sale.checking_interval?.toString() || "0"
        ),
      });
    }
  }, [flashSales]);
  useEffect(() => {
    if (flashSalesToggle?.flashSalesSettings?.toggle !== undefined) {
      setSettingToggle(flashSalesToggle.flashSalesSettings.toggle === 1);
    }
  }, [flashSalesToggle]);

  const handleToggleChange = useCallback(
    (type: keyof typeof toggles, index: number, checked: boolean) => {
      setToggles((prev) => ({
        ...prev,
        [type]: prev[type].map((value, i) =>
          i === index ? (checked ? 1 : 0) : value
        ),
      }));

      if (type === "active" && checked) {
        setToggles((prev) => ({
          ...prev,
          b2c: prev.b2c.map((value, i) => (i === index ? 1 : value)),
        }));

        setEditableValues((prev) => ({
          ...prev,
          b2c_margin: prev.b2c_margin.map((value, i) =>
            i === index ? "7.5" : value
          ),
          stock_days: prev.stock_days.map((value, i) =>
            i === index ? "60" : value
          ),
          checking_interval: prev.checking_interval.map((value, i) =>
            i === index ? "24" : value
          ),
        }));
      }
    },
    []
  );

  const validateFields = useCallback(() => {
    const newErrors: { [key: string]: string[] } = {};

    editableValues.b2b_margin.every((value, index) => {
      if (toggles.active[index] === 1) {
        if (!(toggles.b2b[index] === 1 || toggles.b2c[index] === 1)) {
          newErrors[`toggle_${index}`] = ["Either B2B or B2C must be enabled"];
          return false;
        }
        if (toggles.b2b[index] === 1 && parseInt(value) < 1) {
          newErrors[`b2b_margin_${index}`] = ["B2B margin must be >= 1"];
          return false;
        }
      }
      return true;
    }) &&
      editableValues.b2c_margin.every((value, index) => {
        if (toggles.active[index] === 1) {
          if (!(toggles.b2b[index] === 1 || toggles.b2c[index] === 1)) {
            newErrors[`toggle_${index}`] = [
              "Either B2B or B2C must be enabled",
            ];
            return false;
          }

          if (toggles.b2c[index] === 1 && parseInt(value) < 1) {
            newErrors[`b2c_margin_${index}`] = ["B2C margin must be >= 1"];
            return false;
          }
        }
        return true;
      }) &&
      editableValues.stock_days.every((value, index) => {
        if (toggles.active[index] === 1 && parseInt(value) < 1) {
          newErrors[`stock_days_${index}`] = ["Stock days must be >= 1"];
          return false;
        }
        return true;
      }) &&
      editableValues.checking_interval.every((value, index) => {
        if (toggles.active[index] === 1 && parseInt(value) < 1) {
          newErrors[`checking_interval_${index}`] = [
            "Checking interval must be >= 1",
          ];
          return false;
        }
        return true;
      });

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [editableValues, toggles]);

  useEffect(() => {
    validateFields();
  }, [editableValues, validateFields]);

  const generatePayload = useCallback(() => {
    return {
      flashSales: flashSales?.map((sale, index) => ({
        taxonomy_id: sale.taxonomy_id?.toString() || "",
        category_name: sale.category_name || "",
        toggle: toggles.active[index] ? "1" : "0",
        b2b: toggles.b2b[index] ? "1" : "0",
        b2b_margin: editableValues.b2b_margin[index] || "0",
        b2c: toggles.b2c[index] ? "1" : "0",
        b2c_margin: editableValues.b2c_margin[index] || "0",
        stock_days: editableValues.stock_days[index] || "0",
        checking_interval: editableValues.checking_interval[index] || "0",
      })),
    };
  }, [flashSales, toggles, editableValues]);

  const { isLoading: flashSaleLoading, refetch } = useRequest(
    `/v1/flashSales`,
    {
      method: "POST",
      body: generatePayload(),
    },
    {
      isRefresh: true,
    }
  );
  const { isLoading: flashSaleToggleLoading, refetch: toggle } = useRequest(
    `/v1/flashSalesToggle`,
    {
      method: "POST",
      body: {
        flashSalesSettings: {
          toggle: settingToggle ? 1 : 0,
        },
      },
    },
    {
      isRefresh: true,
      onFailure: () => {
        setSettingToggle(!settingToggle);
      },
    }
  );

  const renderError = (field: string, index: number) => {
    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      return (
        <Typography
          color="error"
          variant="body2"
          style={{ marginLeft: 5, fontSize: 14 }}
        >
          {errors[errorKey]}
        </Typography>
      );
    }
    return null;
  };

  return (
    <>
      <Title title="Flash Sales Setting" />
      <div style={{ marginTop: 30 }}>
        <Grid container alignItems="center">
          <Typography variant="body1" className={classes.label}>
            Flash Sales Setting
          </Typography>
          <Switch
            checked={settingToggle}
            onChange={(e) => handleOpenModal(e.target.checked)}
            color="primary"
            disabled={flashSaleToggleLoading}
          />

          <Confirm
            isOpen={isDialogOpen}
            loading={flashSaleToggleLoading}
            title={`Are you sure you want to update flash sales setting?`}
            content={false}
            onConfirm={handleConfirmToggle}
            onClose={() => setIsDialogOpen(false)}
          />
        </Grid>
      </div>

      <div className={classes.listDiv}>
        {flashSales?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="flash sales table">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>B2B</TableCell>
                  <TableCell>Margin Above COGS (%)</TableCell>
                  <TableCell>B2C</TableCell>
                  <TableCell>Margin Above COGS (%)</TableCell>
                  <TableCell>Stock Days</TableCell>
                  <TableCell>Stock Days Checking Interval (Hours)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flashSales.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" className={classes.borderRight}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Switch
                            checked={Boolean(toggles.active[index])}
                            onChange={(e) =>
                              handleToggleChange(
                                "active",
                                index,
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        </Grid>
                        <Grid item>
                          <Typography>{row.category_name}</Typography>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell align="left">
                      <Switch
                        checked={Boolean(toggles.b2b[index])}
                        onChange={(e) =>
                          handleToggleChange("b2b", index, e.target.checked)
                        }
                        color="primary"
                        disabled={!toggles.active[index]}
                      />
                      {renderError("toggle", index)}
                    </TableCell>
                    <TableCell align="left" className={classes.borderRight}>
                      <input
                        type="number"
                        value={editableValues.b2b_margin[index]}
                        onChange={(e) =>
                          setEditableValues((prev) => ({
                            ...prev,
                            b2b_margin: prev.b2b_margin.map((value, i) =>
                              i === index ? e.target.value : value
                            ),
                          }))
                        }
                        disabled={!toggles.active[index]}
                        min="1"
                        style={{
                          color: !toggles.active[index] ? "grey" : "black",
                        }}
                      />
                      {renderError("b2b_margin", index)}
                    </TableCell>
                    <TableCell align="left">
                      <Switch
                        checked={Boolean(toggles.b2c[index])}
                        onChange={(e) =>
                          handleToggleChange("b2c", index, e.target.checked)
                        }
                        color="primary"
                        disabled={!toggles.active[index]}
                      />
                      {renderError("toggle", index)}
                    </TableCell>

                    <TableCell align="left" className={classes.borderRight}>
                      <input
                        type="number"
                        value={editableValues.b2c_margin[index]}
                        onChange={(e) =>
                          setEditableValues((prev) => ({
                            ...prev,
                            b2c_margin: prev.b2c_margin.map((value, i) =>
                              i === index ? e.target.value : value
                            ),
                          }))
                        }
                        disabled={!toggles.active[index]}
                        min="1"
                        style={{
                          color: !toggles.active[index] ? "grey" : "black",
                        }}
                      />
                      {renderError("b2c_margin", index)}
                    </TableCell>
                    <TableCell align="left">
                      <input
                        type="number"
                        value={editableValues.stock_days[index]}
                        onChange={(e) =>
                          setEditableValues((prev) => ({
                            ...prev,
                            stock_days: prev.stock_days.map((value, i) =>
                              i === index ? e.target.value : value
                            ),
                          }))
                        }
                        disabled={!toggles.active[index]}
                        min="1"
                        style={{
                          color: !toggles.active[index] ? "grey" : "black",
                        }}
                      />
                      {renderError("stock_days", index)}
                    </TableCell>
                    <TableCell align="left">
                      <input
                        type="number"
                        value={editableValues.checking_interval[index]}
                        onChange={(e) =>
                          setEditableValues((prev) => ({
                            ...prev,
                            checking_interval: prev.checking_interval.map(
                              (value, i) =>
                                i === index ? e.target.value : value
                            ),
                          }))
                        }
                        disabled={!toggles.active[index]}
                        min="1"
                        style={{
                          color: !toggles.active[index] ? "grey" : "black",
                        }}
                      />
                      {renderError("checking_interval", index)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No Record Found</Typography>
        )}
      </div>
      <Grid container justifyContent="flex-start" className={classes.buttonDiv}>
        <Button variant="outlined" className={classes.button}>
          Edit
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={clsx(classes.saveButton, classes.button)}
          onClick={refetch}
          disabled={!isValid || flashSaleLoading}
        >
          {flashSaleLoading ? "Saving..." : "Save"}
        </Button>
      </Grid>
    </>
  );
};

const useStyles = makeStyles(() => ({
  listDiv: {
    padding: 10,
    margin: "20px 0px",
  },
  borderRight: {
    borderRight: "1px solid #E0E0E0",
  },
  buttonDiv: {
    background: "#F1F2F4",
    padding: "20px 20px",
    margin: "0 10px",
  },
  button: {
    width: 120,
  },
  saveButton: {
    marginLeft: 10,
  },
  label: {
    fontSize: "24px",
    fontWeight: 600,
    marginLeft: 10,
  },
}));
export default FlashSalesSettingList;
