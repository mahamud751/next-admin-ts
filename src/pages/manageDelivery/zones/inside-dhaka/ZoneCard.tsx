import {
  Button,
  Chip,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import { useState } from "react";
import { Confirm, usePermissions } from "react-admin";
import { BiEdit } from "react-icons/bi";
import { MdAdd, MdFolderCopy } from "react-icons/md";

import AreaMove from "@/components/manageDelivery/zones/AreaMove";
import ConfirmationMessage from "@/components/manageDelivery/zones/ConfirmationMessage";
import CreateRider from "@/components/manageDelivery/zones/CreateRider";
import CreateShippingArea from "@/components/manageDelivery/zones/CreateShippingArea";
import CreateSubArea from "@/components/manageDelivery/zones/CreateSubArea";
import RiderMove from "@/components/manageDelivery/zones/RiderMove";
import CreateZone from "@/components/manageDelivery/zones/createZone";
import { useRequest } from "@/hooks";

interface IZoneCard {
  refetch?: () => void;
  zoneData: any;
  zoneType: string;
  allZoneList: any;
  totalDataCount: number;
}
export default function ZoneCard({
  refetch,
  zoneData,
  zoneType,
  allZoneList,
  totalDataCount,
}: IZoneCard) {
  const classes = useStyles();
  const { permissions } = usePermissions();

  // TODO: Need to reduce and optimize STATEs
  const [openCreateShippingArea, setOpenCreateShippingArea] = useState(false);
  const [openZoneUpdate, setOpenZoneUpdate] = useState(false);
  const [openSubArea, setOpenSubArea] = useState(false);
  const [openRider, setOpenRider] = useState(false);
  const [isShippingAreaActive, setIsShippingAreaActive] = useState(null);
  const [isInActiveDialog, setIsInActiveDialog] = useState(false);
  const [showRiderDeleteConfirmDialog, setShowRiderDeleteConfirmDialog] =
    useState(false);
  const [showSubAreaDeleteConfirmDialog, setShowSubAreaDeleteConfirmDialog] =
    useState(false);
  const [zoneMoveDialog, setZoneMoveDialog] = useState(false);
  const [riderMoveDialog, setRiderMoveDialog] = useState(false);
  const [individualZoneData, setIndividualZoneData] = useState("");
  const [selectedZone, setSelectedZone] = useState<any>("");
  const [selectedShippingArea, setSelectedShippingArea] = useState<any>("");
  const [selectedSubArea, setSelectedSubArea] = useState<any>("");
  const [selectedRider, setSelectedRider] = useState<any>("");

  // Check if the zone is active or not
  const isZoneActive = zoneData?.z_status === 1 || zoneData?.ez_status === 1;

  /* ========================
        Delete functions 
     ======================== */
  // Rider delete
  const { isLoading: riderDeleteLoading, refetch: handleRiderDelete } =
    useRequest(
      `/v1/riderZone/${selectedRider?.rz_id}`,
      {
        method: "DELETE",
        body: {},
      },
      {
        onSuccess: () => {
          setShowRiderDeleteConfirmDialog(false);
          refetch();
        },
      }
    );

  // Sub Area delete
  const { isLoading: subAreaDeleteLoading, refetch: handleSubAreaDelete } =
    useRequest(
      `/v1/subArea/${selectedSubArea?.sa_id}`,
      {
        method: "POST",
        body: {
          sa_status: 0,
        },
      },
      {
        onSuccess: () => {
          setShowSubAreaDeleteConfirmDialog(false);
          refetch();
        },
      }
    );

  /*======================
      Location active/inactive toggle
     =======================*/
  const handleActiveInactive = () => {
    handleLocationActiveInActive();
  };
  const {
    isLoading: isLocationActiveInactiveLoading,
    refetch: handleLocationActiveInActive,
  } = useRequest(
    `/v1/location/${selectedShippingArea?.l_id}`,
    {
      method: "POST",
      body: {
        l_status: isShippingAreaActive ? 1 : 0,
      },
    },
    {
      onSuccess: () => {
        refetch();
        setIsShippingAreaActive(null);
      },
    }
  );

  const handleClose = (val: boolean) => {
    setOpenCreateShippingArea(val);
    setOpenSubArea(val);
    setOpenRider(val);
    setIsInActiveDialog(val);
    setZoneMoveDialog(val);
    setRiderMoveDialog(val);
    setOpenZoneUpdate(val);
    setSelectedZone("");
    setSelectedShippingArea("");
    setSelectedSubArea("");
  };

  return (
    <>
      <div className={classes.card}>
        <div className={classes.cardTitle}>
          <div>
            <Chip
              color={isZoneActive ? "primary" : "default"}
              label={zoneData?.z_name}
              className={classes.zoneTitle}
              style={{ marginRight: "4px" }}
            />
            {!isZoneActive && (
              <Chip size="small" color={"default"} label={"Inactive"} />
            )}
          </div>

          {permissions?.includes("zoneEdit") && (
            <Tooltip title="Update Zone">
              <IconButton
                color="primary"
                aria-label="update-zone"
                onClick={() => {
                  setSelectedZone(zoneData);
                  setOpenZoneUpdate(true);
                }}
              >
                <BiEdit />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <Table
          aria-label="customized table"
          size="small"
          className={classes.root}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="left" style={{ fontSize: "18px" }}>
                Shipping Area
              </StyledTableCell>
              <StyledTableCell align="left">
                <h4
                  style={{
                    color: isZoneActive ? "#0E7673" : "#22222",
                    fontSize: "18px",
                  }}
                >
                  Sub Area
                </h4>
              </StyledTableCell>
              <StyledTableCell align="right">
                {permissions?.includes("locationCreate") && (
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{
                      borderRadius: "100px",
                      fontWeight: 700,
                    }}
                    onClick={() => {
                      setSelectedZone(zoneData);
                      setOpenCreateShippingArea(true);
                    }}
                    // disabled={!isZoneActive}
                  >
                    Add Shipping area
                  </Button>
                )}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zoneData?.z_locations?.map((shippingArea: any, idx) => (
              <>
                <TableRow key={shippingArea?.id}>
                  <StyledTableCell align="left">
                    <div className={classes.cellBody}>
                      <p className={classes.cellBodyP}>
                        {shippingArea?.l_area}
                      </p>
                      <div>
                        <Switch
                          defaultChecked={shippingArea?.l_status === 1}
                          onChange={(e) => {
                            setIsShippingAreaActive(
                              e.target.checked ? true : false
                            );
                            handleActiveInactive();
                            setSelectedShippingArea(shippingArea);
                          }}
                          color="primary"
                          name={shippingArea?.name}
                          disabled={
                            // !isZoneActive ||
                            isLocationActiveInactiveLoading
                          }
                        />
                        <IconButton
                          aria-label="update"
                          style={{
                            backgroundColor:
                              shippingArea?.l_status === 1 || isZoneActive
                                ? "#FF893319"
                                : "#F1F1F1",
                          }}
                          onClick={() => {
                            setZoneMoveDialog(true);
                            setSelectedZone(zoneData?.z_id);
                          }}
                          disabled={
                            // !isZoneActive ||
                            shippingArea?.l_status === 0
                          }
                        >
                          <MdFolderCopy
                            fill={
                              shippingArea?.l_status === 1 ? "#ff8933" : "#fff"
                            }
                          />
                        </IconButton>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <div className={classes.subAreaBody}>
                      {shippingArea?.l_sub_areas?.map((subArea: any) => (
                        <Chip
                          key={subArea?.id}
                          size="small"
                          label={subArea?.sa_title}
                          onDelete={
                            shippingArea?.l_sub_areas?.length > 1
                              ? () => {
                                  setSelectedSubArea(subArea);
                                  setShowSubAreaDeleteConfirmDialog(true);
                                }
                              : null
                          }
                          variant={
                            shippingArea?.l_status === 1 ? "outlined" : "filled"
                          }
                          className={classes.chip}
                          disabled={
                            // !isZoneActive ||
                            shippingArea?.l_status === 0
                          }
                        />
                      ))}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {(permissions?.includes("subAreaCreate") ||
                      permissions?.includes("subAreaEdit")) && (
                      <Tooltip title="Add Sub Area">
                        <IconButton
                          aria-label="add-sub-area"
                          disabled={
                            // !isZoneActive ||
                            shippingArea?.l_status === 0
                          }
                          onClick={() => {
                            setSelectedShippingArea(shippingArea);
                            setSelectedZone(zoneData);
                            setOpenSubArea(true);
                          }}
                        >
                          <MdAdd />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StyledTableCell>
                </TableRow>
              </>
            ))}

            {/* Available riders row */}
            <TableRow>
              <StyledTableCell align="left">
                <div className={classes.cellBody}>
                  <p className={classes.availableRiders}>
                    Available Riders ({zoneData?.z_riders?.length})
                  </p>
                </div>
              </StyledTableCell>
              <StyledTableCell align="left">
                <div className={classes.subAreaBody}>
                  {zoneData?.z_riders?.map((rider) => (
                    <Chip
                      key={rider?.id}
                      label={rider?.rz_rider_name}
                      onDelete={() => {
                        setSelectedRider(rider);
                        setShowRiderDeleteConfirmDialog(true);
                      }}
                      size="small"
                      variant="outlined"
                      color={isZoneActive ? "primary" : "default"}
                      className={classes.chip}
                      // disabled={!isZoneActive}
                    />
                  ))}
                  <Tooltip title="Move Rider">
                    <IconButton
                      aria-label="move-rider"
                      style={{
                        backgroundColor: `"#F1F7F7"`,
                        marginRight: "4px",
                        marginLeft: "8px",
                      }}
                      onClick={() => {
                        setRiderMoveDialog(true);
                        setSelectedZone(zoneData?.z_id);
                      }}
                      // disabled={!isZoneActive}
                    >
                      <MdFolderCopy fill={"#178069"} />
                    </IconButton>
                  </Tooltip>
                  {permissions?.includes("riderZoneCreate") && (
                    <Tooltip title="Add Rider">
                      <IconButton
                        aria-label="add-rider"
                        style={{
                          backgroundColor: "#F1F7F7",
                        }}
                        onClick={() => {
                          setIndividualZoneData(zoneData);
                          setSelectedZone(zoneData?.z_id);

                          setOpenRider(true);
                        }}
                        // disabled={!isZoneActive}
                      >
                        <MdAdd fill={"#178069"} />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ===========================================
                create dialogs            
             =========================================== */}

      {/* Create shipping area modal */}
      {openCreateShippingArea && (
        <CreateShippingArea
          open={openCreateShippingArea}
          onClose={handleClose}
          zoneData={selectedZone}
          refetchAfterSuccess={refetch}
          zoneType={zoneType}
        />
      )}

      {/* Create sub area modal */}
      {openSubArea && (
        <CreateSubArea
          open={openSubArea}
          onClose={handleClose}
          locationData={selectedShippingArea}
          refetchAfterSuccess={refetch}
          zoneType={zoneType}
          zoneData={selectedZone}
        />
      )}

      {/* Create rider modal */}
      {openRider && (
        <CreateRider
          open={openRider}
          onClose={handleClose}
          zone={individualZoneData}
          zoneType={zoneType}
          refetchAfterSuccess={refetch}
        />
      )}

      {/* zoneMoveDialog  */}
      {zoneMoveDialog && (
        <AreaMove
          open={zoneMoveDialog}
          onClose={handleClose}
          zoneType={zoneType}
          refetchAfterSuccess={refetch}
          totalDataCount={totalDataCount}
          selectedZone={selectedZone}
        />
      )}

      {/* riderMoveDialog modal */}
      {riderMoveDialog && (
        <RiderMove
          open={riderMoveDialog}
          onClose={handleClose}
          zoneType={zoneType}
          refetchAfterSuccess={refetch}
          totalDataCount={totalDataCount}
          selectedZone={selectedZone}
        />
      )}

      {/* zone update modal */}
      {openZoneUpdate && (
        <CreateZone
          open={openZoneUpdate}
          onClose={handleClose}
          refetch={refetch}
          zoneType={zoneType}
          formType="edit"
          zoneData={selectedZone}
        />
      )}

      {/* ===========================================
                Confirm dialogs            
             =========================================== */}

      {/* Shipping area active/inactive confirmation modal */}
      {isInActiveDialog && (
        <ConfirmationMessage
          open={isInActiveDialog}
          onClose={handleClose}
          refetchAfterSuccess={refetch}
          shippingArea={selectedShippingArea}
        />
      )}

      {/* RIDER Delete confirmation dialog */}
      {showRiderDeleteConfirmDialog && (
        <Confirm
          isOpen={showRiderDeleteConfirmDialog}
          loading={riderDeleteLoading}
          title={`Remove Rider`}
          content={`Are you sure you want to remove ${selectedRider?.rz_rider_name}`}
          onConfirm={handleRiderDelete}
          onClose={() => {
            setSelectedRider("");
            setShowRiderDeleteConfirmDialog(false);
          }}
        />
      )}
      {/* SUB AREA Delete confirmation dialog */}
      {showSubAreaDeleteConfirmDialog && (
        <Confirm
          isOpen={showSubAreaDeleteConfirmDialog}
          loading={subAreaDeleteLoading}
          title={`Remove Sub Area`}
          content={`Are you sure you want to remove ${selectedSubArea?.sa_title} `}
          onConfirm={handleSubAreaDelete}
          onClose={() => {
            setSelectedSubArea("");
            setShowSubAreaDeleteConfirmDialog(false);
          }}
        />
      )}
    </>
  );
}

/* ===========================================
============== STYLES ========================
============================================== */
// Style of the cell
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    borderBottom: "1px solid #D0D5DD",
  },
  body: {
    fontSize: 14,
    minWidth: "350px",
  },
}))(TableCell);

// Style of the overall card
const useStyles = makeStyles({
  root: {
    border: "none",
    "& .MuiTableRow-root:hover": {
      backgroundColor: "inherit", // Inherit background color to disable hover effect
    },
  },
  cardTitle: {
    padding: "16px 14px",
    borderBottom: "1px solid #D0D5DD",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  zoneTitle: {
    fontSize: "16px",
    padding: "8px 6px",
    fontWeight: 700,
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #D0D5DD",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  cellBody: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cellBodyP: {
    fontSize: "16px",
  },
  availableRiders: {
    fontWeight: 700,
    color: "#12B76A",
  },
  subAreaBody: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    width: "100%",
  },
  chip: {
    borderRadius: "6px",
  },
});
