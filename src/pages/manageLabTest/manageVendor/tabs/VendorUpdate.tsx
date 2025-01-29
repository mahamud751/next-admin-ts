import { useState } from "react";
import {
  ImageField,
  ImageInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useRefresh,
} from "react-admin";
import { Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useFormState } from "react-final-form";

import { labTestUploadDataProvider } from "../../../../dataProvider";
import { useRequest } from "../../../../hooks";

const VendorUpdate = () => {
  const classes = useStyles();
  const refresh = useRefresh();
  const { values } = useFormState();
  const onSave = async (data) => {
    const payload = {
      name: {
        en: data?.name?.["en"] || "",
        bn: data?.name?.["bn"] || "",
      },
      status: data.status,
    };

    if (data?.["attachedFiles-image"]) {
      payload["attachedFiles-image"] = data["attachedFiles-image"];
    }

    try {
      await labTestUploadDataProvider.update(
        `misc/api/v1/admin/vendor/${values.id}`,
        {
          data: payload,
        }
      );
      refresh();
    } catch (err) {
      console.error("Error while saving:", err);
    }
  };

  const [translate, setTranslate] = useState("");
  const [recordImagesPayload, setRecordImagesPayload] = useState([]);
  const handleChange = (event: any) => {
    setTranslate(event.target.value as string);
  };
  const { refetch: toGoogleTranslate } = useRequest(
    `/translator/api/v1/translate`,
    {
      method: "POST",
      body: {
        text: translate,
      },
    },
    {
      onSuccess: (response) => {
        setRecordImagesPayload(response.data);
      },
    }
  );
  // @ts-ignore
  const bangla = recordImagesPayload?.translatedText;
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton label="Confirm" />
    </Toolbar>
  );

  return (
    <SimpleForm redirect="list" save={onSave} toolbar={<CustomToolbar />}>
      <Grid container spacing={1} style={{ width: "100%" }}>
        <Grid item xs={4}>
          <TextInput
            source="name[en]"
            value={translate}
            onChange={handleChange}
            variant="outlined"
            label="Vendor Name(EN)"
            minRows={3}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <div className={classes.translateDiv}>
            <Button
              className={classes.translateBtn}
              variant="contained"
              onClick={toGoogleTranslate}
              disableElevation
            >
              Translate
            </Button>
          </div>
        </Grid>
        <Grid item xs={6}>
          <TextInput
            source="name[bn]"
            defaultValue={bangla}
            variant="outlined"
            label="Vendor Name (BN)"
            minRows={3}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <SelectInput
            variant="outlined"
            source="status"
            choices={[
              { id: "active", name: "Active" },
              { id: "inactive", name: "Inactive" },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <ImageInput
            source="attachedFiles-image"
            label="Pictures (3000*3000 px)"
            accept="image/*"
            maxSize={10000000}
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        </Grid>
      </Grid>
    </SimpleForm>
  );
};
const useStyles = makeStyles(() => ({
  translateDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  translateBtn: {
    width: 180,
    height: 40,
  },
}));

export default VendorUpdate;
