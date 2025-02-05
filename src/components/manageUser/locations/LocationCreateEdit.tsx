import { Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
  AutocompleteInput,
  Button,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  required,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { Status } from "@/utils/enums";
import { logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";

import AreaLocationInputProps from "./AreaLocationInputProps";
import DistrictLocationInputProps from "./DistrictLocationInputProps";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";

type LocationCreateEditProps = {
  page: "create" | "edit";
  zoneData?: any;
};

const LocationCreateEdit: FC<LocationCreateEditProps> = ({
  zoneData,
  page,
}) => {
  const [locations, setLocations] = useState(null);
  const [newArea, setNewArea] = useState(null);
  const [updateArea, setAreaUpdate] = useState(false);
  const [inputValue, setInputValue] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm();
  const { values } = useFormState();

  useEffect(() => {
    httpClient("/v1/allLocations/", { isBaseUrl: true })
      .then(({ json }: any) => {
        if (json.status === Status.SUCCESS) {
          setLocations(json.data);
          sessionStorage.setItem("locations", JSON.stringify(json.data));
        }
      })
      .catch((err) => logger(err));
  }, []);

  const toChoiceDivisions = (items: string[]) =>
    items.map((item) => ({
      id: item,
      name: item,
    }));

  const handleAreaButtonClick = () => {
    setAreaUpdate(true);
  };

  const handleCancelAreaButtonClick = () => {
    setAreaUpdate(false);
  };

  const onChange = (newValue) => {
    setNewArea(newValue);
  };

  const handleInputChangeOnCreate = (event) => {
    const existingLocation = locations[values.l_division][values.l_district];

    const match = filterKeysByValue(existingLocation, event);

    // If there's a match, display a message
    if (match.length !== 0) {
      setInputValue(true);
      //@ts-ignore
      setMessage(match);
    } else {
      setInputValue(false); // Clear the message if there's no match
      // setShowMessage(false);
    }
  };

  function filterKeysByValue(obj, valueToFind) {
    const filteredKeys = [];
    for (const key in obj) {
      if (key.toLowerCase() === valueToFind || key === valueToFind) {
        filteredKeys.push(key);
      }
    }
    return filteredKeys;
  }

  // initial state with values from api
  const [logistic_config_form, setLogistic_config_form] = useState({
    redx_area_id: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.redx?.area_id
      : "",
    redx_status: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.redx?.status
      : 0,

    pathao_city_id: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.pathao?.city_id
      : "",
    pathao_zone_id: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.pathao?.zone_id
      : "",
    pathao_status: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.pathao?.status
      : 0,

    ecourier_district: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.ecourier?.district
      : "",
    ecourier_thana: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.ecourier?.thana
      : "",
    ecourier_area: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.ecourier?.area
      : "",
    ecourier_postcode: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.ecourier?.postcode
      : "",
    ecourier_hub: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.ecourier?.hub
      : "",
    ecourier_status: values?.l_logistic_config
      ? JSON.parse(values?.l_logistic_config)?.ecourier?.status
      : 1,
  });

  const handleLogisticConfigChange = (e) => {
    const { name, value } = e.target;
    setLogistic_config_form((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    page === "create" && form.change("l_status", 0);
    form.change(
      "l_logistic_config",
      JSON.stringify({
        redx: {
          area_id: logistic_config_form.redx_area_id,
          status: logistic_config_form.redx_status,
        },
        pathao: {
          city_id: logistic_config_form.pathao_city_id,
          zone_id: logistic_config_form.pathao_zone_id,
          status: logistic_config_form?.pathao_status,
        },
        ecourier: {
          district: logistic_config_form.ecourier_district,
          thana: logistic_config_form.ecourier_thana,
          area: logistic_config_form.ecourier_area,
          postcode: logistic_config_form.ecourier_postcode,
          hub: logistic_config_form.ecourier_hub,
          status: 1,
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logistic_config_form, values]);

  const pathaoValidation = (value: any) => {
    const { l_district } = form?.getState()?.values;
    if (l_district !== "Dhaka City") {
      return required()(value, values);
    }
    return undefined;
  };

  return (
    <>
      <Grid item lg={4}>
        <SelectInput
          source="l_division"
          label="Division"
          variant="outlined"
          choices={!!locations ? toChoiceDivisions(Object.keys(locations)) : []}
          validate={[required()]}
          fullWidth
          onChange={() => setInputValue(false)}
        />
      </Grid>
      <Grid item lg={4}>
        <DistrictLocationInputProps
          source="l_district"
          label="District"
          variant="outlined"
          validate={[required()]}
          locations={locations}
          setLocations={setLocations}
          allowEmpty
          fullWidth
        />
        {/* )} */}
      </Grid>
      <Grid item lg={4}>
        {page === "create" && (
          <TextInput
            source="l_area"
            label="Area"
            variant="outlined"
            validate={[required()]}
            fullWidth
            onChange={(e) => handleInputChangeOnCreate(e.target.value)}
            disabled={!values.l_division && !values.l_district}
          />
        )}
        {inputValue && (
          <span>
            <strong style={{ color: "green" }}>{message}</strong> is already
            exist.
          </span>
        )}
        {!updateArea && page === "edit" && (
          <AreaLocationInputProps
            source="l_area"
            label="Area"
            variant="outlined"
            validate={[required()]}
            locations={locations}
            setLocations={setLocations}
            allowEmpty
            fullWidth
            onChange={onChange}
          />
        )}

        {updateArea && (
          <TextInput
            source="l_area"
            label="Rename Area"
            variant="outlined"
            validate={[required()]}
            value={newArea}
            resettable
            fullWidth
          />
        )}
        {updateArea && (
          <Button
            variant="outlined"
            label="Cancel"
            style={{
              marginBottom: 20,
              display: "block",
              borderColor: "red",
              color: "red",
            }}
            onClick={handleCancelAreaButtonClick}
          />
        )}
        {!updateArea && page === "edit" && (
          <Button
            variant="outlined"
            label="Rename Area"
            style={{ marginBottom: 20, marginRight: 20 }}
            onClick={handleAreaButtonClick}
          />
        )}
      </Grid>

      <Grid>
        <Grid item lg={4}>
          <NumberInput
            source="l_postcode"
            label="Postcode"
            variant="outlined"
            fullWidth
            validate={[required()]}
          />
        </Grid>
      </Grid>
      <Grid item lg={4}>
        <ReferenceInput
          source="l_zone_id"
          label="Zone"
          reference="v1/zone"
          variant="outlined"
          fullWidth
          //   validate={[required()]}
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionText={(value) => (value && value?.z_name) || ""}
          />
        </ReferenceInput>
      </Grid>
      {page === "edit" && (
        <Grid item lg={4}>
          <SelectInput
            source="l_status"
            label="Status"
            variant="outlined"
            choices={[
              { name: "Active", id: 1 },
              { name: "Inactive", id: 0 },
            ]}
            fullWidth
          />
        </Grid>
      )}
      <Grid item lg={4}>
        <TaxonomiesByVocabularyInput
          fetchKey="courier"
          source="l_courier"
          label="Courier"
          fullWidth
          defaultValue={"arogga"}
          validate={[required()]}
        />
      </Grid>
      <Grid item lg={4}>
        <TextInput
          source="l_de_id"
          label="Delivery ID"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <TextInput
          source="l_lat"
          label="Latitude"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item lg={4}>
        <TextInput
          source="l_long"
          label="Longitude"
          variant="outlined"
          fullWidth
          helperText={false}
        />
      </Grid>

      {/* Logistic config field goes here */}
      {/* eCourier */}
      <Grid item lg={4}>
        <h5 style={{ marginBottom: "0px" }}>eCourier</h5>
        <TextInput
          source="ecourier_district"
          label="eCourier District"
          variant="outlined"
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={logistic_config_form?.ecourier_district}
          validate={[required()]}
          fullWidth
          helperText={false}
        />
        <TextInput
          source="ecourier_thana"
          label="eCourier Thana"
          variant="outlined"
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={logistic_config_form?.ecourier_thana}
          validate={[required()]}
          fullWidth
          helperText={false}
        />
        <TextInput
          source="ecourier_area"
          label="eCourier Area"
          variant="outlined"
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={logistic_config_form?.ecourier_area}
          validate={[required()]}
          fullWidth
          helperText={false}
        />
        <NumberInput
          source="ecourier_postcode"
          label="eCourier Postcode"
          variant="outlined"
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={logistic_config_form?.ecourier_postcode}
          validate={[required()]}
          fullWidth
          helperText={false}
        />
        <NumberInput
          source="ecourier_hub"
          label="eCourier Hub ID"
          variant="outlined"
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={logistic_config_form?.ecourier_hub}
          validate={[required()]}
          fullWidth
          helperText={false}
        />
        <SelectInput
          source="ecourier_status"
          label="eCourier Status"
          variant="outlined"
          choices={[
            { name: "Active", id: 1 },
            { name: "Inactive", id: 0 },
          ]}
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={logistic_config_form?.ecourier_status}
          validate={[required()]}
          fullWidth
          helperText={false}
        />
      </Grid>

      {/* Pathao */}
      <Grid item lg={4}>
        <h5 style={{ marginBottom: "0px" }}>Pathao</h5>
        <NumberInput
          source="pathao_city_id"
          label="Pathao City ID"
          variant="outlined"
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={logistic_config_form?.pathao_city_id}
          validate={pathaoValidation}
          fullWidth
          helperText={false}
        />
        <NumberInput
          source="pathao_zone_id"
          label="Pathao Zone ID"
          variant="outlined"
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={logistic_config_form?.pathao_zone_id}
          validate={pathaoValidation}
          fullWidth
          helperText={false}
        />

        <SelectInput
          source="pathao_status"
          label="Pathao Status"
          variant="outlined"
          choices={[
            { name: "Active", id: 1 },
            { name: "Inactive", id: 0 },
          ]}
          onChange={(e) => handleLogisticConfigChange(e)}
          defaultValue={
            values?.l_logistic_config &&
            JSON.parse(values?.l_logistic_config)?.pathao?.status
          }
          fullWidth
          helperText={false}
        />
      </Grid>

      {/* Redx */}
      <Grid item lg={4}>
        <h5 style={{ marginBottom: "0px" }}>Redx</h5>
        <NumberInput
          source="redx_area_id"
          label="Redx Area ID"
          variant="outlined"
          onChange={(e) => handleLogisticConfigChange(e)}
          fullWidth
          defaultValue={logistic_config_form?.redx_area_id}
          helperText={false}
        />
        <SelectInput
          source="redx_status"
          label="Redx Status"
          defaultValue={logistic_config_form?.redx_status}
          variant="outlined"
          choices={[
            { name: "Active", id: 1 },
            { name: "Inactive", id: 0 },
          ]}
          onChange={(e) => handleLogisticConfigChange(e)}
          fullWidth
          helperText={false}
        />
      </Grid>
    </>
  );
};

export default LocationCreateEdit;
