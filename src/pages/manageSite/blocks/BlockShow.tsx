import { Box } from "@material-ui/core";
import { FC } from "react";
import {
    ArrayField,
    BooleanField,
    Datagrid,
    FunctionField,
    Labeled,
    NumberField,
    Record,
    ReferenceField,
    Show,
    ShowProps,
    SimpleShowLayout,
    TextField,
} from "react-admin";
import { ColorField } from "react-admin-color-input";

import AceEditorField from "../../../components/AceEditorField";
import AroggaDateField from "../../../components/AroggaDateField";
import ColumnShowLayout from "../../../components/ColumnShowLayout";
import CustomChipField from "../../../components/CustomChipField";
import ObjectField from "../../../components/ObjectField";
import { useDocumentTitle } from "../../../hooks";
import { capitalizeFirstLetterOfEachWord } from "../../../utils/helpers";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-mysql";
import AroggaImageField from "../../../components/AroggaImageField";

const BlockShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Block Show");

    const classes = useAroggaStyles();

    return (
        <Show {...props}>
            <SimpleShowLayout>
                <ColumnShowLayout simpleShowLayout={false}>
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
                    />
                    <AroggaDateField source="b_start_date" label="Start Date" />
                    <AroggaDateField source="b_end_date" label="End Date" />
                    <TextField source="b_color_code" label="Color Code" />
                    <TextField source="b_per_page" label="Per Page" />
                    <BooleanField
                        source="b_infinity"
                        label="Infinity?"
                        looseValue
                    />
                    <FunctionField
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
                    <TextField
                        source="b_view_detail_link"
                        label="View Detail Link"
                    />
                    <TextField source="b_description" label="Description" />
                    <AroggaDateField source="b_created_at" label="Created At" />
                    <ReferenceField
                        source="b_created_by"
                        label="Created By"
                        reference="v1/users"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                    <AroggaDateField
                        source="b_modified_at"
                        label="Modified At"
                    />
                    <ReferenceField
                        source="b_modified_by"
                        label="Modified By"
                        reference="v1/users"
                    >
                        <TextField source="u_name" />
                    </ReferenceField>
                </ColumnShowLayout>
                <ObjectField source="b_link_parameter" label="Link Parameter" />
                <FunctionField
                    addLabel={false}
                    render={({ b_type, b_config }) => {
                        switch (b_type) {
                            case "sql":
                                return (
                                    <>
                                        <AceEditorField
                                            value={b_config.query}
                                            label="SQL Query"
                                            mode="mysql"
                                        />
                                        <AceEditorField
                                            value={b_config.params}
                                            label="SQL Params"
                                            mode="javascript"
                                            height="150px"
                                        />
                                    </>
                                );
                            case "html":
                                return (
                                    <AceEditorField
                                        value={b_config}
                                        label="HTML Content"
                                        mode="html"
                                    />
                                );
                            case "text":
                                return (
                                    <Labeled label="Text Config">
                                        <TextField source="b_config" />
                                    </Labeled>
                                );
                            case "actions":
                            case "video":
                                return (
                                    <Labeled
                                        label={`${capitalizeFirstLetterOfEachWord(
                                            b_type
                                        )} Config`}
                                        fullWidth
                                    >
                                        <ArrayField source="b_config">
                                            <Datagrid>
                                                <TextField
                                                    source="title"
                                                    label="Title"
                                                />
                                                <TextField
                                                    source="subtitle"
                                                    label="Subtitle"
                                                />
                                                <TextField
                                                    source="alt"
                                                    label="Alt"
                                                />
                                                <TextField
                                                    source="button_title"
                                                    label="Button Title"
                                                />
                                                <TextField
                                                    source="link"
                                                    label="Link"
                                                />
                                                <TextField
                                                    source="route"
                                                    label="Route"
                                                />
                                                {b_type === "actions" && (
                                                    <TextField
                                                        source="width"
                                                        label="Width"
                                                    />
                                                )}
                                                {b_type === "actions" && (
                                                    <TextField
                                                        source="height"
                                                        label="Height"
                                                    />
                                                )}
                                                <ColorField
                                                    source="color_code"
                                                    label="Color Code"
                                                />
                                                <BooleanField
                                                    source="is_external"
                                                    label="External?"
                                                    looseValue
                                                />
                                                <ObjectField
                                                    source="link_parameter"
                                                    label="Link Parameter"
                                                    addLabel={false}
                                                />
                                                {b_type === "video" && (
                                                    <TextField
                                                        source="yt_title"
                                                        label="Youtube Title"
                                                    />
                                                )}
                                                {b_type === "video" && (
                                                    <FunctionField
                                                        label="Youtube Video"
                                                        render={({
                                                            yt_key,
                                                        }: Record) => {
                                                            if (!yt_key)
                                                                return null;

                                                            return (
                                                                <iframe
                                                                    title={
                                                                        yt_key
                                                                    }
                                                                    src={`https://www.youtube.com/embed/${yt_key}`}
                                                                    width={250}
                                                                    height={150}
                                                                    frameBorder="0"
                                                                    allowFullScreen
                                                                />
                                                            );
                                                        }}
                                                    />
                                                )}
                                                {b_type === "actions" && (
                                                    <AroggaImageField
                                                        source="file_banner"
                                                        label="Attached Banner"
                                                    />
                                                )}
                                                {b_type === "actions" && (
                                                    <AroggaImageField
                                                        source="file"
                                                        label="Attached Icon"
                                                    />
                                                )}
                                            </Datagrid>
                                        </ArrayField>
                                    </Labeled>
                                );
                            case "image":
                            case "carousel":
                            case "banner":
                                return (
                                    <Labeled
                                        label={`${capitalizeFirstLetterOfEachWord(
                                            b_type
                                        )} Config`}
                                        fullWidth
                                    >
                                        <ArrayField source="b_config">
                                            <Datagrid>
                                                <TextField
                                                    source="title"
                                                    label="Title"
                                                />
                                                <TextField
                                                    source="alt"
                                                    label="Alt"
                                                />
                                                <TextField
                                                    source="link"
                                                    label="Link"
                                                />
                                                <TextField
                                                    source="route"
                                                    label="Route"
                                                />
                                                <TextField
                                                    source="width"
                                                    label="Width"
                                                />
                                                <TextField
                                                    source="height"
                                                    label="Height"
                                                />
                                                <ObjectField
                                                    source="link_parameter"
                                                    label="Link Parameter"
                                                    addLabel={false}
                                                />
                                                <BooleanField
                                                    source="is_external"
                                                    label="External?"
                                                    looseValue
                                                />
                                                {b_type === "image" && (
                                                    <AroggaImageField
                                                        source="file_banner"
                                                        label="Attached Banner"
                                                    />
                                                )}
                                                <AroggaImageField
                                                    source="file"
                                                    label="Attached Image"
                                                />
                                            </Datagrid>
                                        </ArrayField>
                                    </Labeled>
                                );
                            case "category":
                                return (
                                    <Labeled label="Category Config">
                                        <TextField source="b_config" />
                                    </Labeled>
                                );
                            case "function":
                                return (
                                    <Box display="flex" flexDirection="column">
                                        <Labeled label="Function Config">
                                            <TextField source="b_config.function" />
                                        </Labeled>
                                        <Labeled label="Function Params">
                                            <TextField source="b_config.params" />
                                        </Labeled>
                                    </Box>
                                );
                            default:
                                return null;
                        }
                    }}
                    fullWidth
                />
                <FunctionField
                    addLabel={false}
                    render={({ b_styles }) => (
                        <AceEditorField
                            value={b_styles}
                            label="CSS Styles"
                            mode="css"
                        />
                    )}
                />
                <AroggaImageField
                    source="attachedFiles_b_block_page_banner"
                    label="Banner"
                />
            </SimpleShowLayout>
        </Show>
    );
};

export default BlockShow;
