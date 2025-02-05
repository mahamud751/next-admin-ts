import { FC } from "react";
import {
    BooleanField,
    Datagrid,
    List,
    ListProps,
    TextField,
} from "react-admin";

import {
    useDocumentTitle,
    useExport,
    useNavigateFromList,
} from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import ShiftFilter from "./ShiftFilter";

const ShiftList: FC<ListProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Shift List");

    const exporter = useExport(rest);
    const classes = useAroggaStyles();
    const navigateFromList = useNavigateFromList("shiftView", "shiftEdit");

    return (
        <List
            {...rest}
            title="List of Shift"
            filters={<ShiftFilter children={""} />}
            perPage={25}
            sort={{ field: "s_id", order: "DESC" }}
            exporter={exporter}
            bulkActionButtons={false}
        >
            <Datagrid rowClick={navigateFromList}>
                <TextField source="s_id" label="ID" />
                <TextField source="s_title" label="Title" />
                <TextField source="s_time_start" label="Start Time" />
                <TextField source="s_time_end" label="End Time" />
                <TextField
                    source="s_shift_type"
                    label="Type"
                    className={classes.capitalize}
                />
                <BooleanField
                    source="s_is_active"
                    label="Active?"
                    FalseIcon={() => null}
                    looseValue
                />
            </Datagrid>
        </List>
    );
};

export default ShiftList;
