import { FC, useEffect, useState } from "react";
import { AutocompleteInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { Status } from "@/utils/enums";
import { logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";

type SubAreaInputProps = {
  locations: any;
  actionType?: any;
  isSubAreaRefresh: boolean;
  setLocations: (locations) => void;
  [key: string]: any;
};

const SubAreaInputAddress: FC<SubAreaInputProps> = ({
  locations,
  actionType = "edit",
  isSubAreaRefresh,
  setLocations,
  ...rest
}) => {
  const { values } = useWatch();
  const [subArea, setSubArea] = useState([]);
  const [locationId, setLocationId] = useState(0);

  const division =
    actionType === "create" ? values?.l_division : values?.l_division;
  const district =
    actionType === "create" ? values?.l_district : values?.l_district;
  const area = actionType === "create" ? values?.l_area : values?.l_area;

  useEffect(() => {
    setLocationId(
      locations &&
        division &&
        district &&
        area &&
        locations[division] &&
        locations[division][district] &&
        locations[division][district][area]
        ? locations[division][district][area]["l_id"]
        : 0
    );
  }, [locations, division, district, area]);
  useEffect(() => {
    if (locationId) {
      httpClient(`/v1/locationSubArea/${locationId}`, {})
        .then(({ json }: any) => {
          if (json.status === Status.SUCCESS) {
            setSubArea(json.data);
            fetchZoneNames(json.data);
          }
        })
        .catch((err) => logger(err));
    }
  }, [locationId, isSubAreaRefresh]);

  const fetchZoneNames = (subAreaData) => {
    const zoneIds = subAreaData.map((record) => record.sa_zone_id);
    try {
      httpClient(`/v1/zone?ids=${zoneIds?.toString()}`, {})
        .then((res: any) => {
          const zoneNamesMap = {};
          res?.json?.data?.forEach((zone) => {
            zoneNamesMap[zone.id] = zone.z_name;
          });
          const updatedSubArea = subAreaData.map((record) => ({
            ...record,
            z_name: zoneNamesMap[record.sa_zone_id],
          }));

          setSubArea(updatedSubArea);
        })
        .catch((err) => logger(err));
    } catch (error) {
      console.error("Error fetching zone names:", error);
    }
  };

  if (!locations) return null;

  return (
    <AutocompleteInput
      choices={!!subArea?.length ? subArea : []}
      defaultValue={
        actionType === "create"
          ? values.ul_sa_id
          : values?.full_shipping_address?.ul_sa_id
      }
      optionValue="sa_id"
      optionText={(record) =>
        record && record.sa_title && record.z_name
          ? `${record.sa_title} (${record.z_name})`
          : ""
      }
      helperText={false}
      {...rest}
    />
  );
};

export default SubAreaInputAddress;
