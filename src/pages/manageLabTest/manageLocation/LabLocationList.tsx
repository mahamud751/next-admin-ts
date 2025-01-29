import { FC } from "react";
import { Datagrid, List, ListProps, TextField } from "react-admin";

import { useDocumentTitle, useExport } from "../../../hooks";
import LocationFilter from "./LabLocationFilter";

const LabLocationList: FC<ListProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga |Lab | Location List");
    const exporter = useExport(rest);
    return (
        <List
            {...rest}
            title="List of Lab Locations"
            resource="v1/location"
            perPage={25}
            sort={{ field: "l_id", order: "DESC" }}
            filters={<LocationFilter children={""} />}
            bulkActionButtons={false}
            exporter={exporter}
        >
            <Datagrid rowClick="show">
                <TextField source="l_id" label="Id" />
                <TextField source="l_division" label="Division" />
                <TextField source="l_district" label="District" />
                <TextField source="l_area" label="Area" />
                <TextField source="l_postcode" label="Postcode" />
                <TextField source="l_zone" label="Zone" />
            </Datagrid>
        </List>
    );
};

export default LabLocationList;
