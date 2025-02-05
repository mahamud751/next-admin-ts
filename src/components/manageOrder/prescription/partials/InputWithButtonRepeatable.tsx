import { useEffect, useRef, useState } from "react";

import {
    Grid,
    IconButton,
    Switch,
    TextField,
    Tooltip,
} from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

import { useRequest } from "../../../../../hooks";
import { isString } from "../../../../../utils/helpers";
import { CloseIcon, SquarePlusIcon } from "../../../../icons";

const filter = createFilterOptions();

const InputWithButtonRepeatable = ({
    source,
    label,
    form,
    values,
    reference = "",
    filteredBy = "",
    optionText = "",
    translate = false,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [showDelete, setShowDelete] = useState({});
    const inputRef = useRef(null);
    const [showTranslatedSuggestions, setShowTranslatedSuggestions] =
        useState(false);

    const [translatedSuggestions, setTranslatedSuggestions] = useState([]);
    const [referanceSuggestions, setReferanceSuggestions] = useState([]);
    const [referanceInputValue, setReferanceInputValue] = useState("");

    const { data, isLoading, isSuccess, refetch } = useRequest(
        `/${reference}?${filteredBy}=${referanceInputValue}`,
        {},
        {
            isWarningNotify: false,
        }
    );

    useEffect(() => {
        if (isSuccess) {
            setReferanceSuggestions(
                data?.map((item: any) => item[optionText]) || []
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (translate && showTranslatedSuggestions) {
                translated();
            }
            if (reference) {
                if (
                    referanceInputValue !== "" &&
                    referanceInputValue !== null &&
                    referanceInputValue
                ) {
                    referanceInputValue && refetch();
                }
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, referanceInputValue]);

    const pushToValues = () => {
        if (!inputValue) return;

        let currentSource = values[source] ?? [];
        currentSource.push(inputValue);
        form.change(source, currentSource);
        setInputValue("");
        const element = inputRef.current.getElementsByClassName(
            "MuiAutocomplete-clearIndicator"
        )[0];
        setTranslatedSuggestions([]);
        setTimeout(() => {
            if (element) element.click();
        }, 100);
    };

    const deleteFromValues = (index) => {
        form.change(source, values[source].toSpliced(index, 1));
    };

    const keyboardHandler = (e) => {
        if (e.key === "Enter") {
            pushToValues();
        }
    };

    // TODO:
    const translated = async () => {
        const res = await fetch(
            `https://inputtools.google.com/request?text=${inputValue}&itc=bn-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
        );
        const data = await res.json();
        if (data) {
            const suggestions = data[1][0][1];
            setTranslatedSuggestions(suggestions);
        }
    };

    return (
        <div style={{ margin: "20px 0px" }}>
            <ul style={{ paddingLeft: 18 }}>
                {values[source]?.map((item, index) => (
                    <li
                        key={index}
                        onMouseEnter={() =>
                            setShowDelete({
                                [index]: true,
                            })
                        }
                        onMouseLeave={() =>
                            setShowDelete({
                                [index]: false,
                            })
                        }
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div key={index} style={{ padding: "8px 3px" }}>
                                {item}
                            </div>
                            <div
                                style={{
                                    display: showDelete[index]
                                        ? "block"
                                        : "none",
                                }}
                            >
                                <Tooltip title="Delete" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={() => deleteFromValues(index)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {translate && (
                <Grid
                    container
                    component="label"
                    alignItems="center"
                    spacing={1}
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Grid item>EN</Grid>
                    <Grid item>
                        <Switch
                            size="small"
                            checked={showTranslatedSuggestions}
                            onChange={(e) => {
                                setShowTranslatedSuggestions(e.target.checked);
                                if (e.target.checked) {
                                    setTranslatedSuggestions([]);
                                    translated();
                                } else {
                                    setTranslatedSuggestions([]);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item>BN</Grid>
                </Grid>
            )}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 10,
                }}
            >
                {translate ? (
                    <>
                        {showTranslatedSuggestions ? (
                            <Autocomplete
                                ref={inputRef}
                                options={translatedSuggestions}
                                filterOptions={(x) => x}
                                value={inputValue}
                                autoComplete={true}
                                onInputChange={(_, value) =>
                                    setInputValue(value)
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={label}
                                        variant="outlined"
                                        size="small"
                                        value={inputValue}
                                        onKeyDown={keyboardHandler}
                                    />
                                )}
                                autoHighlight
                                fullWidth
                            />
                        ) : (
                            <TextField
                                label={label}
                                variant="outlined"
                                value={inputValue}
                                size="small"
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={keyboardHandler}
                                fullWidth
                            />
                        )}
                    </>
                ) : reference ? (
                    <Autocomplete
                        ref={inputRef}
                        loading={isLoading}
                        options={referanceSuggestions}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            if (params.inputValue !== "") {
                                filtered.push(params.inputValue);
                            }
                            return filtered;
                        }}
                        getOptionLabel={(option) => {
                            if (isString(option)) return option;
                            if (option.inputValue) return option.inputValue;
                            return option.title;
                        }}
                        getOptionSelected={(option, value) => {
                            if (isString(option)) return option === value;
                            if (option.inputValue)
                                return option.inputValue === value;
                            return option.title === value;
                        }}
                        onChange={(_, value) => setInputValue(value)}
                        noOptionsText="No options"
                        onInputChange={(_, value) =>
                            setReferanceInputValue(value)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={label}
                                variant="outlined"
                                size="small"
                                onKeyDown={keyboardHandler}
                            />
                        )}
                        freeSolo
                        autoComplete
                        selectOnFocus
                        autoHighlight
                        fullWidth
                    />
                ) : (
                    <TextField
                        label={label}
                        variant="outlined"
                        value={inputValue}
                        size="small"
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={keyboardHandler}
                        fullWidth
                    />
                )}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexDirection: "column",
                    }}
                >
                    <SquarePlusIcon
                        color="#008069"
                        onClick={pushToValues}
                        style={{
                            cursor: "pointer",
                            fontSize: 20,
                            marginTop: 5,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default InputWithButtonRepeatable;
