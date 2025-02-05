import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ReferenceInput, SelectInput, TextInput, required } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type AddnewSubAreaProps = {
  locations: any;
  actionType?: any;
  open: boolean;
  setIsSubAreaRefresh: (boolean) => void;
  handleClose: () => void;
  [key: string]: any;
};

const AddNewSubAreaAddress: FC<AddnewSubAreaProps> = ({
  locations,
  actionType = "edit",
  open,
  setIsSubAreaRefresh,
  handleClose,
  ...rest
}) => {
  const values = useWatch();
  const { setValue } = useFormContext();
  const [zone, setZone] = useState([]);
  const [expZone, setExpZone] = useState([]);

  const division =
    actionType === "create" ? values?.l_division : values?.l_division;
  const district =
    actionType === "create" ? values?.l_district : values?.l_district;
  const area = actionType === "create" ? values?.l_area : values?.l_area;

  const sa_l_id =
    locations &&
    division &&
    district &&
    area &&
    locations[division] &&
    locations[division][district] &&
    locations[division][district][area]
      ? locations[division][district][area]["l_id"]
      : 0;

  const { data: location } = useRequest(
    `/v1/SubArea?_l_id=${sa_l_id}`,
    {},
    {
      isSuccessNotify: false,
      isWarningNotify: false,
      isPreFetching: true,
      refreshDeps: [sa_l_id],
    }
  );
  useEffect(() => {
    if (location && location.length) {
      let uniqueZoneIds = [
        ...new Set(
          location
            .map((obj) => obj.sa_zone_id)
            .filter(
              (value) => value !== "" && value !== null && value !== undefined
            )
        ),
      ];
      let uniqueExpZoneIds = [
        ...new Set(
          location
            .map((obj) => obj.sa_exp_zone_id)
            .filter(
              (value) => value !== "" && value !== null && value !== undefined
            )
        ),
      ];
      setZone(uniqueZoneIds);
      setExpZone(uniqueExpZoneIds);
    } else {
      setZone([]);
      setExpZone([]);
    }
  }, [location]);

  const {
    data: subAreaData,
    isLoading,
    refetch,
  } = useRequest(
    `/v1/subArea`,
    {
      method: "POST",
      body: {
        sa_l_id: sa_l_id,
        sa_title: values.sa_title,
        sa_zone_id: values.sa_zone_id,
        sa_exp_zone: values.sa_exp_zone,
        sa_status: 1,
      },
    },
    {
      onSuccess: () => handleClose(),
    }
  );
  useEffect(() => {
    setValue("sa_title", "");
    if (open) {
      setValue("sa_title", "");
      setValue("sa_zone_id", "");
      setValue("sa_exp_zone", "");
    }
  }, [open, setValue]);

  useEffect(() => {
    if (subAreaData && subAreaData.sa_id) {
      setIsSubAreaRefresh(true);
      setValue("ul_sa_id", subAreaData.sa_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subAreaData]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle>Add new sub area</DialogTitle>
      <DialogContent>
        <TextInput
          source="sa_title"
          label="Sub area name"
          variant="outlined"
          validate={[required()]}
          style={{ width: "100%" }}
          fullWidth
          autoComplete="off"
        />
        <ReferenceInput
          source="sa_zone_id"
          label="Zone"
          reference="v1/zone"
          variant="outlined"
          fullWidth
          filter={{
            ids: zone.toString(),
          }}
        >
          <SelectInput optionText="z_name" choices={zone} />
        </ReferenceInput>
        <ReferenceInput
          source="sa_exp_zone"
          label="Exp Zone"
          reference="v1/zone"
          variant="outlined"
          fullWidth
          filter={{ ids: expZone.toString() }}
        >
          <SelectInput optionText="z_name" choices={expZone} />
        </ReferenceInput>
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        confirmLabel="Submit"
        onDialogClose={handleClose}
        disabled={!values.sa_title || !values.sa_zone_id || !values.sa_exp_zone}
        onConfirm={refetch}
      />
    </Dialog>
  );
};

export default AddNewSubAreaAddress;
