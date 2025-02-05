import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import {
  AutocompleteInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
} from "react-admin";
import { useFormState } from "react-final-form";

import { Status } from "@/utils/enums";
import {
  isJSONParsable,
  logger,
  userEmployeeInputTextRenderer,
} from "@/utils/helpers";
import { httpClient } from "@/utils/http";

import AddNewSubAreaAddress from "./AddNewSubAreaAddress";
import SubAreaInputAddress from "./SubAreaInputAddress";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import AddressTypeInput from "@/components/common/AddressTypeInput";
import DistrictInput from "@/components/manageOrder/DistrictInput";
import AreaInput from "@/components/manageOrder/AreaInput";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

const AddressCreateEdit = ({ permissions, ...rest }) => {
  const [isSubAreaRefresh, setIsSubAreaRefresh] = useState(false);
  const [hasSubArea, setHasSubArea] = useState(false);
  const [locations, setLocations] = useState(null);
  const [isAddNewSubAreaDialogOpen, setIsAddNewSubAreaDialogOpen] =
    useState(false);
  const { values } = useFormState();
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
  }, [values]);

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
      // form.change("full_shipping_address.ul_sa_id", '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const toChoices = (items: string[]) =>
    items.map((item: string) => ({ id: item, name: item }));

  return (
    <>
      <Grid item lg={4}>
        <ReferenceInput
          source="u_id"
          label="User"
          variant="outlined"
          helperText={false}
          reference="v1/users"
          //   validate={[required()]}
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
            // options={{
            //   InputProps: { multiline: true },
            // }}

            fullWidth
          />
        </ReferenceInput>
      </Grid>
      <Grid item lg={4}>
        <TextInput
          source="ul_name"
          label="Name"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <TextInput
          source="ul_mobile"
          label="Mobile"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <AddressTypeInput
          source="ul_type"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <SelectInput
          source="l_division"
          label="Division"
          variant="outlined"
          helperText={false}
          choices={!!locations ? toChoices(Object.keys(locations)) : []}
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <DistrictInput
          source="l_district"
          label="City"
          variant="outlined"
          helperText={false}
          locations={locations}
          actionType="create"
          setLocations={setLocations}
          allowEmpty
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <AreaInput
          source="l_area"
          label="Area"
          variant="outlined"
          helperText={false}
          locations={locations}
          actionType="create"
          setLocations={setLocations}
          allowEmpty
          fullWidth
        />
      </Grid>
      {hasSubArea && (
        <Grid item sm={6} md={4}>
          <Grid container>
            <Grid item sm={8} md={8}>
              <SubAreaInputAddress
                source="ul_sa_id"
                label="Sub Area"
                variant="outlined"
                locations={locations}
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
            <AddNewSubAreaAddress
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
      <Grid item lg={4}>
        <TextInput
          source="ul_address"
          label="Address"
          variant="outlined"
          helperText={false}
          validate={[required()]}
          multiline
          fullWidth
        />
      </Grid>
      <FormatedBooleanInput source="ul_default" label="Default" />
    </>
  );
};

export default AddressCreateEdit;
