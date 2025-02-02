import {
  Grid,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FC, useCallback, useState } from "react";
import {
  ArrayInput,
  Create,
  CreateProps,
  FormDataConsumer,
  ImageField,
  ImageInput,
  NumberInput,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useCreate,
  useCreateController,
  useNotify,
  useRedirect,
} from "react-admin";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useDocumentTitle, useRequest } from "@/hooks";

const LabTestPckgCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test| Create");
  const classes = useStyles();
  const redirect = useRedirect();
  const notify = useNotify();
  const [create] = useCreate();

  const { data } = useRequest(
    "/misc/api/v1/admin/lab-items/sample-requirements",
    {},
    { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
  );
  const { data: categoryIds } = useRequest(
    "/misc/api/v1/admin/category/?page=1&limit=100",
    {},
    { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
  );
  const { isPending, save } = useCreateController({
    resource: "misc/api/v1/admin/lab-items",
  });

  if (isPending) return <div>Loading...</div>;

  const [translate, setTranslate] = useState("");
  const [testNametranslate, setTestNameTranslate] = useState("");
  const [testDescriptionTanslate, setDescriptionTranslate] = useState("");
  const [recordImagesPayload, setRecordImagesPayload] = useState([]);
  const [testRecordImagesPayload, setTestRecordImagesPayload] = useState([]);
  const [testDescription, setDescription] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState("");
  const handleItemTypeChange = (event) => {
    setSelectedItemType(event.target.value);
  };

  const handleChange = (event: any) => {
    setTranslate(event.target.value as string);
  };

  const handleChange2 = (event: any) => {
    setTestNameTranslate(event.target.value as string);
  };
  const handleChange3 = (event: any) => {
    setDescriptionTranslate(event.target.value as string);
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
  const { refetch: nameTranslate } = useRequest(
    `/translator/api/v1/translate`,
    {
      method: "POST",
      body: {
        text: testNametranslate,
      },
    },
    {
      onSuccess: (response) => {
        setTestRecordImagesPayload(response.data);
      },
    }
  );
  const { refetch: descriptionTranslate } = useRequest(
    `/translator/api/v1/translate`,
    {
      method: "POST",
      body: {
        text: testDescriptionTanslate,
      },
    },
    {
      onSuccess: (response) => {
        setDescription(response.data);
      },
    }
  );
  // @ts-ignore
  const bangla = recordImagesPayload?.translatedText;
  // @ts-ignore
  const bangla2 = testRecordImagesPayload?.translatedText;
  // @ts-ignore
  const bangla3 = testDescription?.translatedText;

  const [selectAll, setSelectAll] = useState(false);

  const categoryChoices =
    categoryIds?.map((category: { tag: any; name: { en: any } }) => ({
      id: category.tag,
      name: category.name.en,
    })) || [];

  const choices = selectAll ? categoryChoices.map((choice) => choice.id) : [];

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectAll(event.target.checked);
  };

  return (
    <Create {...rest} redirect="list">
      <SimpleForm onSubmit={save}>
        <Box style={{ width: "100%" }}>
          <Accordion defaultExpanded style={{ width: "100%" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="lab-test-details"
              id="lab-test-details-header"
              className={classes.label}
            >
              Lab Test Details
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <SelectInput
                      variant="outlined"
                      fullWidth
                      source="itemType"
                      choices={[
                        { id: "test", name: "Test" },
                        {
                          id: "package",
                          name: "Package",
                        },
                      ]}
                      onChange={handleItemTypeChange}
                      defaultValue={selectedItemType}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <SelectInput
                      variant="outlined"
                      fullWidth
                      source="targetGender"
                      choices={[
                        { id: "male", name: "Male" },
                        {
                          id: "female",
                          name: "Female",
                        },
                        {
                          id: "male_female",
                          name: "Both",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextInput
                      source="name[en]"
                      value={testRecordImagesPayload}
                      onChange={handleChange2}
                      variant="outlined"
                      label={
                        selectedItemType === "package"
                          ? "Package Name (EN)"
                          : "Test Name (EN)"
                      }
                      multiline
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <div
                      style={{
                        marginLeft: 30,
                        marginTop: 10,
                      }}
                    >
                      <Button
                        className={classes.translateBtn}
                        variant="contained"
                        onClick={nameTranslate}
                        disableElevation
                      >
                        Translate
                      </Button>
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <TextInput
                      source="name[bn]"
                      defaultValue={bangla2}
                      variant="outlined"
                      label={
                        selectedItemType === "package"
                          ? "Package Name (BN)"
                          : "Test Name (BN)"
                      }
                      multiline
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextInput
                      source="subTitle[en]"
                      value={translate}
                      onChange={handleChange}
                      variant="outlined"
                      label={
                        selectedItemType === "package"
                          ? "Package Sub Title (EN)"
                          : "Test Sub Title (EN)"
                      }
                      multiline
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <div
                      style={{
                        marginLeft: 30,
                        marginTop: 10,
                      }}
                    >
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
                      source="subTitle[bn]"
                      defaultValue={bangla}
                      variant="outlined"
                      label={
                        selectedItemType === "package"
                          ? "Package Sub Title (BN)"
                          : "Test Sub Title (BN)"
                      }
                      multiline
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextInput
                      source="description[en]"
                      value={testDescriptionTanslate}
                      onChange={handleChange3}
                      variant="outlined"
                      label={
                        selectedItemType === "package"
                          ? "Package Description (EN)"
                          : "Test Description (EN)"
                      }
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
                        onClick={descriptionTranslate}
                        disableElevation
                      >
                        Translate
                      </Button>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <TextInput
                      source="description[bn]"
                      defaultValue={bangla3}
                      variant="outlined"
                      label={
                        selectedItemType === "package"
                          ? "Package Description (BN)"
                          : "Test Description (BN)"
                      }
                      minRows={3}
                      multiline
                      fullWidth
                    />
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <NumberInput
                        source="targetAge.start"
                        variant="outlined"
                        fullWidth
                        label="Target Age Start"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <NumberInput
                        source="targetAge.end"
                        variant="outlined"
                        fullWidth
                        label="Target Age End"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <NumberInput
                      source="reportAvailableHour"
                      variant="outlined"
                      fullWidth
                      label="Report Available Hour"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextInput
                      source="fastingRequired"
                      variant="outlined"
                      label="Fasting Required (Yes/ No/ (as like 10 -12 Hrs))"
                      fullWidth
                    />
                  </Grid>

                  {selectedItemType !== "package" && (
                    <>
                      <Grid item xs={6}>
                        <ArrayInput source="sampleRequirements">
                          <SimpleFormIterator>
                            <SelectInput
                              variant="outlined"
                              label="sampleRequirements (EN)"
                              fullWidth
                              source={"en"}
                              choices={data?.map(
                                (requirement: { en: any }) => ({
                                  id: requirement.en,
                                  name: requirement.en,
                                })
                              )}
                            />
                            <SelectInput
                              variant="outlined"
                              label="sampleRequirements (BN)"
                              fullWidth
                              source={"bn"}
                              choices={data?.map(
                                (requirement: { bn: any }) => ({
                                  id: requirement.bn,
                                  name: requirement.bn,
                                })
                              )}
                            />
                          </SimpleFormIterator>
                        </ArrayInput>
                      </Grid>
                    </>
                  )}
                  {selectedItemType === "package" && (
                    <Grid item xs={12}>
                      <ImageInput
                        source="attachedFiles-homeIcon"
                        label="Home Icon (120*120 px)"
                        // accept="image/*"
                        maxSize={10000000}
                      >
                        <ImageField source="src" title="title" />
                      </ImageInput>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded style={{ margin: "20px 0" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="lab-test-content"
              id="lab-test-content-header"
              className={classes.label}
            >
              Contents
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                    }
                    label="Select All"
                  />
                  <SelectArrayInput
                    source="tags"
                    label="Tags"
                    variant="outlined"
                    helperText={false}
                    choices={categoryChoices}
                    fullWidth
                    defaultValue={choices}
                  />
                </Grid>
                <Grid item xs={12}>
                  {" "}
                  <ArrayInput source="knownAs">
                    <SimpleFormIterator>
                      <TextInput
                        source={"en"}
                        variant="outlined"
                        label="knownAs (EN)"
                        fullWidth
                      />
                      <TextInput
                        source={"bn"}
                        variant="outlined"
                        label="knownAs (BN)"
                        fullWidth
                      />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Grid>
                <Grid item xs={12}>
                  <ImageInput
                    source="attachedFiles-bannerImage"
                    label="Product Image( APP 1080*1080 px )"
                    // accept="image/*"
                    maxSize={10000000}
                  >
                    <ImageField source="src" title="title" />
                  </ImageInput>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
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
  label: {
    background: "#f6f6f6",
    fontWeight: "bold",
    fontSize: 20,
  },
}));

export default LabTestPckgCreate;
