import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { SelectInput, TextInput, required } from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { useRequest } from "../../../hooks";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type AddnewSubAreaProps = {
  locations: any;
  actionType?: any;
  open: boolean;
  setIsSubAreaRefresh: (boolean) => void;
  handleClose: () => void;
  [key: string]: any;
};

const LabAddnewSubArea: FC<AddnewSubAreaProps> = ({
  locations,
  actionType = "edit",
  open,
  setIsSubAreaRefresh,
  handleClose,
  ...rest
}) => {
  const { values } = useFormState();
  const form = useForm();
  const [zone, setZone] = useState([]);
  const [expZone, setExpZone] = useState([]);

  const division =
    actionType === "create" ? values?.division : values?.userLocation?.division;
  const district =
    actionType === "create" ? values?.district : values?.userLocation?.district;
  const area =
    actionType === "create" ? values?.area : values?.userLocation?.area;

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
      let uniqueZoneNames = [
        ...new Set(
          location
            .map((obj) => obj.sa_zone)
            .filter(
              (value) => value !== "" && value !== null && value !== undefined
            )
        ),
      ];
      let uniqueExpZoneNames = [
        ...new Set(
          location
            .map((obj) => obj.sa_exp_zone)
            .filter(
              (value) => value !== "" && value !== null && value !== undefined
            )
        ),
      ];
      setZone(uniqueZoneNames.map((item) => ({ id: item, name: item })));
      setExpZone(uniqueExpZoneNames.map((item) => ({ id: item, name: item })));
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
        sa_zone: values.sa_zone,
        sa_exp_zone: values.sa_exp_zone,
        sa_status: 1,
      },
    },
    {
      onSuccess: () => handleClose(),
    }
  );
  useEffect(() => {
    form.change("sa_title", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (subAreaData && subAreaData.sa_id) {
      setIsSubAreaRefresh(true);
      form.change("userLocation.subareaId", subAreaData.sa_id);
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
        <SelectInput
          source="sa_zone"
          label="Zone Name"
          variant="outlined"
          helperText={false}
          choices={zone}
          validate={[required()]}
          style={{ width: "100%" }}
          fullWidth
        />
        <SelectInput
          source="sa_exp_zone"
          label="Exp Zone Name"
          variant="outlined"
          helperText={false}
          choices={expZone}
          validate={[required()]}
          style={{ width: "100%" }}
          fullWidth
        />
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        confirmLabel="Submit"
        onDialogClose={handleClose}
        disabled={!values.sa_title || !values.sa_zone || !values.sa_exp_zone}
        onConfirm={refetch}
      />
    </Dialog>
  );
};

export default LabAddnewSubArea;
