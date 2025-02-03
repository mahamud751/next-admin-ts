import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SelectInput, TextInput, usePermissions } from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { useRequest } from "@/hooks";
import { Status } from "@/utils/enums";
import { isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";

import AddressTypeInput from "@/components/common/AddressTypeInput";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";
import SubAreaInput from "@/components/manageOrder/SubAreaInput";
import LabUpdateDistrictInput from "./LabUpdateDistrictInput";
import LabUpdateAreaInput from "./LabUpdateAreaInput";
import AddnewSubArea from "@/components/manageOrder/AddnewSubArea";

const LabLocationCreateModal = ({ open, setOpenDialog }) => {
  const { values } = useFormState();
  const { permissions } = usePermissions();
  const [locations, setLocations] = useState(null);
  const [isAddNewSubAreaDialogOpen, setIsAddNewSubAreaDialogOpen] =
    useState(false);
  const [isSubAreaRefresh, setIsSubAreaRefresh] = useState(false);
  const [hasSubArea, setHasSubArea] = useState(false);
  const form = useForm();
  const toChoices = (items: string[]) =>
    items.map((item: string) => ({ id: item, name: item }));

  const { isLoading, refetch } = useRequest(
    `/lab-order/api/v1/admin/orders/${values?.id}/location`,
    {
      method: "PUT",
      body: {
        division: values.l_division,
        district: values.l_district,
        area: values.l_area,
        subareaId: values.ul_sa_id,
        name: values.ul_name,
        mobileNumber: values.ul_mobile,
        type: values.ul_type,
        address: values.ul_address,
      },
    },
    {
      onSuccess: ({ data }) => {
        setOpenDialog(false);
        reset();
      },
      isSuccessNotify: false,
    }
  );

  useEffect(() => {
    const locationsFromStroage = sessionStorage.getItem("locations");

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
            sessionStorage.setItem("locations", JSON.stringify(json.data));
          }
        })
        .catch((err) => logger(err));
    }
  }, []);

  useEffect(() => {
    if (
      !!locations &&
      !!values?.l_division &&
      !!values?.l_district &&
      !!values?.l_area &&
      !!locations[values?.l_division] &&
      !!locations[values?.l_division][values?.l_district] &&
      !!locations[values?.l_division][values?.l_district][values?.l_area] &&
      !!locations[values?.l_division][values?.l_district][values?.l_area][
        "l_has_subarea"
      ]
    ) {
      setHasSubArea(true);
    } else {
      setHasSubArea(false);
      form.change("ul_sa_id", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.l_division, values?.l_district, values?.l_area, locations]);

  const reset = () => {
    ["l_id", "ul_type", "ul_address"].forEach(
      (key) => (values[key] = undefined)
    );
  };

  return (
    <Dialog open={open} style={{ height: 800 }}>
      <DialogTitle>
        <Typography>Create new user location</Typography>
      </DialogTitle>
      <DialogContent>
        <TextInput
          source="ul_name"
          label="Shipping Name"
          variant="outlined"
          fullWidth
        />

        <TextInput
          source="ul_mobile"
          label="Shipping Mobile"
          variant="outlined"
          fullWidth
          defaultValue={values?.mobileNumber}
        />

        <AddressTypeInput
          source="ul_type"
          variant="outlined"
          allowEmpty
          fullWidth
        />

        <SelectInput
          source="l_division"
          label="Shipping Division"
          variant="outlined"
          choices={!!locations ? toChoices(Object.keys(locations)) : []}
          //   allowEmpty
          fullWidth
        />
        <LabUpdateDistrictInput
          source="l_district"
          label="Shipping City"
          variant="outlined"
          helperText={false}
          locations={locations}
          actionType="create"
          setLocations={setLocations}
          allowEmpty
          fullWidth
        />
        <LabUpdateAreaInput
          source="l_area"
          label="Shipping Area"
          variant="outlined"
          helperText={false}
          locations={locations}
          actionType="create"
          setLocations={setLocations}
          allowEmpty
          fullWidth
        />
        {hasSubArea && (
          <Grid container>
            <Grid item sm={8} md={8}>
              <SubAreaInput
                source="ul_sa_id"
                label="Shipping Sub Area"
                variant="outlined"
                locations={locations}
                actionType="create"
                isSubAreaRefresh={isSubAreaRefresh}
                setLocations={setLocations}
                translateChoice={false}
                allowEmpty
                fullWidth
              />
            </Grid>
            {permissions?.includes("subAreaCreate") && (
              <Grid item sm={4} md={4}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 10, marginLeft: 3 }}
                  onClick={() => {
                    setIsAddNewSubAreaDialogOpen(true);
                    setIsSubAreaRefresh(false);
                  }}
                >
                  Add New
                </Button>
              </Grid>
            )}
            <AddnewSubArea
              locations={locations}
              actionType="create"
              open={isAddNewSubAreaDialogOpen}
              setIsSubAreaRefresh={setIsSubAreaRefresh}
              handleClose={() => {
                setIsAddNewSubAreaDialogOpen(false);
              }}
            />
          </Grid>
        )}
        <TextInput
          source="ul_address"
          label="Shipping Home Address"
          variant="outlined"
          minRows={2}
          multiline
          fullWidth
        />
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={() => {
          setOpenDialog(false);
          reset();
        }}
        onConfirm={refetch}
        disabled={
          !values.ul_name ||
          !values.ul_mobile ||
          !values.l_division ||
          !values.l_district ||
          !values.l_area ||
          !values.ul_type ||
          !values.ul_address
        }
      />
    </Dialog>
  );
};

export default LabLocationCreateModal;
