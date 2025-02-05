import { useEffect } from "react";
import {
    AutocompleteInput,
    ReferenceInput,
    SelectInput,
    TextInput,
    required,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { useRequest } from "../../../hooks";
import { isString } from "../../../utils/helpers";
import AceEditorInput from "../../AceEditorInput";
import CascaderCategoryInput from "../../CascaderCategoryInput";
import InlineArrayInput from "../../InlineArrayInput";
import ActionsVideoInput from "./ActionsVideoInput";
import ImageCarouselBannerInput from "./ImageCarouselBannerInput";
import ProductSideScrollInput from "./ProductSideScrollInput";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-mysql";

const DynamicInput = ({ record }) => {
    const form = useForm();
    const { values } = useFormState();

    const { data: functionData, refetch: fetchFunctions } = useRequest(
        "/v1/blocks/functions"
    );
    const { data: appInternalRouteData, refetch: fetchAppInternalRoutes } =
        useRequest(`/v1/taxonomiesByVocabulary/app_internal_route`);

    useEffect(() => {
        fetchDataIfNeeded();
        handleTypeChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.b_type]);

    const fetchDataIfNeeded = () => {
        if (!functionData?.length && values.b_type === "function") {
            fetchFunctions();
        }
        if (
            !appInternalRouteData?.length &&
            ["actions", "image", "carousel", "banner", "video"].includes(
                values.b_type
            )
        ) {
            fetchAppInternalRoutes();
        }
    };

    const handleTypeChange = () => {
        record.b_type !== values.b_type && setInitialValueWhenTypeChange();
    };

    if (!values[`b_config-${record.b_type}`]) {
        values[`b_config-${record.b_type}`] = record.b_config;
    }

    const setInitialWidthHeightWhenTypeChange = () => {
        form.change("width", undefined);
        form.change("height", undefined);
    };

    const setInitialValueWhenTypeChange = () => {
        const configKey = `b_config-${values.b_type}`;

        switch (values.b_type) {
            case "actions":
            case "video":
                handleActionsVideoInitialValues(configKey);
                break;
            case "image":
            case "carousel":
            case "banner":
                handleImageCarouselBannerInitialValues(configKey);
                break;
            case "product":
            case "side_scroll":
            case "blog":
                form.change(configKey, [undefined]);
                break;
            default:
                form.change("b_config", "");
        }
    };

    const handleActionsVideoInitialValues = (configKey) => {
        values.b_type === "actions" && setInitialWidthHeightWhenTypeChange();
        form.change(configKey, [
            {
                title: "",
                subtitle: "",
                alt: "",
                ...(values.b_type === "video"
                    ? { yt_title: "", yt_key: "" }
                    : {}),
                button_title: "",
                link: "",
                route: "",
                color_code: "",
                is_external: 0,
                ...(values.b_type === "actions" && {
                    file: [],
                    file_banner: [],
                }),
            },
        ]);
    };

    const handleImageCarouselBannerInitialValues = (configKey) => {
        setInitialWidthHeightWhenTypeChange();
        form.change(configKey, [
            {
                title: "",
                subtitle: "",
                alt: "",
                link: "",
                route: "",
                is_external: 0,
                file: [],
                ...(values.b_type === "image" && { file_banner: [] }),
            },
        ]);
    };

    const renderDynamicInput = () => {
        switch (values.b_type) {
            case "sql":
                return (
                    <>
                        <AceEditorInput
                            source="b_config.query"
                            label="SQL Query"
                            mode="mysql"
                            value={
                                isString(values.b_config?.query)
                                    ? values.b_config?.query
                                    : ""
                            }
                        />
                        <AceEditorInput
                            source="b_config.params"
                            label="SQL Params"
                            mode="javascript"
                            height="150px"
                            value={
                                isString(values.b_config?.params)
                                    ? values.b_config?.params
                                    : ""
                            }
                        />
                    </>
                );
            case "html":
                return (
                    <AceEditorInput
                        source="b_config"
                        label="HTML Content"
                        mode="html"
                    />
                );
            case "text":
                return (
                    <TextInput
                        source="b_config-text"
                        label="Text Config"
                        variant="outlined"
                        style={{ width: 256 }}
                        validate={[required()]}
                    />
                );
            case "actions":
            case "video":
                return (
                    <ActionsVideoInput
                        values={values}
                        appInternalRouteData={appInternalRouteData}
                    />
                );
            case "image":
            case "carousel":
            case "banner":
                return (
                    <ImageCarouselBannerInput
                        values={values}
                        appInternalRouteData={appInternalRouteData}
                    />
                );
            case "category":
                return (
                    <CascaderCategoryInput
                        source="b_config-category"
                        label="Category Config *"
                        isLastLevelSelectable={false}
                    />
                );
            case "function":
                return (
                    <>
                        <SelectInput
                            source="b_config-function.function"
                            label="Function Config"
                            variant="outlined"
                            style={{ width: 256 }}
                            choices={functionData}
                            optionText="f_name"
                            optionValue="f_name"
                            validate={[required()]}
                        />
                        <AceEditorInput
                            source="b_config.params"
                            label='Function Params (Format: {"key": "brand_best_selling_products_brand_id"})'
                            mode="javascript"
                            height="150px"
                            value={
                                isString(values.b_config?.params)
                                    ? values.b_config?.params
                                    : ""
                            }
                        />
                    </>
                );
            case "product":
            case "side_scroll":
                return <ProductSideScrollInput values={values} />;
            case "blog":
                return (
                    <InlineArrayInput
                        source={`b_config-${values.b_type}`}
                        label="Blog"
                        validate={[required()]}
                        disableRemove={
                            values[`b_config-${values.b_type}`]?.length === 1
                        }
                    >
                        <ReferenceInput
                            source="bp_id"
                            label="Blog"
                            variant="outlined"
                            reference="v1/blogPost"
                            filter={{
                                _status: "active",
                            }}
                            validate={[required()]}
                        >
                            <AutocompleteInput
                                matchSuggestion={() => true}
                                helperText={false}
                                optionValue="bp_id"
                                optionText="bp_title"
                                resettable
                            />
                        </ReferenceInput>
                    </InlineArrayInput>
                );
            default:
                return null;
        }
    };

    return renderDynamicInput();
};

export default DynamicInput;
