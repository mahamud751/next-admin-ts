import { Box, TextField } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Autocomplete } from "@mui/material";
import { FC, useState } from "react";
import {
  AutocompleteInput,
  CheckboxGroupInput,
  ReferenceInput,
  SelectArrayInput,
  SelectInput,
} from "react-admin";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useGetTaxonomiesByVocabulary } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  isInteger,
  isString,
} from "@/utils/helpers";
import TaxonomyCreateDialog from "./TaxonomyCreateDialog";

type TaxonomiesByVocabularyInputProps = {
  fetchKey: string;
  filter?: any;
  inputType?:
    | "selectInput"
    | "selectArrayInput"
    | "checkboxGroupInput"
    | "autoCompleteInput"
    | "autoCompleteInputMui"
    | "referenceInput";
  title?: boolean;
  rawTitle?: boolean;
  isCreateable?: boolean;
  excludeChoiceByMachineName?: string[];
  [rest: string]: any;
};

const TaxonomiesByVocabularyInput: FC<TaxonomiesByVocabularyInputProps> = ({
  fetchKey,
  filter = {},
  inputType = "selectInput",
  title = false,
  rawTitle = false,
  isCreateable = false,
  excludeChoiceByMachineName = [],
  ...rest
}) => {
  const { control, setValue } = useForm();
  const values = useWatch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const data = useGetTaxonomiesByVocabulary({
    fetchKey,
    filter,
    isPreFetching: inputType !== "referenceInput",
  });

  const choices = !!data?.length
    ? data
        .filter(
          (item) => !excludeChoiceByMachineName.includes(item.t_machine_name)
        )
        .map(({ t_title, t_machine_name }) => ({
          id: rawTitle
            ? t_title
            : title
            ? t_title.toLowerCase()
            : t_machine_name,
          name: capitalizeFirstLetterOfEachWord(t_title),
        }))
    : [];

  const filterChoice = choices.filter(
    (item) => item.id === values[rest.source]
  );

  if (
    values[rest.source] &&
    isString(values[rest.source]) &&
    !filterChoice.length
  ) {
    choices.push({
      id: values[rest.source],
      name: capitalizeFirstLetterOfEachWord(values[rest.source]),
    });
  }

  const getReferenceInputValue = (value) => {
    if (isInteger(value)) return "";

    if (title) return value;
    return capitalizeFirstLetterOfEachWord(value);
  };

  if (inputType === "selectArrayInput")
    return <SelectArrayInput choices={choices} {...rest} variant="outlined" />;

  if (inputType === "checkboxGroupInput")
    return (
      <CheckboxGroupInput choices={choices} {...rest} variant="outlined" />
    );

  if (inputType === "autoCompleteInput") {
    return (
      <AutocompleteInput
        variant="outlined"
        choices={choices}
        setFilter={(filter) => filter}
        matchSuggestion={() => true}
        {...rest}
      />
    );
  }

  if (inputType === "autoCompleteInputMui") {
    return (
      <Controller
        control={control}
        name={rest.source}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            id={rest.source}
            options={choices}
            getOptionLabel={(option: any) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                // {...input}
                className={rest.className}
                variant="outlined"
              />
            )}
            onChange={(_, value) => onChange(value?.id)}
            freeSolo
          />
        )}
        {...rest}
      />
    );
  }

  return (
    <Box display="flex" gap={2}>
      {inputType === "referenceInput" ? (
        <div>
          <ReferenceInput
            source={rest?.source}
            variant="outlined"
            reference="v1/taxonomy"
            filter={{
              _v_machine_name: fetchKey,
              _orderBy: "t_weight",
              _order: "ASC",
              ...filter,
            }}
            onSelect={({ t_title, t_machine_name }) =>
              setValue(
                `${rest?.source}${title ? "Title" : "MachineName"}`,
                title ? t_title : t_machine_name
              )
            }
            {...rest}
            format={(val) => (isInteger(val) ? val : 0)}
          >
            <AutocompleteInput
              optionText="t_title"
              //   options={{
              //     InputProps: {
              //       multiline: true,
              //     },
              //   }}
              //   resettable
            />
          </ReferenceInput>
          {getReferenceInputValue(values?.[rest?.source] || rest?.initialValue)}
        </div>
      ) : (
        <SelectInput choices={choices} {...rest} variant="outlined" />
      )}
      {isCreateable && (
        <>
          <span
            style={{ marginTop: 16, cursor: "pointer" }}
            onClick={() => setIsDialogOpen(true)}
          >
            <AddBoxIcon color="primary" />
          </span>
          <TaxonomyCreateDialog
            fetchKey={fetchKey}
            inputType={inputType}
            source={rest?.source}
            label={rest?.label}
            title={title}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </>
      )}
    </Box>
  );
};

export default TaxonomiesByVocabularyInput;
