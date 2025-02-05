import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { makeStyles } from "@mui/styles";
import {
  Labeled,
  SelectInput,
  SimpleForm,
  TextInput,
  useRefresh,
} from "react-admin";
import { useParams } from "react-router-dom";

import { TINY_MCE_EDITOR_INIT } from "@/utils/constants";
import { useRequest } from "@/hooks";

const TestDetailsCreate = (props) => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const refresh = useRefresh();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailsType, setDetailsType] = useState("");
  const { refetch: onSave } = useRequest(
    `/misc/api/v1/admin/lab-items/details`,
    {
      method: "POST",
      body: {
        title: { en: title, bn: "bn" },
        description: { en: description, bn: "bn" },
        itemId: id,
        detailsType: detailsType,
      },
    },
    {
      onSuccess: () => {
        refresh();
        props.history.push(`/misc/api/v1/admin/lab-items/${id}/3`);
      },
    }
  );
  return (
    <div style={{ marginTop: 30 }}>
      <SimpleForm onSubmit={onSave} className={classes.mainDiv}>
        <TextInput
          source="title[en]"
          variant="outlined"
          label="Title(EN)"
          multiline
          onChange={(e) => setTitle(e.target.value)}
        />
        <SelectInput
          source="detailsType"
          label="Details Type"
          variant="outlined"
          choices={[
            {
              id: "risk_assessment",
              name: "Risk Assessment",
            },
            { id: "overview", name: "Overview" },
            { id: "ranges", name: "Ranges" },
            {
              id: "requirement_interpretation",
              name: "Test Result Interpretation",
            },
            { id: "sample_types", name: "Sample Types" },
          ]}
          onChange={(e) => setDetailsType(e.target.value)}
          alwaysOn
        />
        <Labeled label="Description" fullWidth>
          <Editor
            tinymceScriptSrc={
              process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
            }
            init={TINY_MCE_EDITOR_INIT as any}
            value={description}
            onEditorChange={(newValue) => setDescription(newValue)}
          />
        </Labeled>
      </SimpleForm>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  mainDiv: {
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid #e0e0e3",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    backgroundClip: "padding-box",
    backgroundColor: "#fff",
  },
}));
export default TestDetailsCreate;
