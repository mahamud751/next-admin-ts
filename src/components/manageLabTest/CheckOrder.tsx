import { Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BooleanInput,
  Confirm,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
  usePermissions,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { Status } from "@/utils/enums";
import { isEmpty, isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";

import LabTestSubAreaUser from "../../pages/manageLabTest/manageOrders/tabs/LabTestSubAreaUser";
import AddressTypeInput from "../common/AddressTypeInput";
import AreaInput from "./AreaInput";
import DistrictInput from "./DistrictInputProps";
import UserLocationAutocompleteInput from "./order/UserLocationAutocompleteInput";

const CheckOrder = ({
  isUserChecked,
  locations,
  setLocations,
  setHasLocationField,
  setSubAreaId,
  hasSubArea,
  setHasSubArea,
  currentSubArea,
  setCurrentSubArea,
}) => {
  const { permissions } = usePermissions();
  const { setValue, control } = useFormContext();
  const formValues = useWatch({ control });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toChoiceDivisions = (items: string[]) =>
    items.map((item) => ({
      id: item,
      name: item,
    }));

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
    if (formValues?.userLocation) {
      setValue("o_ul_id", undefined);
    }
  }, [formValues]);

  return (
    <div>
      <>
        <Grid container spacing={1}>
          {isUserChecked && (
            <>
              <Grid item xl={4}>
                <TextInput
                  source="u_name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </>
          )}
          {!isEmpty(formValues.user) && (
            <>
              <Grid item md={8}>
                <Grid container spacing={1}>
                  {formValues?.userLocation == undefined && (
                    <Grid item md={8}>
                      {" "}
                      <ReferenceInput
                        source="o_ul_id"
                        label="Location"
                        variant="outlined"
                        reference="v1/userLocations"
                        filter={{
                          _orderBy: "ul_default",
                          u_id: formValues.user?.u_id,
                        }}
                        emptyText="Add New Location"
                        allowEmpty
                        fullWidth
                      >
                        <UserLocationAutocompleteInput
                          matchSuggestion={() => true}
                          optionValue="ul_id"
                          helperText={false}
                          setHasLocationField={setHasLocationField}
                          resettable
                        />
                      </ReferenceInput>
                    </Grid>
                  )}

                  <Grid item md={4}>
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setIsDialogOpen(true);
                      }}
                      style={{ marginTop: 12 }}
                    >
                      {formValues?.userLocation == undefined
                        ? "Add New Location"
                        : "Update Location"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {/* <FormSpy
            subscription={{ values: true }}
            onChange={({ values }) =>
              setTimeout(() => {
                setFormValues(values);
              }, 0)
            }
          /> */}
        </Grid>
      </>

      <Confirm
        isOpen={isDialogOpen}
        title={`Are you sure you want to create a new address?`}
        content={
          <>
            <>
              <TextInput
                source="userLocation.mobileNumber"
                label="Mobile Number"
                variant="outlined"
                validate={[required()]}
                fullWidth
              />
              <SelectInput
                variant="outlined"
                label="Division"
                source="userLocation.division"
                alwaysOn
                choices={
                  !!locations ? toChoiceDivisions(Object.keys(locations)) : []
                }
                fullWidth
              />
              <DistrictInput
                source="userLocation.district"
                label="District"
                variant="outlined"
                validate={[required()]}
                locations={locations}
                setLocations={setLocations}
                allowEmpty
                fullWidth
              />
              <AreaInput
                source="userLocation.area"
                label="Shipping Area"
                variant="outlined"
                validate={[required()]}
                locations={locations}
                setLocations={setLocations}
                allowEmpty
                fullWidth
              />
              <LabTestSubAreaUser
                permissions={permissions}
                setSubAreaId={setSubAreaId}
                hasSubArea={hasSubArea}
                setHasSubArea={setHasSubArea}
                currentSubArea={currentSubArea}
                setCurrentSubArea={setCurrentSubArea}
                page="create"
              />
              <TextInput
                source="userLocation.address"
                label="Address"
                variant="outlined"
                validate={[required()]}
                fullWidth
              />
            </>

            <AddressTypeInput
              source="userLocation.type"
              variant="outlined"
              validate={[required()]}
              allowEmpty
              fullWidth
            />
            <BooleanInput
              source="userLocation.isDefault"
              label="Default"
              defaultValue={true}
              fullWidth
            />
          </>
        }
        onConfirm={() => {
          setIsDialogOpen(false);
        }}
        onClose={() => {
          setValue("userLocation", undefined);
          setIsDialogOpen(false);
        }}
        confirmColor="primary"
        cancel="Clear Address"
      />
    </div>
  );
};

export default CheckOrder;
