import { Grid } from "@material-ui/core";
import { ImageField, ImageInput, SelectInput, TextInput } from "react-admin";

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

const ImageCarouselBannerInput = ({ values, appInternalRouteData }) => (
    <InlineArrayInput
        source={`b_config-${values.b_type}`}
        label={`${capitalizeFirstLetterOfEachWord(values.b_type)} Config`}
        addButtonLabel="Add Config"
        validate={[required()]}
        removeButtonStyle={{ marginLeft: 50 }}
        disableAdd={values.b_type === "banner"}
        disableRemove={values[`b_config-${values.b_type}`]?.length === 1}
        disableReordering={values.b_type === "banner"}
        enableRenderProps
    >
        {({ getSource, scopedFormData }) => (
            <div
                style={{
                    border: "1px solid #AAAAAA",
                    padding: "8px 34px 0 8px",
                    marginTop: 20,
                }}
            >
                <Grid container spacing={1}>
                    <Grid item sm={3}>
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
                    <Grid item sm={!scopedFormData?.is_external ? 2 : 3}>
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
                        <Grid item sm={2}>
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
                    <Grid item sm={1}>
                        <FormatedBooleanInput
                            source={getSource("is_external")}
                            record={scopedFormData}
                            label="External"
                            style={{ marginTop: 9 }}
                        />
                    </Grid>
                </Grid>
                <Grid item sm={12}>
                    <LinkParameterInput
                        getSource={getSource}
                        scopedFormData={scopedFormData}
                    />
                </Grid>
                {values.b_type === "image" && (
                    <AroggaMovableImageInput
                        source={getSource("file_banner")}
                        record={scopedFormData}
                        accept=".jpeg,.jpg,.png,.webp,.gif,.svg"
                        label="Attached Banner (Web: 1350*480 px, Mobile: 580*250 px)"
                    />
                )}
                <ImageInput
                    source={getSource("file")}
                    record={scopedFormData}
                    label="Attached Image* (Web: 1350*480 px, Mobile: 580*250 px)"
                    accept="image/*"
                    maxSize={FILE_MAX_SIZE}
                    validate={[required()]}
                    helperText={false}
                    multiple={values.b_type !== "banner"}
                >
                    <ImageField source="src" title="title" />
                </ImageInput>
            </div>
        )}
    </InlineArrayInput>
);

export default ImageCarouselBannerInput;
