import { Box, Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import {
    AutocompleteInput,
    DateTimeInput,
    Labeled,
    NumberInput,
    ReferenceInput,
    SelectArrayInput,
    SelectInput,
    TextInput,
    maxLength,
    minValue,
    required,
    usePermissions,
} from "react-admin";
import { ColorInput } from "react-admin-color-input";
import { useForm, useFormState } from "react-final-form";
import CreatableSelect from "react-select/creatable";

import { useRequest } from "../../../hooks";
import {
    capitalizeFirstLetterOfEachWord,
    toFormattedDateTime,
} from "../../../utils/helpers";
import AceEditorInput from "../../AceEditorInput";
import AroggaMovableImageInput from "../../AroggaMovableImageInput";
import FormatedBooleanInput from "../../FormatedBooleanInput";
import InlineArrayInput from "../../InlineArrayInput";
import DynamicInput from "./DynamicInput";

import "ace-builds/src-noconflict/mode-css";

const BlockForm = (props) => {
    const form = useForm();
    const { permissions } = usePermissions();
    const { values } = useFormState();
    const { record } = props;

    const [cloneData, setCloneData] = useState(record);

    useRequest(
        `/v1/block/${values.b_id}`,
        {},
        {
            isPreFetching: values?.isCloneActionFrom,
            onSuccess: ({ data }) => {
                form.change("b_config", data?.b_config);
                setCloneData(data);
            },
        }
    );

    const { data: blockTypes } = useRequest(
        "/v1/taxonomiesByVocabulary/block_type?_parent_id=0",
        {},
        { isPreFetching: true }
    );

    const { data: displayTypes, refetch } = useRequest(
        "",
        {},
        { isWarningNotify: false }
    );

    useEffect(() => {
        if (!values.b_type || !blockTypes?.length) return;

        const blockType = blockTypes?.find(
            (blockType) => blockType.t_machine_name === values.b_type
        );

        refetch({
            endpoint: `/v1/taxonomiesByVocabulary/block_type?_parent_id=${blockType?.t_id}`,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockTypes, values.b_type]);

    const blockTypesForShowingWidthAndHeight = [
        "image",
        "carousel",
        "banner",
        "actions",
    ];

    const getWidthHeightLabel = (key) => {
        if (values.b_type === "actions") return `Icon ${key}`;

        return `${capitalizeFirstLetterOfEachWord(values.b_type)} ${key}`;
    };

    const handleOnSelectRegion = (deviceTypes = []) => {
        values.b_device_type = deviceTypes;
    };

    return (
        <>
            <Grid container spacing={1}>
                {!!values.id && (
                    <Grid item sm={3}>
                        <TextInput
                            source="b_id"
                            label="ID"
                            variant="outlined"
                            helperText={false}
                            fullWidth
                            disabled
                        />
                    </Grid>
                )}
                <Grid item sm={3}>
                    <TextInput
                        source="b_title"
                        label="Title"
                        variant="outlined"
                        validate={[
                            required(),
                            maxLength(
                                50,
                                "Title can be at max 50 characters long"
                            ),
                        ]}
                        helperText={false}
                        multiline
                        fullWidth
                    />
                </Grid>
                <Grid item sm={3}>
                    <TextInput
                        source="b_subtitle"
                        label="Subtitle"
                        variant="outlined"
                        validate={[
                            maxLength(
                                255,
                                "Subtitle can be at max 255 characters long"
                            ),
                        ]}
                        helperText={false}
                        multiline
                        fullWidth
                    />
                </Grid>
                <Grid item sm={3}>
                    <ReferenceInput
                        source="b_region_id"
                        label="Region"
                        variant="outlined"
                        reference="v1/region"
                        filter={{ _details: 1 }}
                        onSelect={(item) =>
                            handleOnSelectRegion(
                                item.rt?.map(({ rt_name }) => rt_name)
                            )
                        }
                        validate={[required()]}
                        helperText={false}
                        fullWidth
                    >
                        <AutocompleteInput
                            optionValue="r_id"
                            optionText="r_name"
                            resettable
                        />
                    </ReferenceInput>
                </Grid>
                <Grid item sm={3}>
                    <SelectArrayInput
                        source="b_device_type"
                        label="Device Type"
                        variant="outlined"
                        helperText={false}
                        choices={[
                            { id: "web", name: "Web" },
                            { id: "web_app", name: "Web App" },
                            { id: "app", name: "App" },
                        ]}
                        fullWidth
                    />
                </Grid>
                <Grid item sm={3}>
                    <DateTimeInput
                        source="b_start_date"
                        label="Start Date"
                        variant="outlined"
                        parse={(dateTime) =>
                            toFormattedDateTime({
                                dateString: dateTime,
                            })
                        }
                        helperText={false}
                        fullWidth
                    />
                </Grid>
                <Grid item sm={3}>
                    <DateTimeInput
                        source="b_end_date"
                        label="End Date"
                        variant="outlined"
                        parse={(dateTime) =>
                            toFormattedDateTime({
                                dateString: dateTime,
                            })
                        }
                        helperText={false}
                        fullWidth
                    />
                </Grid>
                <Grid item sm={3}>
                    <SelectInput
                        source="b_status"
                        label="Status"
                        variant="outlined"
                        initialValue="active"
                        choices={[
                            { id: "active", name: "Active" },
                            { id: "inactive", name: "Inactive" },
                        ]}
                        validate={[required()]}
                        helperText={false}
                        fullWidth
                    />
                </Grid>
                <Grid item sm={3}>
                    <SelectInput
                        source="b_weight"
                        label="Weight"
                        variant="outlined"
                        choices={Array.from({ length: 101 }, (_, index) => ({
                            id: index - 50,
                            name: `${index - 50}`,
                        }))}
                        helperText={false}
                        fullWidth
                    />
                </Grid>
                <Grid item sm={3}>
                    <TextInput
                        source="b_description"
                        label="Description"
                        variant="outlined"
                        helperText={false}
                        validate={[
                            maxLength(
                                100,
                                "Description can be at max 100 characters long"
                            ),
                        ]}
                        fullWidth
                        multiline
                    />
                </Grid>
                <Grid item sm={3}>
                    <NumberInput
                        source="b_per_page"
                        label="Per Page"
                        variant="outlined"
                        helperText={false}
                        validate={[minValue(1)]}
                        min={1}
                        initialValue={!values.id ? 10 : null}
                        fullWidth
                    />
                </Grid>
                <Grid item sm={1}>
                    <FormatedBooleanInput
                        source="b_infinity"
                        label="Infinity"
                        style={{ marginTop: 8 }}
                    />
                </Grid>
                <Grid item sm={1}>
                    <Box mt={-2}>
                        <ColorInput
                            source="b_color_code"
                            label="Color Code"
                            variant="outlined"
                            helperText={false}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid item sm={3}>
                <Labeled label="View All Link" fullWidth>
                    <CreatableSelect
                        options={[
                            {
                                value: "products",
                                label: "products",
                            },
                            {
                                value: "category",
                                label: "category",
                            },
                            {
                                value: "brand",
                                label: "brand",
                            },
                            {
                                value: "blog",
                                label: "blog",
                            },
                        ]}
                        defaultValue={
                            record?.b_view_detail_link
                                ? {
                                      value: record.b_view_detail_link,
                                      label: record.b_view_detail_link,
                                  }
                                : null
                        }
                        onChange={(value) =>
                            form.change("b_view_detail_link", value)
                        }
                        placeholder="Select or type to create"
                        styles={{
                            container: (baseStyles) => ({
                                ...baseStyles,
                                zIndex: 999,
                            }),
                        }}
                        isClearable
                    />
                </Labeled>
            </Grid>
            <Grid item sm={12}>
                <InlineArrayInput
                    source="b_link_parameter"
                    label="Link Parameter"
                    disableReordering
                >
                    <TextInput
                        source="key"
                        label="Key"
                        variant="outlined"
                        helperText={false}
                        multiline
                        fullWidth
                    />
                    <TextInput
                        source="value"
                        label="Value"
                        variant="outlined"
                        helperText={false}
                        multiline
                        fullWidth
                    />
                </InlineArrayInput>
            </Grid>
            <Grid container spacing={1}>
                <Grid item sm={3}>
                    <SelectInput
                        source="b_type"
                        label="Type"
                        variant="outlined"
                        helperText={false}
                        validate={[required()]}
                        choices={blockTypes}
                        optionValue="t_machine_name"
                        optionText="t_title"
                        fullWidth
                    />
                </Grid>
                {blockTypesForShowingWidthAndHeight.includes(values.b_type) && (
                    <Grid item sm={3}>
                        <NumberInput
                            source="width"
                            label={getWidthHeightLabel("Width")}
                            variant="outlined"
                            defaultValue={
                                values[`b_config-${values.b_type}`]?.[0]?.width
                            }
                            helperText={false}
                            fullWidth
                        />
                    </Grid>
                )}
                {blockTypesForShowingWidthAndHeight.includes(values.b_type) && (
                    <Grid item sm={3}>
                        <NumberInput
                            source="height"
                            label={getWidthHeightLabel("Height")}
                            variant="outlined"
                            defaultValue={
                                values[`b_config-${values.b_type}`]?.[0]?.height
                            }
                            helperText={false}
                            fullWidth
                        />
                    </Grid>
                )}
                {!!displayTypes?.length && (
                    <Grid item sm={3}>
                        <SelectInput
                            source="b_display_type"
                            label="Display Type"
                            variant="outlined"
                            helperText={false}
                            choices={displayTypes}
                            optionValue="t_machine_name"
                            optionText="t_title"
                            fullWidth
                        />
                    </Grid>
                )}
            </Grid>
            <DynamicInput
                record={values?.isCloneActionFrom ? cloneData : record}
            />
            {permissions?.includes("role:administrator") && (
                <AceEditorInput
                    source="b_styles"
                    label="CSS Styles"
                    mode="css"
                />
            )}
            <AroggaMovableImageInput
                source="attachedFiles_b_block_page_banner"
                label="Banner (Web: 1350*480 px, Mobile: 580*250 px)"
                accept=".jpeg,.jpg,.png,.webp,.gif,.svg"
            />
        </>
    );
};

export default BlockForm;
