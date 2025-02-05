import { useEffect, useState, useRef } from "react";
import { Labeled, TextInput } from "react-admin";
import { Grid, Switch, Autocomplete } from "@mui/material";

import { Editor } from "@tinymce/tinymce-react";
import { TINY_MCE_EDITOR_INIT } from "@/utils/constants";

// Utility function to remove HTML tags from a string
const stripHtmlTags = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const RichTextTranslate = ({
  source,
  label,
  form,
  values,
  translate = false,
  fullWidth = false,
  initialValue = "",
  onChange,
}) => {
  const [content, setContent] = useState(initialValue);
  const [translatedSuggestions, setTranslatedSuggestions] = useState([]);
  const [showTranslatedSuggestions, setShowTranslatedSuggestions] =
    useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (translate && showTranslatedSuggestions) {
      const delayDebounceFn = setTimeout(() => {
        fetchTranslatedSuggestions(content);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [content, translate, showTranslatedSuggestions]);

  const fetchTranslatedSuggestions = async (text) => {
    const res = await fetch(
      `https://inputtools.google.com/request?text=${encodeURIComponent(
        text
      )}&itc=bn-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
    );
    const data = await res.json();
    if (data) {
      setTranslatedSuggestions(data[1][0][1]);
    }
  };

  const handleEditorChange = (newValue) => {
    setContent(newValue);
    form.change(source, newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div>
      {translate && (
        <Grid
          container
          component="label"
          alignItems="center"
          spacing={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Grid item>EN</Grid>
          <Grid item>
            <Switch
              size="small"
              checked={showTranslatedSuggestions}
              onChange={(e) => {
                setShowTranslatedSuggestions(e.target.checked);
                if (e.target.checked) {
                  fetchTranslatedSuggestions(stripHtmlTags(content));
                } else {
                  setTranslatedSuggestions([]);
                }
              }}
            />
          </Grid>
          <Grid item>BN</Grid>
        </Grid>
      )}

      <Labeled label={label} fullWidth={fullWidth}>
        {translate && showTranslatedSuggestions ? (
          <Autocomplete
            ref={inputRef}
            options={translatedSuggestions}
            filterOptions={(x) => x}
            value={content}
            autoComplete={true}
            onInputChange={(_, value) => handleEditorChange(value)}
            renderInput={(params) => (
              <TextInput
                {...params}
                label={label}
                source={source}
                variant="outlined"
                multiline={true}
                fullWidth={fullWidth}
              />
            )}
            autoHighlight
            fullWidth={fullWidth}
          />
        ) : (
          <Editor
            tinymceScriptSrc={`${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`}
            init={TINY_MCE_EDITOR_INIT as any}
            value={content}
            onEditorChange={handleEditorChange}
          />
        )}
      </Labeled>
    </div>
  );
};

export default RichTextTranslate;
