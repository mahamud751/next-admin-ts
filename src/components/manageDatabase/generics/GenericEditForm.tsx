import {
  AccordionDetails,
  AccordionSummary,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import { createStyles, makeStyles, withStyles } from "@mui/styles";
import {
  AddCircleOutline as AddOutlined,
  ArrowDownward,
  ArrowUpward,
  DeleteRounded,
  ExpandMore,
} from "@mui/icons-material";
import React, { Children, cloneElement, useEffect, useState } from "react";
import {
  FunctionField,
  IconButtonWithTooltip,
  RaRecord as Record,
  SelectInput,
  TextInput,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { FieldArray } from "react-final-form-arrays";

import { capitalizeFirstLetter, isObject } from "@/utils/helpers";

import ElevatedActionDialog from "./ElevatedActionDialog";
import InputTranslate from "./InputTranslate";
import GenericPreview from "./Preview";
import RichTextTranslate from "./RichTextTranslate";
import AroggaButton from "@/components/common/AroggaButton";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

const GenericEditForm = ({ language, permissions, ...rest }) => {
  const [action, setAction] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useStyles();
  const { setValue } = useFormContext();
  const { values } = useWatch();
  const [expanded, setExpanded] = React.useState<string | false>(
    "brief-description"
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handlePush = ({ fields, index, value }) => {
    fields.push(value);
    setAnchorEl(null);
  };

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const keys = [
    "g_name",
    "g_is_antibiotics",
    "g_is_controlled",
    "g_overview",
    "g_overview_bn",
    "g_quick_tips",
    "g_quick_tips_bn",
    "g_safety_advices",
    "g_safety_advices_bn",
  ];

  const { changeData } = rest.record;

  useEffect(() => {
    keys.forEach((key) => {
      if (key === "g_is_antibiotics" || key === "g_is_controlled") {
        setValue(
          key,
          changeData?.hasOwnProperty(key) ? changeData?.[key] : values?.[key]
        );
      } else {
        if (changeData?.[key]) {
          setValue(key, changeData?.[key]);
        } else {
          setValue(key, values?.[key]);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.record]);

  const compare = (key) => {
    if (
      !rest.record?.changed_medicine?.[key] &&
      rest.record?.[key] === values?.[key]
    )
      return;
    let orginalText;
    let inputValueArr;
    let unchangedRecordValueArr;

    unchangedRecordValueArr = rest.record?.[key]?.toString().split("");
    if (key === "g_is_antibiotics" || key === "g_is_controlled") {
      orginalText = !!rest.record?.[key] ? ["true"] : ["false"];
      inputValueArr = !!values?.[key] ? ["true"] : ["false"];
    } else {
      orginalText = rest.record?.[key];
      inputValueArr = values?.[key]?.toString().split("");
    }

    const compareText = [];

    inputValueArr?.forEach((_, i) => {
      compareText.push(
        <span
          key={i}
          className={
            inputValueArr?.[i] !== unchangedRecordValueArr?.[i]
              ? "compare-medicine-highlight"
              : ""
          }
        >
          {inputValueArr[i]}
        </span>
      );
    });
    return (
      <span
        style={{
          position: "absolute",
          left: 8,
          top: key === "g_name" ? 65 : 52,
          color: "#7C8AA0",
          fontSize: 13,
        }}
      >
        {orginalText} &gt; {compareText}
      </span>
    );
  };
  const getInitialValue = (index) => {
    const briefDescriptions =
      values[`g_brief_description${language === "en" ? "" : `_${language}`}`] ||
      [];
    return briefDescriptions[index]?.content || "";
  };
  const getInitialMedicalValue = (index) => {
    const briefDescriptions =
      values[`g_overview${language === "en" ? "" : `_${language}`}`] || [];
    return briefDescriptions[index]?.content || "";
  };
  const getInitialSafetyValue = (index) => {
    const briefDescriptions =
      values[`g_safety_advices${language === "en" ? "" : `_${language}`}`] ||
      [];
    return briefDescriptions[index]?.content || "";
  };

  return (
    <div className={classes.root}>
      {language ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {/* TODO: Have to use Arogga Accordion */}

            <Accordion
              expanded={expanded === "brief-description"}
              onChange={handleChange("brief-description")}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="brief-description-content"
                id="brief-description-header"
              >
                Brief Description
              </AccordionSummary>
              <AccordionDetails
                id="brief-description-content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <FieldArray
                  name={`g_brief_description${
                    language === "en" ? "" : `_${language}`
                  }`}
                >
                  {({ fields }) => (
                    <>
                      {fields?.map((name, index) => {
                        return (
                          <div
                            key={name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: "1rem",
                                width: "80%",
                                borderTop: "1px solid #ccc",
                                borderLeft: "1px solid #ccc",
                                borderRight: "1px solid #ccc",
                                padding: "1rem",
                                borderBottom:
                                  index === fields.length - 1
                                    ? "1px solid #ccc"
                                    : "none",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    marginRight: "1rem",
                                  }}
                                >
                                  {index + 1} .
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "90%",
                                }}
                              >
                                <InputTranslate
                                  source={`${name}.title`}
                                  label="Title"
                                  values={values}
                                  form={setValue}
                                  translate={language === "bn" ? true : false}
                                  fullWidth={true}
                                />
                                <RichTextTranslate
                                  label="Content"
                                  source={`${name}.content`}
                                  form={setValue}
                                  values={values}
                                  translate={language === "bn"}
                                  fullWidth={true}
                                  initialValue={getInitialValue(index)}
                                  onChange={(newValue) => {
                                    setValue(`${name}.content`, newValue);
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              style={{
                                width: "10%",
                                marginLeft: "1rem",
                              }}
                            >
                              <IconButtonWithTooltip
                                aria-label="Add"
                                disabled={index !== fields.length - 1}
                                size="small"
                                label="Add"
                                children={
                                  <AddOutlined
                                    color={
                                      (index === fields.length - 1 &&
                                        "primary") ||
                                      "disabled"
                                    }
                                  />
                                }
                                onClick={() =>
                                  handlePush({
                                    fields,
                                    index,
                                    value: {
                                      title: "",
                                      content: "",
                                    },
                                  })
                                }
                              />

                              <IconButtonWithTooltip
                                aria-label="delete"
                                size="small"
                                label="Delete"
                                children={
                                  <DeleteRounded
                                    style={{
                                      color: "#EF1962",
                                    }}
                                  />
                                }
                                onClick={() => fields.remove(index)}
                              />
                              <IconButtonWithTooltip
                                aria-label="move up"
                                size="small"
                                label="Move Up"
                                children={
                                  <ArrowUpward
                                    style={{
                                      color: index !== 0 && "orange",
                                    }}
                                  />
                                }
                                disabled={index === 0}
                                onClick={() => fields.move(index, index - 1)}
                              />
                              <IconButtonWithTooltip
                                aria-label="move down"
                                size="small"
                                label="Move Down"
                                disabled={index === fields.length - 1}
                                children={
                                  <ArrowDownward
                                    style={{
                                      color:
                                        index !== fields.length - 1 && "orange",
                                    }}
                                  />
                                }
                                onClick={() => fields.move(index, index + 1)}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div
                        style={{
                          display: fields.length === 0 ? "flex" : "none",
                          justifyContent: "center",
                          marginTop: "1rem",
                        }}
                      >
                        <AroggaButton
                          type="success"
                          label="New Entry"
                          //@ts-ignore
                          onClick={() =>
                            handlePush({
                              fields,
                              index: 0,
                              value: {
                                title: "",
                                content: "",
                              },
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </FieldArray>
              </AccordionDetails>
            </Accordion>
            {/* Medical  Overview */}
            <Accordion
              expanded={expanded === "overview"}
              onChange={handleChange("overview")}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="overview-content"
                id="overview-header"
              >
                Medical Overview
              </AccordionSummary>
              <AccordionDetails
                id="overview-content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <FieldArray
                  name={`g_overview${language === "en" ? "" : `_${language}`}`}
                >
                  {({ fields }) => (
                    <>
                      {fields?.map((name, index) => {
                        return (
                          <div
                            key={name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: "1rem",
                                width: "80%",
                                borderTop: "1px solid #ccc",
                                borderLeft: "1px solid #ccc",
                                borderRight: "1px solid #ccc",
                                padding: "1rem",
                                borderBottom:
                                  index === fields.length - 1
                                    ? "1px solid #ccc"
                                    : "none",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    marginRight: "1rem",
                                  }}
                                >
                                  {index + 1} .
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "90%",
                                }}
                              >
                                <InputTranslate
                                  source={`${name}.title`}
                                  label="Title"
                                  values={values}
                                  form={setValue}
                                  translate={language === "bn" ? true : false}
                                  fullWidth={true}
                                />
                                {isObject(fields.value[index].content) ? (
                                  <div
                                    style={{
                                      borderLeft: "1px solid #ccc",
                                      paddingLeft: "1rem",
                                      marginTop: "1rem",
                                      border: "1px solid #ccc",
                                    }}
                                  >
                                    <InputTranslate
                                      source={`${name}.content.tag`}
                                      label="Tag"
                                      values={values}
                                      form={setValue}
                                      translate={
                                        language === "bn" ? true : false
                                      }
                                      fullWidth={true}
                                    />
                                    <FieldArrayInput
                                      source={`${name}.content.list`}
                                      pushValue={""}
                                      borderd={false}
                                    >
                                      <InputTranslate
                                        source=""
                                        label="Title"
                                        values={values}
                                        form={setValue}
                                        translate={
                                          language === "bn" ? true : false
                                        }
                                        fullWidth={true}
                                      />
                                    </FieldArrayInput>
                                  </div>
                                ) : (
                                  <RichTextTranslate
                                    label="Content"
                                    source={`${name}.content`}
                                    form={setValue}
                                    values={values}
                                    translate={language === "bn"}
                                    fullWidth={true}
                                    initialValue={getInitialMedicalValue(index)}
                                    onChange={(newValue) => {
                                      setValue(`${name}.content`, newValue);
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                width: "10%",
                                marginLeft: "1rem",
                              }}
                            >
                              <IconButtonWithTooltip
                                aria-label="add"
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                size="small"
                                label="Add"
                                children={
                                  <AddOutlined
                                    color={
                                      (index === fields.length - 1 &&
                                        "primary") ||
                                      "disabled"
                                    }
                                  />
                                }
                                disabled={index !== fields.length - 1}
                                onClick={handleClick}
                                color="primary"
                              />
                              <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                PopoverClasses={{
                                  paper: classes.paper,
                                }}
                                keepMounted
                                open={!!anchorEl}
                                onClose={handleClose}
                              >
                                <MenuItem
                                  onClick={() =>
                                    handlePush({
                                      fields,
                                      index,
                                      value: {
                                        title: "",
                                        content: "",
                                      },
                                    })
                                  }
                                >
                                  Title & Content
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    handlePush({
                                      fields,
                                      index,
                                      value: {
                                        title: "",
                                        content: {
                                          tag: "",
                                          list: [""],
                                        },
                                      },
                                    })
                                  }
                                >
                                  Title & List
                                </MenuItem>
                              </Menu>
                              <IconButtonWithTooltip
                                aria-label="delete"
                                size="small"
                                label="Delete"
                                children={
                                  <DeleteRounded
                                    style={{
                                      color: "#EF1962",
                                    }}
                                  />
                                }
                                onClick={() => fields.remove(index)}
                              />
                              <IconButtonWithTooltip
                                aria-label="move up"
                                size="small"
                                label="Move Up"
                                children={
                                  <ArrowUpward
                                    style={{
                                      color: index !== 0 && "orange",
                                    }}
                                  />
                                }
                                disabled={index === 0}
                                onClick={() => fields.move(index, index - 1)}
                              />
                              <IconButtonWithTooltip
                                aria-label="move down"
                                size="small"
                                label="Move Down"
                                disabled={index === fields.length - 1}
                                children={
                                  <ArrowDownward
                                    style={{
                                      color:
                                        index !== fields.length - 1 && "orange",
                                    }}
                                  />
                                }
                                onClick={() => fields.move(index, index + 1)}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div
                        style={{
                          display: fields.length === 0 ? "flex" : "none",
                          justifyContent: "center",
                          marginTop: "1rem",
                        }}
                      >
                        <AroggaButton
                          type="success"
                          label="New Entry"
                          //@ts-ignore
                          onClick={handleClick}
                        />
                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          PopoverClasses={{
                            paper: classes.paper,
                          }}
                          open={!!anchorEl}
                          onClose={handleClose}
                          keepMounted
                        >
                          <MenuItem
                            onClick={() =>
                              handlePush({
                                fields,
                                index: 0,
                                value: {
                                  title: "",
                                  content: "",
                                },
                              })
                            }
                          >
                            Title & Content
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handlePush({
                                fields,
                                index: 0,
                                value: {
                                  title: "",
                                  content: {
                                    tag: "",
                                    list: [""],
                                  },
                                },
                              })
                            }
                          >
                            Title & List
                          </MenuItem>
                        </Menu>
                      </div>
                    </>
                  )}
                </FieldArray>
              </AccordionDetails>
            </Accordion>
            {/* Quick Tips */}

            <Accordion
              expanded={expanded === "quick-tips"}
              onChange={handleChange("quick-tips")}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="quick-tips"
                id="quick-tips-header"
              >
                Quick Tips
              </AccordionSummary>
              <AccordionDetails
                id="quick-tips-content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <FieldArrayInput
                  source={`g_quick_tips${
                    language === "en" ? "" : `_${language}`
                  }`}
                  pushValue={""}
                  record={rest.record}
                  ownKey={`g_brief_description${
                    language === "en" ? "" : `_${language}`
                  }`}
                >
                  <InputTranslate
                    source=""
                    label="Title"
                    values={values}
                    form={setValue}
                    translate={language === "bn" ? true : false}
                    fullWidth={true}
                  />
                </FieldArrayInput>
              </AccordionDetails>
            </Accordion>
            {/* Safety Advices */}
            <Accordion
              expanded={expanded === "safety-advices"}
              onChange={handleChange("safety-advices")}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="safety-advices-content"
                id="safety-advices-header"
              >
                Safety Advices
              </AccordionSummary>
              <AccordionDetails
                id="safety-advices-content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <FieldArray
                  name={`g_safety_advices${
                    language === "en" ? "" : `_${language}`
                  }`}
                >
                  {({ fields }) => (
                    <>
                      {fields?.map((name, index) => {
                        return (
                          <div
                            key={name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: "1rem",
                                width: "80%",
                                borderTop: "1px solid #ccc",
                                borderLeft: "1px solid #ccc",
                                borderRight: "1px solid #ccc",
                                padding: "1rem",
                                borderBottom:
                                  index === fields.length - 1
                                    ? "1px solid #ccc"
                                    : "none",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    marginRight: "1rem",
                                  }}
                                >
                                  {index + 1} .
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "90%",
                                }}
                              >
                                <SelectInput
                                  source={`${name}.type`}
                                  label="type"
                                  values={values}
                                  form={form}
                                  variant="outlined"
                                  choices={[
                                    {
                                      id: "Alcohol",
                                      name: "Alcohol",
                                    },
                                    {
                                      id: "Pregnancy",
                                      name: "Pregnancy",
                                    },
                                    {
                                      id: "Breastfeeding",
                                      name: "Breastfeeding",
                                    },
                                    {
                                      id: "Driving",
                                      name: "Driving",
                                    },
                                    {
                                      id: "Kidney",
                                      name: "Kidney",
                                    },
                                    {
                                      id: "Liver",
                                      name: "Liver",
                                    },
                                  ]}
                                  fullWidth
                                />
                                <SelectInput
                                  source={`${name}.tag`}
                                  values={values}
                                  form={form}
                                  label="Tag"
                                  variant="outlined"
                                  choices={[
                                    {
                                      id: "SAFE",
                                      name: "SAFE",
                                    },
                                    {
                                      id: "UNSAFE",
                                      name: "UNSAFE",
                                    },
                                    {
                                      id: "SAFE IF PRESCRIBED",
                                      name: "SAFE IF PRESCRIBED",
                                    },
                                    {
                                      id: "CAUTION",
                                      name: "CAUTION",
                                    },
                                    {
                                      id: "CONSULT YOUR DOCTOR",
                                      name: "CONSULT YOUR DOCTOR",
                                    },
                                  ]}
                                  fullWidth
                                />

                                <RichTextTranslate
                                  label="Content"
                                  source={`${name}.content`}
                                  form={setValue}
                                  values={values}
                                  translate={language === "bn"}
                                  fullWidth={true}
                                  initialValue={getInitialSafetyValue(index)}
                                  onChange={(newValue) => {
                                    setValue(`${name}.content`, newValue);
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              style={{
                                width: "10%",
                                marginLeft: "1rem",
                              }}
                            >
                              <IconButtonWithTooltip
                                aria-label="Add"
                                disabled={index !== fields.length - 1}
                                size="small"
                                label="Add"
                                children={
                                  <AddOutlined
                                    color={
                                      (index === fields.length - 1 &&
                                        "primary") ||
                                      "disabled"
                                    }
                                  />
                                }
                                onClick={() =>
                                  handlePush({
                                    fields,
                                    index: 0,
                                    value: {
                                      type: "",
                                      tag: "",
                                      content: "",
                                    },
                                  })
                                }
                              />

                              <IconButtonWithTooltip
                                aria-label="delete"
                                size="small"
                                label="Delete"
                                children={
                                  <DeleteRounded
                                    style={{
                                      color: "#EF1962",
                                    }}
                                  />
                                }
                                onClick={() => fields.remove(index)}
                              />
                              <IconButtonWithTooltip
                                aria-label="move up"
                                size="small"
                                label="Move Up"
                                children={
                                  <ArrowUpward
                                    style={{
                                      color: index !== 0 && "orange",
                                    }}
                                  />
                                }
                                disabled={index === 0}
                                onClick={() => fields.move(index, index - 1)}
                              />
                              <IconButtonWithTooltip
                                aria-label="move down"
                                size="small"
                                label="Move Down"
                                disabled={index === fields.length - 1}
                                children={
                                  <ArrowDownward
                                    style={{
                                      color:
                                        index !== fields.length - 1 && "orange",
                                    }}
                                  />
                                }
                                onClick={() => fields.move(index, index + 1)}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div
                        style={{
                          display: fields.length === 0 ? "flex" : "none",
                          justifyContent: "center",
                          marginTop: "1rem",
                        }}
                      >
                        <AroggaButton
                          type="success"
                          label="New Entry"
                          //@ts-ignore
                          onClick={() =>
                            handlePush({
                              fields,
                              index: 0,
                              value: {
                                type: "",
                                tag: "",
                                content: "",
                              },
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </FieldArray>
              </AccordionDetails>
            </Accordion>

            {/* g_question_answer */}
            <Accordion
              expanded={expanded === "question-answer"}
              onChange={handleChange("question-answer")}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="question-answer"
                id="question-answer-header"
              >
                Question & Answer
              </AccordionSummary>
              <AccordionDetails
                id="question-answer-content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <FieldArrayInput
                  source={`g_question_answer${
                    language === "en" ? "" : `_${language}`
                  }`}
                  pushValue={{
                    q: "",
                    a: "",
                  }}
                  record={rest.record}
                  ownKey={`g_question_answer${
                    language === "en" ? "" : `_${language}`
                  }`}
                >
                  <InputTranslate
                    source="q"
                    label="Question"
                    values={values}
                    form={setValue}
                    translate={language === "bn" ? true : false}
                    fullWidth={true}
                  />
                  <InputTranslate
                    source="a"
                    label="Answer"
                    values={values}
                    form={setValue}
                    translate={language === "bn" ? true : false}
                    fullWidth={true}
                  />
                </FieldArrayInput>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} sm={6}>
            <GenericPreview
              handleChange={handleChange}
              expanded={expanded}
              values={values}
              record={rest.record}
              language={language}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          style={{ marginBottom: 15, marginTop: 10, marginLeft: 10 }}
        >
          <Grid item sm={6} md={3}>
            <Grid container spacing={2}>
              <Grid item md={12} className={classes.positionRelative}>
                <TextInput
                  source="g_name"
                  label="Generic"
                  variant="outlined"
                  fullWidth
                />
                {compare("g_name")}
              </Grid>
              <Grid item md={12} className={classes.positionRelative}>
                <FormatedBooleanInput
                  source="g_is_antibiotics"
                  label="Antibiotics"
                />
                {compare("g_is_antibiotics")}
              </Grid>
              <Grid item md={12} className={classes.positionRelative}>
                <FormatedBooleanInput
                  source="g_is_controlled"
                  label="Controlled"
                />
                {compare("g_is_controlled")}
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6} md={3} style={{ textAlign: "center" }}>
            <FunctionField
              render={(record: Record) => {
                return (
                  <span>
                    <span
                      style={{
                        color: "#7C8AA0",
                        fontSize: 18,
                        marginRight: 5,
                      }}
                    >
                      Approval Status:
                    </span>
                    <span
                      style={
                        record.g_approval_status === "approved"
                          ? {
                              color: "#008069",
                              fontSize: 18,
                            }
                          : record.g_approval_status === "rejected"
                          ? {
                              color: "#EF1962",
                              fontSize: 18,
                            }
                          : {
                              color: "#7C8AA0",
                              fontSize: 18,
                            }
                      }
                    >
                      {capitalizeFirstLetter(record.g_approval_status)}
                    </span>
                  </span>
                );
              }}
            />
          </Grid>
          <Grid item sm={6} md={3}>
            <FunctionField
              render={(record: Record) => {
                return record.g_approval_status === "rejected" &&
                  record.reason ? (
                  <span>
                    <span
                      style={{
                        color: "#7C8AA0",
                        fontSize: 18,
                        marginRight: 5,
                      }}
                    >
                      Rejected Reason:
                    </span>
                    <span
                      style={{
                        color: "#EF1962",
                        fontSize: 18,
                      }}
                    >
                      {record?.reason}
                    </span>
                  </span>
                ) : null;
              }}
            />
          </Grid>
          {permissions?.includes("canApproveGeneric") && (
            <Grid item sm={6} md={3}>
              <FunctionField
                render={(record: Record) => {
                  return (
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {record.g_approval_status !== "cancelled" &&
                        record.g_approval_status !== "approved" && (
                          <AroggaButton
                            label="Cancel"
                            type="secondary"
                            onClick={() => {
                              setAction("cancelled");
                              setIsDialogOpen(true);
                            }}
                          />
                        )}
                      {record.g_approval_status !== "rejected" &&
                        record.g_approval_status !== "approved" && (
                          <>
                            <span
                              style={{
                                marginLeft: 8,
                              }}
                            />
                            <AroggaButton
                              label="Reject"
                              type="danger"
                              onClick={() => {
                                setAction("rejected");
                                setIsDialogOpen(true);
                              }}
                            />
                          </>
                        )}
                      {record.g_approval_status !== "approved" && (
                        <>
                          <span
                            style={{
                              marginLeft: 8,
                            }}
                          />
                          <AroggaButton
                            label="Approve"
                            type="success"
                            onClick={() => {
                              setAction("approved");
                              setIsDialogOpen(true);
                            }}
                          />
                        </>
                      )}
                      <ElevatedActionDialog
                        action={action}
                        open={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                      />
                    </div>
                  );
                }}
              />
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
};

export default GenericEditForm;

const FieldArrayInput = ({
  source,
  children,
  pushValue,
  borderd = true,
  record = {},
  ownKey = "",
}) => {
  const arrayChildren = Children.toArray(children);
  const { setValue } = useFormContext();
  const { values } = useWatch();
  const { changeData } = record as any;
  const keys = [
    "g_brief_description",
    "g_brief_description_bn",
    "g_quick_tips",
    "g_quick_tips_bn",
    "g_safety_advices",
    "g_safety_advices_bn",
    "g_question_answer",
    "g_question_answer_bn",
  ];
  useEffect(() => {
    keys.forEach((key) => {
      if (key === ownKey) {
        if (changeData?.[key]) {
          setValue(key, changeData?.[key]);
        } else {
          setValue(key, values?.[key]);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);
  return (
    <FieldArray name={source}>
      {({ fields }) => (
        <>
          {fields?.map((name, index) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: "1rem",
                  width: "100%",
                  ...(borderd && {
                    borderTop: "1px solid #ccc",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                    borderBottom:
                      index === fields.length - 1 ? "1px solid #ccc" : "none",
                    padding: "1rem",
                  }),
                }}
              >
                <>
                  <span
                    style={{
                      marginRight: "1rem",
                    }}
                  >
                    {index + 1} .
                  </span>
                </>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                  }}
                >
                  {Children.map(arrayChildren, (child) => {
                    if (!React.isValidElement(child)) return;

                    return cloneElement(child, {
                      ...child.props,
                      source: child.props.source
                        ? `${name}.${child.props.source}`
                        : `${name}`,
                      paranetName: name,
                      key: `${name}.${child.key}`,
                      label: child.props.label,
                    });
                  })}
                </div>
              </div>
              <div
                style={{
                  width: "15%",
                  marginLeft: "1rem",
                }}
              >
                <IconButtonWithTooltip
                  aria-label="Add"
                  disabled={index !== fields.length - 1}
                  size="small"
                  label="Add"
                  children={
                    <AddOutlined
                      color={
                        (index === fields.length - 1 && "primary") || "disabled"
                      }
                    />
                  }
                  onClick={() => fields.push(pushValue)}
                />
                <IconButtonWithTooltip
                  aria-label="delete"
                  size="small"
                  label="Delete"
                  children={
                    <DeleteRounded
                      style={{
                        color: "#EF1962",
                      }}
                    />
                  }
                  onClick={() => fields.remove(index)}
                />
                <IconButtonWithTooltip
                  aria-label="move up"
                  size="small"
                  label="Move Up"
                  children={
                    <ArrowUpward
                      style={{
                        color: index !== 0 && "orange",
                      }}
                    />
                  }
                  onClick={() => fields.move(index, index - 1)}
                  disabled={index === 0}
                />
                <IconButtonWithTooltip
                  aria-label="move down"
                  size="small"
                  label="Move Down"
                  children={
                    <ArrowDownward
                      style={{
                        color: index !== fields.length - 1 && "orange",
                      }}
                    />
                  }
                  onClick={() => fields.move(index, index + 1)}
                  disabled={index === fields.length - 1}
                />
              </div>
            </div>
          ))}

          <div
            style={{
              display: fields.length === 0 ? "flex" : "none",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <AroggaButton
              type="success"
              label="New Entry"
              onClick={() => fields.push(pushValue)}
            />
          </div>
        </>
      )}
    </FieldArray>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    paper: {
      boxShadow: "0 0 0 0",
    },
    positionRelative: {
      position: "relative",
    },
  })
);

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);
