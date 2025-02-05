import { Autocomplete, Grid, Switch } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TextInput } from "react-admin";

const InputTranslate = ({
  source,
  label,
  form,
  values,
  reference = "",
  filteredBy = "",
  optionText = "",
  translate = false,
  fullWidth = false,
  multiline = false,
  minRows = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [showTranslatedSuggestions, setShowTranslatedSuggestions] =
    useState(false);

  const [translatedSuggestions, setTranslatedSuggestions] = useState([]);
  const inputDiv = document.getElementById(source) as HTMLInputElement;

  useEffect(() => {
    if (inputDiv) {
      setInputValue(inputDiv.value);
    }
  }, [inputDiv]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (translate && showTranslatedSuggestions) {
        translated();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const pushToValues = (value = "") => {
    setInputValue(value);
    form.change(source, value);
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
    <div>
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
                  pushToValues(inputValue);
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
                onInputChange={(_, value) => pushToValues(value)}
                renderInput={(params) => (
                  <TextInput
                    {...params}
                    label={label}
                    source={source}
                    variant="outlined"
                    multiline={multiline}
                    minRows={minRows}
                  />
                )}
                autoHighlight
                fullWidth={fullWidth}
              />
            ) : (
              <TextInput
                label={label}
                source={source}
                variant="outlined"
                fullWidth={fullWidth}
                multiline={multiline}
                minRows={minRows}
                onChange={(e) => pushToValues(e.target.value)}
                id={source}
              />
            )}
          </>
        ) : (
          <TextInput
            label={label}
            source={source}
            variant="outlined"
            fullWidth={fullWidth}
            multiline={multiline}
            minRows={minRows}
            onChange={(e) => pushToValues(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default InputTranslate;
