import { FC } from "react";
import {
    BooleanField,
    CloneButton,
    FunctionField,
    List,
    ListProps,
    NumberField,
    Record,
    ReferenceField,
    TextField,
} from "react-admin";
import { ColorField } from "react-admin-color-input";

import AroggaDateField from "../../../components/AroggaDateField";
import CustomChipField from "../../../components/CustomChipField";
import {
    useDocumentTitle,
    useExport,
    useNavigateFromList,
} from "../../../hooks";
import { CustomizableDatagrid } from "../../../lib";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import BlockFilter from "./BlockFilter";

const BlockList: FC<ListProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Block List");

    const exporter = useExport(rest);
    const classes = useAroggaStyles();
    const navigateFromList = useNavigateFromList("blockView", "blockEdit");

    return (
        <List
            {...rest}
            title="List of Block"
            perPage={25}
            filters={<BlockFilter children={""} />}
            sort={{ field: "b_id", order: "DESC" }}
            filter={{
                _excludeFields: "b_config",
            }}
            exporter={exporter}
            bulkActionButtons={permissions?.includes("blockDelete")}
        >
            <CustomizableDatagrid
                rowClick={navigateFromList}
                hideableColumns={[
                    "b_subtitle",
                    "b_view_detail_link",
                    "b_color_code",
                    "b_per_page",
                    "b_infinity",
                    "b_description",
                    "b_created_at",
                    "b_created_by",
                ]}
            >
                <TextField source="b_id" label="ID" />
                <TextField source="b_title" label="Title" />
                <TextField source="b_subtitle" label="Subtitle" />
                <TextField source="b_machine_name" label="Machine Name" />
                <NumberField source="b_weight" label="Weight" />
                <TextField
                    source="b_type"
                    label="Type"
                    className={classes.capitalize}
                />
                <ReferenceField
                    source="b_region_id"
                    label="Region"
                    reference="v1/region"
                    sortBy="b_region_id"
                    link="show"
                >
                    <TextField source="r_name" />
                </ReferenceField>
                <TextField source="b_display_type" label="Display Type" />
                <CustomChipField
                    source="b_device_type"
                    label="Device Type"
                    page="list"
                />
                <TextField
                    source="b_view_detail_link"
                    label="View Detail Link"
                />
                <AroggaDateField source="b_start_date" label="Start Date" />
                <AroggaDateField source="b_end_date" label="End Date" />
                <ColorField source="b_color_code" label="Color Code" />
                <TextField source="b_per_page" label="Per Page" />
                <BooleanField
                    source="b_infinity"
                    label="Infinity?"
                    FalseIcon={() => null}
                    looseValue
                />
                <FunctionField
                    source="b_status"
                    label="Status"
                    render={(record: Record) => (
                        <span
                            className={`${classes.capitalize} ${
                                record.b_status === "inactive" &&
                                classes.textRed
                            }`}
                        >
                            {record?.b_status}
                        </span>
                    )}
                />
                <TextField source="b_description" label="Description" />
                <AroggaDateField source="b_created_at" label="Created At" />
                <ReferenceField
                    source="b_created_by"
                    label="Created By"
                    reference="v1/users"
                    sortBy="r_created_by"
                    link="show"
                >
                    <TextField source="u_name" />
                </ReferenceField>
                <FunctionField
                    label="Clone"
                    render={(record: Record) => (
                        // @ts-ignore
                        <CloneButton
                            {...rest}
                            record={{ ...record, isCloneActionFrom: true }}
                        />
                    )}
                />
            </CustomizableDatagrid>
        </List>
    );
};

export default BlockList;
