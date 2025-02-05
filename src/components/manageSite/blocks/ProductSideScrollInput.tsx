import { Box } from "@material-ui/core";
import { useRef } from "react";
import { AutocompleteInput, ReferenceInput } from "react-admin";
import { useForm } from "react-final-form";

import {
    capitalizeFirstLetterOfEachWord,
    getProductTextRenderer,
    getReadableSKU,
    required,
} from "../../../utils/helpers";
import InlineArrayInput from "../../InlineArrayInput";

const ProductSideScrollInput = ({ values }) => {
    const form = useForm();

    const inputRef = useRef<HTMLInputElement>(null!);

    return (
        <InlineArrayInput
            source={`b_config-${values.b_type}`}
            label={capitalizeFirstLetterOfEachWord(values.b_type)}
            validate={[required()]}
            disableRemove={values[`b_config-${values.b_type}`]?.length === 1}
            enableRenderProps
        >
            {({ getSource, scopedFormData }) => (
                <Box display="flex" gridGap={8}>
                    <ReferenceInput
                        source={getSource("p_id")}
                        record={scopedFormData}
                        label="Product *"
                        variant="outlined"
                        helperText={false}
                        reference="v1/product"
                        filter={{ _details: 1 }}
                        sort={{ field: "p_name", order: "ASC" }}
                        onSelect={({ pv }) => {
                            form.change(
                                getSource("pv_id"),
                                pv?.length === 1 ? pv?.[0]?.pv_id : undefined
                            );
                            pv?.length !== 1 &&
                                setTimeout(() => {
                                    inputRef.current?.focus();
                                }, 1);
                        }}
                        validate={[required()]}
                    >
                        <AutocompleteInput
                            optionText={getProductTextRenderer}
                            options={{
                                InputProps: { multiline: true },
                            }}
                            matchSuggestion={() => true}
                            resettable
                        />
                    </ReferenceInput>
                    {scopedFormData?.p_id && (
                        <ReferenceInput
                            source={getSource("pv_id")}
                            record={scopedFormData}
                            label="Variant *"
                            variant="outlined"
                            helperText={false}
                            reference="v1/productVariant"
                            filter={{
                                _product_id: scopedFormData?.p_id,
                                _perPage: 500,
                            }}
                            validate={[required()]}
                        >
                            <AutocompleteInput
                                optionText={(item) =>
                                    getReadableSKU(item?.pv_attribute)
                                }
                                options={{
                                    InputProps: {
                                        multiline: true,
                                        inputRef: inputRef,
                                    },
                                }}
                                matchSuggestion={() => true}
                                resettable
                            />
                        </ReferenceInput>
                    )}
                </Box>
            )}
        </InlineArrayInput>
    );
};

export default ProductSideScrollInput;
