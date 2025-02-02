import {
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import {
  ArrayInput,
  FormDataConsumer,
  ImageField,
  ImageInput,
  NumberInput,
  SaveButton,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  Toolbar,
  TranslatableInputs,
  useEditContext,
  useRedirect,
  useNotify,
} from "react-admin";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { labTestUploadDataProvider } from "@/dataProvider";

const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton label="Test Update" />
  </Toolbar>
);

const LabTestDetails = () => {
  const classes = useStyles();
  const redirect = useRedirect();
  const notify = useNotify();
  const { record } = useEditContext();
  const values = useWatch();

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

  const onSave = async (data) => {
    const payload = {
      name: {
        en: data?.name?.["en"] || "",
        bn: data?.name?.["bn"] || "",
      },
      subTitle: {
        en: data?.subTitle?.["en"] || "",
        bn: data?.subTitle?.["bn"] || "",
      },
      description: {
        en: data?.description?.["en"] || "",
        bn: data?.description?.["bn"] || "",
      },
      targetGender: data.targetGender,
      itemType: data.itemType,
      targetAge: {
        start: data.targetAge.start,
        end: data.targetAge.end,
      },
      reportAvailableHour: data.reportAvailableHour,
      fastingRequired: data.fastingRequired,
      sampleRequirements: data.sampleRequirements,
      tags: data.tags,
      knownAs: data.knownAs,
      status: data.status,
      __v: data.__v,
    };

    if (data?.["attachedFiles-homeIcon"]) {
      payload["attachedFiles-homeIcon"] = data["attachedFiles-homeIcon"];
    }
    if (data?.["attachedFiles-bannerImage"]) {
      payload["attachedFiles-bannerImage"] = data["attachedFiles-bannerImage"];
    }

    try {
      await labTestUploadDataProvider.update(
        `misc/api/v1/admin/lab-items/${values.id}`,
        {
          data: payload,
        }
      );
      notify("Successfully lab test updated!", { type: "success" });
      redirect("/misc/api/v1/admin/lab-items");
    } catch (err: any) {
      notify(err.message || "Failed!", { type: "warning" });
    }
  };
  return (
    <SimpleForm onSubmit={onSave} toolbar={<CustomToolbar />}>
      <>
        <Accordion defaultExpanded style={{ marginTop: 10 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.label}
          >
            Details
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} style={{ width: "100%" }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TranslatableInputs locales={["en", "bn"]}>
                    <TextInput source="name" variant="outlined" fullWidth />
                  </TranslatableInputs>
                </Grid>
                <Grid item xs={6}>
                  <TranslatableInputs locales={["en", "bn"]}>
                    <TextInput
                      source="subTitle"
                      label="Sub Title"
                      variant="outlined"
                      fullWidth
                    />
                  </TranslatableInputs>
                </Grid>
                <Grid item xs={6}>
                  <TranslatableInputs locales={["en", "bn"]}>
                    <TextInput
                      source="description"
                      variant="outlined"
                      fullWidth
                      minRows={3}
                      multiline
                    />
                  </TranslatableInputs>
                </Grid>
                <Grid item xs={3}>
                  <SelectInput
                    variant="outlined"
                    fullWidth
                    source="targetGender"
                    choices={[
                      {
                        id: "male",
                        name: "Male",
                      },
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
                <Grid item xs={3}>
                  <SelectInput
                    variant="outlined"
                    fullWidth
                    source="itemType"
                    choices={[
                      {
                        id: "test",
                        name: "Test",
                      },
                      {
                        id: "package",
                        name: "Package",
                      },
                    ]}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <SelectInput
                    variant="outlined"
                    fullWidth
                    source="status"
                    choices={[
                      {
                        id: "active",
                        name: "Active",
                      },
                      {
                        id: "inactive",
                        name: "Inactive",
                      },
                    ]}
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

                <Grid item xs={4}>
                  <NumberInput
                    source="reportAvailableHour"
                    variant="outlined"
                    fullWidth
                    label="Report Available Hour"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextInput
                    source="fastingRequired"
                    variant="outlined"
                    label="Fasting Required (Yes/ No/ (as like 10 -12 Hrs))"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <ArrayInput
                    source="sampleRequirements"
                    disabled={record?.itemType === "package"}
                  >
                    <SimpleFormIterator inline>
                      <SelectInput
                        variant="outlined"
                        label="sampleRequirements (EN)"
                        // disabled={record?.itemType === "package"}
                        fullWidth
                        source={"en"}
                        choices={data?.map((requirement: { en: any }) => ({
                          id: requirement.en,
                          name: requirement.en,
                        }))}
                      />
                      <SelectInput
                        variant="outlined"
                        label="sampleRequirements (BN)"
                        fullWidth
                        // disabled={record?.itemType === "package"}
                        source={"bn"}
                        choices={data?.map((requirement: { bn: any }) => ({
                          id: requirement.bn,
                          name: requirement.bn,
                        }))}
                      />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Grid>

                <Grid item xs={6} style={{ display: "none" }}>
                  <NumberInput
                    source="__v"
                    variant="outlined"
                    label="Version"
                    fullWidth
                  />
                </Grid>
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
              <Grid item xs={4}>
                <SelectArrayInput
                  source="tags"
                  label="Tags"
                  variant="outlined"
                  helperText={false}
                  choices={categoryIds?.map(
                    (category: { tag: any; name: { en: any } }) => ({
                      id: category.tag,
                      name: category.name.en,
                    })
                  )}
                  fullWidth
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
                {record?.itemType === "package" && (
                  <Grid item xs={12}>
                    <ImageInput
                      source="attachedFiles-homeIcon"
                      label="Home Icon (120*120 px)"
                      //   accept="image/*"
                      maxSize={10000000}
                    >
                      <ImageField source="src" title="title" />
                    </ImageInput>
                  </Grid>
                )}
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
            </Grid>
          </AccordionDetails>
        </Accordion>
      </>
    </SimpleForm>
  );
};

const useStyles = makeStyles(() => ({
  label: {
    background: "#f6f6f6",
    fontWeight: "bold",
    fontSize: 20,
  },
  card: {
    display: "flex",
    justifyContent: "end",
    margin: "10px 0",
    border: "1px solid #E0E0E0",
    padding: 10,
  },
}));

export default LabTestDetails;
