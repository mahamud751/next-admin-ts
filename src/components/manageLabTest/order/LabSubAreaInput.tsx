import { FC, useEffect, useState } from "react";
import { AutocompleteInput } from "react-admin";
import { useForm, useFormState } from "react-final-form";

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

const LabSubAreaInput: FC<SubAreaInputProps> = ({
  locations,
  actionType = "edit",
  isSubAreaRefresh,
  setLocations,
  hasSubArea,
  subArea,
  setSubArea,
  ...rest
}) => {
  const form = useForm();
  const { values } = useFormState();

  useEffect(() => {
    form.change("userLocation", {
      ...values?.userLocation,
      subareaId: values?.userLocation?.subareaId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubArea]);

  const [locationId, setLocationId] = useState(0);
  const division =
    actionType === "create" ? values?.division : values?.userLocation?.division;
  const district =
    actionType === "create" ? values?.district : values?.userLocation?.district;
  const area =
    actionType === "create" ? values?.area : values?.userLocation?.area;

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
          }
        })
        .catch((err) => logger(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, isSubAreaRefresh]);

  if (!locations) return null;

  return (
    <AutocompleteInput
      choices={!!subArea?.length ? subArea : []}
      optionValue="sa_id"
      optionText={(record) =>
        record && record?.sa_title && record?.sa_zone
          ? `${record?.sa_title} (${record?.sa_zone})`
          : ""
      }
      helperText={false}
      //   resettable
      {...rest}
    />
  );
};

export default LabSubAreaInput;
