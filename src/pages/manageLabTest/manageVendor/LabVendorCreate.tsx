import { Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FC, useState } from "react";
import {
  Create,
  CreateProps,
  ImageField,
  ImageInput,
  SimpleForm,
  TextInput,
} from "react-admin";

import { useDocumentTitle, useRequest } from "@/hooks";

const LabVendorCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga |Lab Test | Vendor Create");
  const classes = useStyles();
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
  return (
    <Create {...props}>
      <SimpleForm redirect="list">
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
    </Create>
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

export default LabVendorCreate;
