import {
  createTheme,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { SetStateAction, useEffect, useState } from "react";
import { Confirm, SelectInput, SimpleForm, useNotify } from "react-admin";

import ZonePagination from "@/components/manageDelivery/zones/ZonePagination";
import { useRequest } from "@/hooks";

interface IoutsideDhaka {
  f_divison: string;
  f_district: string;
  f_area: string;
  f_status: string;
  f_courier: string;
}

const OutsideDhakaIndex = ({
  f_divison,
  f_district,
  f_area,
  f_status,
  f_courier,
}: IoutsideDhaka) => {
  const classes = useStyles();
  const notify = useNotify();
  const [openDialog, setOpenDialog] = useState(false);
  const [zoneData, setZoneData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedChangedCourierRow, setSelectedChangedCourierRow] =
    useState("");
  const [selectedRowLocationId, setSelectedRowLocationId] = useState("");
  const [courierActiveInactivePayload, setCourierActiveInactivePayload] =
    useState(null);

  // API FETCH FUNC GOES HERE
  const queryParams = [
    `_withoutDistrict=Dhaka City`,
    `_perPage=${rowsPerPage}`,
    `_page=${currentPage}`,
    f_divison ? `_division=${f_divison}` : "",
    f_district ? `_district=${f_district}` : "",
    f_area ? `_area=${f_area}` : "",
    f_courier ? `_courier=${f_courier}` : "",
    f_status ? `_status=${f_status}` : "",
  ]
    .filter(Boolean)
    .join("&");
  const {
    data,
    refetch: filterFetch,
    total,
  } = useRequest(
    `/v1/location?${queryParams}`,
    {},
    {
      onFailure: () => {
        setCurrentPage(1);
      },
      isSuccessNotify: false,
      isPreFetching: true,
      isWarningNotify: false,
      refreshDeps: [
        currentPage,
        rowsPerPage,
        f_divison,
        f_district,
        f_area,
        f_status,
        f_courier,
      ],
    }
  );

  useEffect(() => {
    if (data) {
      setZoneData(data);
    }
  }, [data, total]);

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Courier change api (Assign column)
  const { refetch } = useRequest(
    `/v1/location/${selectedRowLocationId}`,
    {
      method: "POST",
      body: {
        l_courier: selectedChangedCourierRow,
      },
    },
    {}
  );

  const handleSwitchToggle = (item, selectedCourier) => {
    let res = item && JSON.parse(item?.l_logistic_config);

    //  Validation
    if (
      selectedCourier === "pathao" &&
      res["pathao"]?.city_id === "" &&
      res["pathao"]?.zone_id === ""
    ) {
      return notify("Pathao config has not been set", { type: "error" });
    }

    if (
      selectedCourier === "ecourier" &&
      res["ecourier"]?.area === "" &&
      res["ecourier"]?.district === "" &&
      res["ecourier"]?.hub === "" &&
      res["ecourier"]?.postcode === "" &&
      res["ecourier"]?.thana === ""
    ) {
      return notify("eCourier config has not been set", {
        type: "error",
      });
    }

    if (selectedCourier === "redx" && res["redx"]?.area_id === "") {
      return notify("RedX config has not been set", { type: "error" });
    }

    // l_logistic_config updated here
    res = updateStatus(
      res,
      selectedCourier,
      res?.[selectedCourier]?.status === 1 ? 0 : 1
    );

    // Validation if eCourier is disabled
    const allTplInactivated =
      Object?.values(res)
        ?.map((v: any) => v?.status)
        ?.filter((f: any) => f === 1)?.length < 1;

    if (allTplInactivated) {
      return notify("Minimum one courier must remain active", {
        type: "error",
      });
    }
    setOpenDialog(true);
    setCurrentId(item);
    setSelectedChangedCourierRow(selectedCourier);
    setCourierActiveInactivePayload(res);
  };

  // This function mutate the l_logistic_config field of the selected row
  function updateStatus(jsonObj, serviceName, newStatus) {
    if (jsonObj[serviceName] && jsonObj[serviceName].status !== undefined) {
      jsonObj[serviceName].status = newStatus;
    }
    return jsonObj;
  }

  // Switch toggle api
  const { isLoading: isToggleLoading, refetch: handleToggle } = useRequest(
    `/v1/location/${currentId?.l_id}`,
    {
      method: "POST",
      body: {
        l_logistic_config: JSON.stringify(courierActiveInactivePayload),
      },
    },
    {
      onSuccess: () => {
        filterFetch();
        setOpenDialog(false);
      },
    }
  );

  return (
    <>
      <Table stickyHeader className={classes.root}>
        <TableHead>
          <TableRow>
            <TableCell>Division</TableCell>
            <TableCell>District</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Post Code</TableCell>
            <TableCell>e-Courier</TableCell>
            <TableCell>Pathao</TableCell>
            <TableCell>Redx</TableCell>
            <TableCell>Assign</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {zoneData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.l_division}</TableCell>
              <TableCell>{row.l_district}</TableCell>
              <TableCell>{row.l_area}</TableCell>
              <TableCell>{row.l_postcode}</TableCell>

              <TableCell>
                <Switch
                  classes={{
                    switchBase: classes.switchBase,
                    checked: classes.checked,
                    track: classes.track,
                  }}
                  onChange={() => handleSwitchToggle(row, "ecourier")}
                  checked={
                    row?.l_logistic_config &&
                    JSON.parse(row?.l_logistic_config)?.ecourier?.status === 1
                  }
                />
              </TableCell>
              <TableCell>
                <Switch
                  classes={{
                    switchBase: classes.switchBase,
                    checked: classes.checked,
                    track: classes.track,
                  }}
                  checked={
                    row?.l_logistic_config &&
                    JSON.parse(row?.l_logistic_config)?.pathao?.status === 1
                  }
                  onChange={() => {
                    handleSwitchToggle(row, "pathao");
                  }}
                />
              </TableCell>
              <TableCell>
                <Switch
                  classes={{
                    switchBase: classes.switchBase,
                    checked: classes.checked,
                    track: classes.track,
                  }}
                  onChange={() => handleSwitchToggle(row, "redx")}
                  checked={
                    row?.l_logistic_config &&
                    JSON.parse(row?.l_logistic_config)?.redx?.status === 1
                  }
                />
              </TableCell>
              <TableCell>
                <SimpleForm toolbar={false}>
                  <SelectInput
                    source="assign"
                    defaultValue={row?.l_courier}
                    choices={[
                      // courier active switch will be given as choice
                      row?.l_logistic_config &&
                        JSON.parse(row?.l_logistic_config)?.redx?.status ===
                          1 && {
                          id: "redx",
                          name: "RedX",
                        },
                      row?.l_logistic_config &&
                        JSON.parse(row?.l_logistic_config)?.pathao?.status ===
                          1 && {
                          id: "pathao",
                          name: "Pathao",
                        },
                      row?.l_logistic_config &&
                        JSON.parse(row?.l_logistic_config)?.ecourier?.status ===
                          1 && {
                          id: "ecourier",
                          name: "eCourier",
                        },
                    ]}
                    variant="outlined"
                    helperText={false}
                    onChange={(e) => {
                      setSelectedRowLocationId(row?.l_id);
                      setSelectedChangedCourierRow(e.target.value);
                      refetch();
                    }}
                  />
                </SimpleForm>
              </TableCell>
              <TableCell>
                {row?.l_status === 1 ? (
                  <p
                    style={{
                      color: "green",
                      fontWeight: 500,
                    }}
                  >
                    Active
                  </p>
                ) : (
                  <p
                    style={{
                      color: "red",
                      fontWeight: 500,
                    }}
                  >
                    Inactive
                  </p>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ZonePagination
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        total={total}
        currentPage={currentPage}
        handleChangePage={handleChangePage}
      />

      {openDialog && (
        <Confirm
          isOpen={openDialog}
          loading={isToggleLoading}
          title={`Confirm`}
          content={`Are you sure you want to change the status`}
          onConfirm={handleToggle}
          onClose={() => {
            setCurrentId(null);
            setOpenDialog(false);
          }}
        />
      )}
    </>
  );
};

const theme = createTheme({
  spacing: 8,
});
const useStyles = makeStyles(() => ({
  root: {
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#f6f6f6", // Inherit background color to disable hover effect
    },
  },
  switchBase: {
    color: theme.palette.grey[500], // Default (inactive) color
    "&$checked": {
      color: theme.palette.success.main, // Checked (active) color
    },
    "&$checked + $track": {
      backgroundColor: theme.palette.success.main, // Track color when active
    },
  },
  checked: {},
  track: {},
  dialogContent: {
    paddingBottom: theme.spacing(2), // Add some padding to the bottom of the dialog content
  },
  outsideDhakaForm: {
    display: "flex",
    gap: 4,
    marginBottom: 0,
    width: "100%",
  },
}));

export default OutsideDhakaIndex;
