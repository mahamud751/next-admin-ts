import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { SelectInput, SimpleForm, Title } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import InsideDhakaIndex from "./inside-dhaka/Index";
import OutsideDhakaIndex from "./outside-dhaka/Index";
import OutsideDhakaFilter from "./outside-dhaka/OutsideDhakaFilter";

export default function Zone() {
  const classes = useStyles();

  useDocumentTitle("Arogga | Zone");
  const [selectedZone, setSelectedZone] = useState("inside_dhaka");

  // Filter states
  const [filtered_division, setFiltered_division] = useState("");
  const [filtered_district, setFiltered_district] = useState("");
  const [filtered_area, setFiltered_area] = useState("");
  const [filtered_status, setFiltered_status] = useState("");
  const [filtered_courier, setFiltered_courier] = useState("");

  useEffect(() => {
    setFiltered_division("");
    setFiltered_district("");
    setFiltered_area("");
    setFiltered_status("");
  }, [selectedZone]);

  return (
    <>
      <Title title={selectedZone === "inside_dhaka" ? "Inside Dhaka" : ""} />
      <div className={classes.root}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <h2>
            {selectedZone === "inside_dhaka" && "Inside Dhaka"}
            {selectedZone === "outside_dhaka" && "Outside Dhaka"}
          </h2>
          <SimpleForm toolbar={false}>
            <SelectInput
              source="zone"
              choices={[
                { id: "inside_dhaka", name: "Inside Dhaka" },
                { id: "outside_dhaka", name: "Outside Dhaka" },
              ]}
              onChange={(e: any) => setSelectedZone(e.target.value)}
              defaultValue={selectedZone}
              variant="outlined"
              helperText={false}
              style={{ width: "50%" }}
            />
          </SimpleForm>
          {selectedZone === "outside_dhaka" && (
            <OutsideDhakaFilter
              divisonOnChange={setFiltered_division}
              districtonOnChange={setFiltered_district}
              areaOnChange={setFiltered_area}
              statusOnChange={setFiltered_status}
              courierOnChange={setFiltered_courier}
            />
          )}
        </div>
        {selectedZone === "inside_dhaka" && <InsideDhakaIndex />}
        {selectedZone === "outside_dhaka" && (
          <OutsideDhakaIndex
            f_divison={filtered_division}
            f_district={filtered_district}
            f_area={filtered_area}
            f_status={filtered_status}
            f_courier={filtered_courier}
          />
          // <OutsideDhakaTest />
        )}
      </div>
    </>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 0,
  },
  outsideDhakaForm: {
    display: "flex",
    gap: 4,
    marginBottom: 0,
    width: "100%",
  },
}));
