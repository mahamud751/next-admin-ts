import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import {
  Labeled,
  SelectInput,
  SimpleForm,
  TextInput,
  useRefresh,
} from "react-admin";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation, useParams } from "react-router-dom";

import { useRequest } from "../../../hooks";
import { TINY_MCE_EDITOR_INIT } from "../../../utils/constants";

const TestDetailsEdit = (props) => {
  const classes = useStyles();
  const refresh = useRefresh();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const recordId = searchParams.get("recordId");
  const { data: labTest } = useRequest(
    `/misc/api/v1/admin/lab-items/details?itemId=${id}`,
    {},
    { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
  );
  const data = labTest?.find((item) => item.id === recordId);
  const [title, setTitle] = useState(data?.title?.en || null);
  const [description, setDescription] = useState(data?.description?.en || null);
  const [detailsType, setDetailsType] = useState(data?.detailsType || null);
  const [status, setStatus] = useState(data?.status || null);
  useEffect(() => {
    setTitle(data?.title?.en || null);
    setDescription(data?.description?.en || null);
    setDetailsType(data?.detailsType || null);
    setStatus(data?.status || null);
  }, [data]);

  const { refetch: onSave } = useRequest(
    `/misc/api/v1/admin/lab-items/details/${data?.id}`,
    {
      method: "PUT",
      body: {
        title: { en: title, bn: "bn" },
        description: { en: description, bn: "bn" },
        itemId: id,
        status: status,
        detailsType: detailsType,
        __v: data?.__v,
      },
    },
    {
      onSuccess: () => {
        refresh();
        props.history.push(`/misc/api/v1/admin/lab-items/${id}/3`);
      },
    }
  );
  const handleButtonClick = (event) => {
    event.preventDefault();
    onSave(event);
  };

  return (
    <div style={{ margin: "10px " }}>
      <SimpleForm toolbar={null} className={classes.mainDiv}>
        <TextInput
          source="title[en]"
          variant="outlined"
          label="Title(EN)"
          multiline
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={data?.title?.en}
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
          defaultValue={data?.detailsType}
        />
        <SelectInput
          source="status"
          label="Status"
          variant="outlined"
          choices={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "InActive" },
          ]}
          onChange={(e) => setStatus(e.target.value)}
          alwaysOn
          defaultValue={data?.status}
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
        <div className={classes.flex}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
            onClick={handleButtonClick}
          >
            Update Details
          </Button>{" "}
        </div>
      </SimpleForm>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  flex: {
    marginTop: 30,
  },
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "end",
  },
  button: {
    textTransform: "capitalize",
  },
  mainDiv: {
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid #e0e0e3",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    backgroundClip: "padding-box",
    backgroundColor: "#fff",
  },
}));

export default TestDetailsEdit;
