import { Box, Grid } from "@material-ui/core";
import { ImageField, ImageInput, SelectInput, TextInput } from "react-admin";
import { ColorInput } from "react-admin-color-input";

import { FILE_MAX_SIZE } from "../../../utils/constants";
import {
    capitalizeFirstLetterOfEachWord,
    required,
} from "../../../utils/helpers";
import AroggaMovableImageInput from "../../AroggaMovableImageInput";
import FormatedBooleanInput from "../../FormatedBooleanInput";
import InlineArrayInput from "../../InlineArrayInput";
import LinkInput from "./LinkInput";
import LinkParameterInput from "./LinkParameterInput";

const ActionsVideoInput = ({ values, appInternalRouteData }) => (
    <InlineArrayInput
        source={`b_config-${values.b_type}`}
        label={`${capitalizeFirstLetterOfEachWord(values.b_type)} Config`}
        addButtonLabel="Add Config"
        removeButtonStyle={{
            position: "absolute",
            right: 0,
        }}
        validate={[required()]}
        disableRemove={values[`b_config-${values.b_type}`]?.length === 1}
        enableRenderProps
    >
        {({ getSource, scopedFormData }) => (
            <>
                <Grid container spacing={1}>
                    <Grid item sm={2}>
                        <TextInput
                            source={getSource("title")}
                            record={scopedFormData}
                            label="Title *"
                            variant="outlined"
                            validate={[required()]}
                            helperText={false}
                            multiline
                            fullWidth
                        />
                    </Grid>
                    <Grid item sm={2}>
                        <TextInput
                            source={getSource("subtitle")}
                            record={scopedFormData}
                            label="Subtitle"
                            variant="outlined"
                            helperText={false}
                            multiline
                            fullWidth
                        />
                    </Grid>
                    <Grid item sm={values.b_type === "video" ? 1 : 2}>
                        <TextInput
                            source={getSource("alt")}
                            record={scopedFormData}
                            label="Alt *"
                            variant="outlined"
                            validate={[required()]}
                            helperText={false}
                            multiline
                            fullWidth
                        />
                    </Grid>
                    {values.b_type === "video" && (
                        <Grid item sm={!scopedFormData?.is_external ? 1 : 2}>
                            <TextInput
                                source={getSource("yt_title")}
                                record={scopedFormData}
                                label="Youtube Title *"
                                variant="outlined"
                                validate={[required()]}
                                helperText={false}
                                multiline
                                fullWidth
                            />
                        </Grid>
                    )}
                    {values.b_type === "video" && (
                        <Grid item sm={!scopedFormData?.is_external ? 1 : 2}>
                            <TextInput
                                source={getSource("yt_key")}
                                record={scopedFormData}
                                label="Youtube Key *"
                                variant="outlined"
                                validate={[required()]}
                                helperText={false}
                                multiline
                                fullWidth
                            />
                        </Grid>
                    )}
                    <Grid item sm={values.b_type === "video" ? 1 : 2}>
                        <TextInput
                            source={getSource("button_title")}
                            record={scopedFormData}
                            label="Button Title"
                            variant="outlined"
                            helperText={false}
                            multiline
                            fullWidth
                        />
                    </Grid>
                    <Grid item sm={2}>
                        <LinkInput
                            isExternal={scopedFormData?.is_external}
                            source={getSource("link")}
                            record={scopedFormData}
                            label="Link"
                            variant="outlined"
                            choices={appInternalRouteData}
                            optionText="t_title"
                            optionValue="t_title"
                            helperText={false}
                            multiline
                            fullWidth
                        />
                    </Grid>
                    {!scopedFormData?.is_external && (
                        <Grid item sm={1}>
                            <SelectInput
                                source={getSource("route")}
                                record={scopedFormData}
                                label="Route"
                                variant="outlined"
                                choices={[
                                    {
                                        id: "public",
                                        name: "Public",
                                    },
                                    {
                                        id: "private",
                                        name: "Private",
                                    },
                                ]}
                                helperText={false}
                                fullWidth
                            />
                        </Grid>
                    )}
                </Grid>
                <Grid container spacing={1}>
                    <Grid item sm={2}>
                        <Box mt={-2}>
                            <ColorInput
                                source={getSource("color_code")}
                                record={scopedFormData}
                                label="Color Code"
                                variant="outlined"
                                helperText={false}
                            />
                        </Box>
                    </Grid>
                    <Grid item sm={2}>
                        <FormatedBooleanInput
                            source={getSource("is_external")}
                            record={scopedFormData}
                            label="External"
                            style={{ marginTop: 9 }}
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <LinkParameterInput
                            getSource={getSource}
                            scopedFormData={scopedFormData}
                        />
                    </Grid>
                    {values.b_type === "actions" && (
                        <AroggaMovableImageInput
                            source={getSource("file_banner")}
                            record={scopedFormData}
                            label="Attached Banner"
                        />
                    )}
                    {values.b_type === "actions" && (
                        <ImageInput
                            source={getSource("file")}
                            record={scopedFormData}
                            label="Attached Icon *"
                            accept="image/*"
                            maxSize={FILE_MAX_SIZE}
                            validate={[required()]}
                            helperText={false}
                        >
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    )}
                </Grid>
            </>
        )}
    </InlineArrayInput>
);

export default ActionsVideoInput;
