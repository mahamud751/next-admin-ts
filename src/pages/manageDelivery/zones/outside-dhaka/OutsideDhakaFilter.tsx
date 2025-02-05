import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { SelectInput, SimpleForm } from "react-admin";
import { Status } from "@/utils/enums";
import { isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";

/*
    This props will pass to parent and from parent state values will pass to outside dhaka component
*/
type Props = {
  divisonOnChange: (val) => void;
  districtonOnChange: (val) => void;
  areaOnChange: (val) => void;
  courierOnChange: (val) => void;
  statusOnChange: (val) => void;
};

export default function OutsideDhakaFilter({
  divisonOnChange,
  districtonOnChange,
  areaOnChange,
  statusOnChange,
  courierOnChange,
}: Props) {
  const classes = useStyles();
  const [locations, setLocations] = useState(null);

  // This state to filter district in respect of divison
  const [filtered_division, setFiltered_division] = useState(null);
  const [filtered_district, setFiltered_district] = useState(null);

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

  const toChoices = (items = []) =>
    items?.map((item) => ({ id: item, name: item }));

  return (
    <>
      <div>
        <SimpleForm toolbar={false}>
          <div className={classes.outsideDhakaForm}>
            <SelectInput
              source="_division"
              label="Division"
              variant="outlined"
              choices={!!locations ? toChoices(Object.keys(locations)) : []}
              onChange={(e) => {
                setFiltered_division(e.target.value);
                divisonOnChange(e.target.value);
                districtonOnChange("");
                areaOnChange("");
              }}
              //   allowEmpty
            />
            <SelectInput
              source="_district"
              label="District"
              variant="outlined"
              choices={
                filtered_division
                  ? toChoices(Object.keys(locations[filtered_division]))
                  : []
              }
              onChange={(e) => {
                setFiltered_district(e.target.value);
                districtonOnChange(e.target.value);
                areaOnChange("");
              }}
              //   allowEmpty
            />
            <SelectInput
              source="search_area "
              label="Area"
              variant="outlined"
              choices={
                filtered_division && filtered_district
                  ? toChoices(
                      Object.keys(
                        locations[filtered_division][filtered_district]
                      )
                    )
                  : []
              }
              onChange={(e) => {
                areaOnChange(e.target.value);
              }}
              //   allowEmpty
            />
            <SelectInput
              source="3pl_method"
              placeholder="Select 3PL Method"
              choices={[
                { id: "redx", name: "RedX" },
                { id: "pathao", name: "Pathao" },
                { id: "ecourier", name: "eCourier" },
              ]}
              onChange={(e) => {
                courierOnChange(e.target.value);
              }}
              variant="outlined"
              //   allowEmpty
            />
            <SelectInput
              source="status"
              label="Status"
              variant="outlined"
              choices={[
                { id: "1", name: "Active" },
                { id: "0", name: "Inactive" },
              ]}
              onChange={(e) => {
                statusOnChange(e.target.value);
              }}
              //   allowEmpty
            />
          </div>
        </SimpleForm>
      </div>
    </>
  );
}

const useStyles = makeStyles(() => ({
  outsideDhakaForm: {
    display: "flex",
    gap: 4,
    marginTop: 20,
    marginBottom: 0,
    width: "100%",
  },
}));
