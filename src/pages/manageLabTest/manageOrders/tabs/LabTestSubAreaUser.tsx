import { Button, Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";

import { Status } from "@/utils/enums";
import { isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";
import LabSubAreaInput from "@/components/manageLabTest/order/LabSubAreaInput";
import LabAddnewSubArea from "@/components/manageLabTest/order/LabAddnewSubArea";

type UserTabProps = {
  permissions: string[];
  [key: string]: any;
};

const LabTestSubAreaUser: FC<UserTabProps> = ({
  permissions,
  setSubAreaId,
  hasSubArea,
  setHasSubArea,
  currentSubArea,
  setCurrentSubArea,
  page,
  ...rest
}) => {
  const { setValue } = useFormContext();
  const values = useWatch();

  const [locations, setLocations] = useState(null);
  const [subArea, setSubArea] = useState([]);
  const [isSubAreaRefresh, setIsSubAreaRefresh] = useState(false);

  const currentSubAreaMain = subArea?.find(
    (item) => item?.id == values?.userLocation?.subareaId
  );

  const [isAddNewSubAreaDialogOpen, setIsAddNewSubAreaDialogOpen] =
    useState(false);

  useEffect(() => {
    setCurrentSubArea(currentSubAreaMain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, currentSubArea, subArea, currentSubAreaMain]);

  useEffect(() => {
    const locationsFromStroage = sessionStorage.getItem("labLocations");
    if (locationsFromStroage) {
      setLocations(
        isJSONParsable(locationsFromStroage)
          ? JSON.parse(locationsFromStroage)
          : {}
      );
    } else {
      httpClient("/v1/allLocations/", { isBaseUrl: true })
        .then(({ json }: any) => {
          if (json.status === Status.SUCCESS) {
            setLocations(json.data);
            sessionStorage.setItem("labLocations", JSON.stringify(json.data));
          }
        })
        .catch((err) => logger(err));
    }
  }, []);
  useEffect(() => {
    setValue("userLocation", {
      ...values?.userLocation,
      district: values?.userLocation?.district,
      division: values?.userLocation?.division,
      area: values?.userLocation?.area,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubArea]);

  useEffect(() => {
    if (
      !!locations &&
      !!values?.userLocation?.division &&
      !!values?.userLocation?.district &&
      !!values?.userLocation?.area &&
      !!locations[values?.userLocation?.division] &&
      !!locations[values?.userLocation?.division][
        values?.userLocation?.district
      ] &&
      !!locations[values?.userLocation?.division][
        values?.userLocation?.district
      ][values?.userLocation?.area] &&
      !!locations[values?.userLocation?.division][
        values?.userLocation?.district
      ][values?.userLocation?.area]["l_has_subarea"]
    ) {
      setHasSubArea(true);
    } else {
      setHasSubArea(false);
      // form.change("full_shipping_address.ul_sa_id", "");
      setValue(
        "userLocation.subareaId",
        Number(values?.userLocation?.subareaId) || undefined
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values?.userLocation?.division,
    values?.userLocation?.district,
    values?.userLocation?.area,
    locations,
    values,
    page,
  ]);

  return (
    <Grid container spacing={2}>
      {hasSubArea && (
        <Grid item sm={6} md={page === "create" ? 12 : 6}>
          <Grid container>
            <Grid item sm={8} md={8}>
              <LabSubAreaInput
                source="userLocation.subareaId"
                label="Shipping Sub Area"
                variant="outlined"
                locations={locations}
                isSubAreaRefresh={isSubAreaRefresh}
                subArea={subArea}
                hasSubArea={hasSubArea}
                setSubArea={setSubArea}
                setLocations={setLocations}
                allowEmpty
                fullWidth
                onSelect={(item) => {
                  setSubAreaId(item);
                }}
              />
            </Grid>
            {permissions?.includes("subAreaCreate") && (
              <Grid item sm={4} md={4}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    marginTop: 10,
                    marginLeft: 3,
                  }}
                  onClick={() => {
                    setIsAddNewSubAreaDialogOpen(true);
                    setIsSubAreaRefresh(false);
                  }}
                >
                  Add New
                </Button>
              </Grid>
            )}
            <LabAddnewSubArea
              locations={locations}
              open={isAddNewSubAreaDialogOpen}
              setIsSubAreaRefresh={setIsSubAreaRefresh}
              handleClose={() => {
                setIsAddNewSubAreaDialogOpen(false);
              }}
              {...rest}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default LabTestSubAreaUser;
