import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { SetStateAction, useEffect, useState } from "react";
import { AutocompleteInput, SimpleForm, usePermissions } from "react-admin";

import ZonePagination from "@/components/manageDelivery/zones/ZonePagination";
import CreateZone from "@/components/manageDelivery/zones/createZone";
import { useRequest } from "@/hooks";
import ZoneCard from "./ZoneCard";

export default function InsideDhakaIndex() {
  const { permissions } = usePermissions();
  const [selectedZone, setSelectedZone] = useState("regular");
  const [filteredSearchedZone, setFilteredSearchedZone] = useState("");
  const [openCreateZone, setOpenCreateZone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [zoneListData, setZoneListData] = useState([]);

  const handleClose = (val: boolean) => {
    setOpenCreateZone(val);
  };

  // API FETCH FUNC GOES HERE
  const {
    isLoading,
    data: zoneData,
    total,
    refetch: zoneRefetch,
  } = useRequest(
    `/v1/insideDhakaLocations?_type=${selectedZone}&ids=${
      filteredSearchedZone ?? ""
    }&_perPage=${rowsPerPage}&_page=${currentPage}`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      isWarningNotify: false,
      refreshDeps: [
        currentPage,
        rowsPerPage,
        selectedZone,
        filteredSearchedZone,
      ],
    }
  );

  // zone list for filter dropdown
  const { data: zoneList, refetch: zoneListRefetch } = useRequest(
    `/v1/zone/?_type=${selectedZone}&_perPage=500`,
    {},
    { refreshDeps: [selectedZone] }
  );

  const refetchFunc = () => {
    zoneRefetch();
  };

  useEffect(() => {
    zoneListRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (zoneData) {
      setZoneListData(zoneData);
    }
  }, [zoneData, total]);

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const toChoiceZone = (items: any[]) =>
    items.map((item) => ({
      id: item?.z_id,
      name: item?.z_name,
    }));

  const LoadingSpinner = () => {
    return (
      <>
        <div style={{ textAlign: "center", margin: "24px" }}>
          <CircularProgress />
          <p>Loading...</p>
        </div>
      </>
    );
  };
  return (
    <div
      style={{
        marginTop: "2rem",
      }}
    >
      {/* Inside Dhaka Filter buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button
            color="primary"
            variant={selectedZone === "regular" ? "contained" : "text"}
            onClick={(e) => {
              setSelectedZone("regular");
              setFilteredSearchedZone(null);
            }}
          >
            Regular Zone
          </Button>
          <Button
            color="primary"
            onClick={(e) => {
              setSelectedZone("express");
              setFilteredSearchedZone(null);
            }}
            variant={selectedZone === "express" ? "contained" : "text"}
          >
            Express Zone
          </Button>
          <SimpleForm toolbar={false}>
            <AutocompleteInput
              label="Filter by Zone"
              source="filter_zone_select"
              defaultValue={filteredSearchedZone}
              variant="outlined"
              onChange={(e) => {
                setFilteredSearchedZone(e);
              }}
              choices={!!zoneList ? toChoiceZone(zoneList) : []}
              //   allowEmpty
              helperText={false}
              //   resettable
            />
          </SimpleForm>
        </div>
        {permissions?.includes("zoneCreate") && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setOpenCreateZone(true);
            }}
          >
            Create Zone
          </Button>
        )}
      </div>

      {/* Render Zones */}
      {isLoading && <LoadingSpinner />}
      {zoneListData?.map((d: any) => (
        <ZoneCard
          refetch={refetchFunc}
          zoneData={d}
          zoneType={selectedZone}
          key={d?.id}
          allZoneList={zoneData}
          totalDataCount={total}
        />
      ))}

      <ZonePagination
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        total={total}
        currentPage={currentPage}
        handleChangePage={handleChangePage}
      />

      {/* Create zone modal */}
      {openCreateZone && (
        <CreateZone
          open={openCreateZone}
          onClose={handleClose}
          refetch={refetchFunc}
          zoneType={selectedZone}
          formType="create"
        />
      )}
    </div>
  );
}
