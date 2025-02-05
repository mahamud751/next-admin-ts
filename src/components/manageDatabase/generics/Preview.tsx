import {
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

import { withStyles } from "@mui/styles";
import { ExpandMore } from "@mui/icons-material";
import MuiAccordion from "@mui/material/Accordion";
// import { StringDiff } from "react-string-diff";

import { isArray, isObject, isString } from "../../../utils/helpers";
import NoDataFound from "@/components/common/NoDataFound";

const GenericPreview = ({
  values,
  record,
  handleChange,
  expanded,
  language = "en",
}) => {
  const overview =
    values[`g_overview${language === "en" ? "" : `_${language}`}`];
  const brief_description =
    values[`g_brief_description${language === "en" ? "" : `_${language}`}`];
  const quick_tips =
    values[`g_quick_tips${language === "en" ? "" : `_${language}`}`];
  const safety_advices =
    values[`g_safety_advices${language === "en" ? "" : `_${language}`}`];
  const question_answer =
    values[`g_question_answer${language === "en" ? "" : `_${language}`}`];

  const old_overview =
    record[`g_overview${language === "en" ? "" : `_${language}`}`];
  const old_brief_description =
    record[`g_brief_description${language === "en" ? "" : `_${language}`}`];
  const old_quick_tips =
    record[`g_quick_tips${language === "en" ? "" : `_${language}`}`];
  const old_safety_advices =
    record[`g_safety_advices${language === "en" ? "" : `_${language}`}`];
  const old_question_answer =
    record[`g_question_answer${language === "en" ? "" : `_${language}`}`];

  const compareArrayData = (a, b) => {
    if (!a || !isArray(a)) a = [];
    if (!b || !isArray(b)) b = [];
    return (
      a.length === b.length &&
      a.every(
        (o, i) =>
          Object.keys(o).length === Object.keys(b[i]).length &&
          Object.keys(o).every((k) => o[k] === b[i][k])
      )
    );
  };
  const compareText = (newText, oldText) => {
    if (!newText || !oldText) return newText || oldText || "";

    let diffHTML = "";
    // Example diff logic, replace with your actual logic
    for (let i = 0; i < newText.length; i++) {
      if (newText[i] !== oldText[i]) {
        diffHTML += `<span style="background-color: yellow;">${newText[i]}</span>`;
      } else {
        diffHTML += newText[i];
      }
    }
    return diffHTML;
  };

  return (
    <>
      <Accordion
        expanded={expanded === "brief-description"}
        onChange={handleChange("brief-description")}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="brief-description-content"
          id="brief-description-header"
        >
          Brief Description ({language.toUpperCase()})
        </AccordionSummary>
        <AccordionDetails
          id="brief-description-content"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                width:
                  !compareArrayData(brief_description, old_brief_description) &&
                  values?.g_approval_status === "edited"
                    ? "50%"
                    : "100%",
                float: "left",
              }}
            >
              {brief_description ? (
                <>
                  {!compareArrayData(
                    brief_description,
                    old_brief_description
                  ) &&
                    values?.g_approval_status === "edited" && (
                      <>
                        <h5>New Data</h5>
                      </>
                    )}
                  {isArray(brief_description) &&
                    brief_description.map((item, i) => {
                      return (
                        <div
                          style={{
                            flexDirection: "column",
                          }}
                          key={i}
                        >
                          {!!item.title && (
                            <p
                              style={{
                                fontWeight: "bold",
                                color: "#050203",
                                padding: "10px 0",
                                fontSize: 14,
                              }}
                            >
                              {compareText(
                                item.title,
                                old_brief_description[i]?.title
                              )}
                            </p>
                          )}
                          {!!item.content && (
                            <div
                              style={{
                                color: "#050203",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: compareText(
                                  item.content,
                                  old_brief_description[i]?.content
                                ),
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                </>
              ) : (
                <NoDataFound />
              )}
            </div>
            {!compareArrayData(brief_description, old_brief_description) &&
              values?.g_approval_status === "edited" && (
                <div style={{ width: "50%", float: "left" }}>
                  {old_brief_description ? (
                    <>
                      <h5>Old Data</h5>
                      {isArray(old_brief_description) &&
                        old_brief_description.map((item, i) => (
                          <div
                            style={{
                              flexDirection: "column",
                            }}
                            key={i}
                          >
                            {!!item.title && (
                              <p
                                style={{
                                  fontWeight: "bold",
                                  color: "#050203",
                                  padding: "10px 0",
                                  fontSize: 14,
                                }}
                              >
                                {item.title}
                              </p>
                            )}
                            {!!item.content && (
                              <div
                                style={{
                                  color: "#050203",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                            )}
                          </div>
                        ))}
                    </>
                  ) : null}
                </div>
              )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "overview"}
        onChange={handleChange("overview")}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="overview-content"
          id="overview-header"
        >
          Medical Overview ({language.toUpperCase()})
        </AccordionSummary>
        <AccordionDetails
          id="overview-content"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                width:
                  !compareArrayData(overview, old_overview) &&
                  values?.g_approval_status === "edited"
                    ? "50%"
                    : "100%",
                float: "left",
              }}
            >
              {overview ? (
                <>
                  {!compareArrayData(overview, old_overview) &&
                    values?.g_approval_status === "edited" && (
                      <>
                        <h5>New Data</h5>
                      </>
                    )}
                  {isArray(overview) &&
                    overview.map((item, i) => (
                      <div key={i}>
                        {!!item.title && (
                          <p
                            style={{
                              fontWeight: "bold",
                              color: "#050203",
                            }}
                          >
                            {compareText(item.title, old_overview[i]?.title)}
                          </p>
                        )}
                        {!!item.content && isString(item.content) && (
                          <p
                            style={{
                              color: "#4A4A4A",
                            }}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: compareText(
                                  item.content,
                                  isString(old_overview[i]?.content)
                                    ? old_overview[i]?.content
                                    : ""
                                ),
                              }}
                            />
                          </p>
                        )}

                        {!!item.content &&
                          isObject(item.content) &&
                          !!item.content.tag && (
                            <div
                              style={{
                                display: "inline-flex",
                                border: "1px solid #10837D",
                                borderRadius: 10,
                                padding: 5,
                                marginBottom: 5,
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: "#4A4A4A",
                                  fontSize: 14,
                                }}
                              >
                                {compareText(
                                  item.content.tag,
                                  isObject(old_overview[i]?.content)
                                    ? old_overview[i]?.content?.tag
                                    : ""
                                )}
                              </span>
                            </div>
                          )}
                        {!!item.content &&
                          isObject(item.content) &&
                          !!item.content.list && (
                            <ul
                              style={{
                                width: "100%",
                              }}
                            >
                              {item.content.list.map((lt, k) => (
                                <li
                                  key={k}
                                  style={{
                                    flexDirection: "row",
                                    width: "100%",
                                  }}
                                >
                                  <span
                                    style={{
                                      flex: 1,
                                      color: "#4A4A4A",
                                    }}
                                  >
                                    {compareText(
                                      lt,
                                      isObject(old_overview[i]?.content)
                                        ? old_overview[i]?.content?.list[k]
                                        : ""
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    ))}
                </>
              ) : (
                <NoDataFound />
              )}
            </div>
            {!compareArrayData(overview, old_overview) &&
              values?.g_approval_status === "edited" && (
                <div style={{ width: "50%", float: "left" }}>
                  {old_overview ? (
                    <>
                      <h5>Old Data</h5>
                      {isArray(old_overview) &&
                        old_overview.map((item, i) => (
                          <div key={i}>
                            {!!item.title && (
                              <p
                                style={{
                                  fontWeight: "bold",
                                  color: "#050203",
                                }}
                              >
                                {item.title}
                              </p>
                            )}
                            {!!item.content && isString(item.content) && (
                              <div
                                style={{
                                  color: "#4A4A4A",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                            )}
                            {!!item.content &&
                              isObject(item.content) &&
                              !!item.content.tag && (
                                <div
                                  style={{
                                    display: "inline-flex",
                                    border: "1px solid #10837D",
                                    borderRadius: 10,
                                    padding: 5,
                                    marginBottom: 5,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: "#4A4A4A",
                                      fontSize: 14,
                                    }}
                                  >
                                    {item.content.tag}
                                  </span>
                                </div>
                              )}
                            {!!item.content &&
                              isObject(item.content) &&
                              !!item.content.list && (
                                <ul
                                  style={{
                                    width: "100%",
                                  }}
                                >
                                  {item.content.list.map((lt, i) => (
                                    <li
                                      key={i}
                                      style={{
                                        flexDirection: "row",
                                        width: "100%",
                                      }}
                                    >
                                      <span
                                        style={{
                                          flex: 1,
                                          color: "#4A4A4A",
                                        }}
                                      >
                                        {lt}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>
                        ))}
                    </>
                  ) : null}
                </div>
              )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "quick-tips"}
        onChange={handleChange("quick-tips")}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="quick-tips"
          id="quick-tips-header"
        >
          Quick Tips ({language.toUpperCase()})
        </AccordionSummary>
        <AccordionDetails
          id="quick-tips-content"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                width:
                  !compareArrayData(quick_tips, old_quick_tips) &&
                  values?.g_approval_status === "edited"
                    ? "50%"
                    : "100%",
                float: "left",
              }}
            >
              {quick_tips ? (
                <>
                  {!compareArrayData(quick_tips, old_quick_tips) &&
                    values?.g_approval_status === "edited" && (
                      <>
                        <h5>New Data</h5>
                      </>
                    )}
                  {isArray(quick_tips) &&
                    quick_tips.map((item, i) => (
                      <ul
                        key={i}
                        style={{
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <li
                          style={{
                            flexDirection: "row",
                            width: "100%",
                            margin: "10px 0",
                          }}
                          key={i}
                        >
                          <span>{compareText(item, old_quick_tips[i])}</span>
                        </li>
                      </ul>
                    ))}
                </>
              ) : (
                <NoDataFound />
              )}
            </div>
            {!compareArrayData(quick_tips, old_quick_tips) &&
              values?.g_approval_status === "edited" && (
                <div style={{ width: "50%", float: "left" }}>
                  {old_quick_tips ? (
                    <>
                      <h5>Old Data</h5>
                      {isArray(old_quick_tips) &&
                        old_quick_tips.map((item, i) => (
                          <ul
                            key={i}
                            style={{
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <li
                              style={{
                                flexDirection: "row",
                                width: "100%",
                                margin: "10px 0",
                              }}
                              key={i}
                            >
                              <span>{item}</span>
                            </li>
                          </ul>
                        ))}
                    </>
                  ) : null}
                </div>
              )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "safety-advices"}
        onChange={handleChange("safety-advices")}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="safety-advices"
          id="safety-advices-header"
        >
          Safety Advices ({language.toUpperCase()})
        </AccordionSummary>
        <AccordionDetails
          id="safety-advices-content"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                width:
                  !compareArrayData(safety_advices, old_safety_advices) &&
                  values?.g_approval_status === "edited"
                    ? "50%"
                    : "100%",
                float: "left",
              }}
            >
              {safety_advices ? (
                <>
                  {!compareArrayData(safety_advices, old_safety_advices) &&
                    values?.g_approval_status === "edited" && (
                      <>
                        <h5>New Data</h5>
                      </>
                    )}
                  <div>
                    <Table>
                      <TableBody>
                        {isArray(safety_advices) &&
                          safety_advices?.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <span>
                                  {compareText(
                                    item.type,
                                    old_safety_advices[i]?.type
                                  )}
                                </span>
                              </TableCell>
                              <TableCell>
                                {!!item.tag && (
                                  <div
                                    style={{
                                      display: "inherit",
                                      padding: 5,
                                      borderRadius: 10,
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#000000",
                                        fontSize: 14,
                                      }}
                                    >
                                      {compareText(
                                        item.tag,
                                        old_safety_advices[i]?.tag
                                      )}
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {!!item.content && (
                                  <div
                                    style={{
                                      color: "#050203",
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: compareText(
                                        item.content,
                                        old_safety_advices[i]?.content
                                      ),
                                    }}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <NoDataFound />
              )}
            </div>
            {!compareArrayData(safety_advices, old_safety_advices) &&
              values?.g_approval_status === "edited" && (
                <div style={{ width: "50%", float: "left" }}>
                  {old_safety_advices ? (
                    <>
                      <h5>Old Data</h5>
                      <div>
                        <Table>
                          <TableBody>
                            {isArray(old_safety_advices) &&
                              old_safety_advices?.map((item, i) => (
                                <TableRow key={i}>
                                  <TableCell>
                                    <span>{item.type}</span>
                                  </TableCell>
                                  <TableCell>
                                    {!!item.tag && (
                                      <div
                                        style={{
                                          display: "inherit",
                                          padding: 5,
                                          borderRadius: 10,
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "#000000",
                                            fontSize: 14,
                                          }}
                                        >
                                          {item.tag}
                                        </span>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {!!item.content && (
                                      <div
                                        style={{
                                          color: "#4A4A4A",
                                          textAlign: "left",
                                        }}
                                        dangerouslySetInnerHTML={{
                                          __html: item.content,
                                        }}
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "question-answer"}
        onChange={handleChange("question-answer")}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="question-answer"
          id="question-answer-header"
        >
          Question & Answer ({language.toUpperCase()})
        </AccordionSummary>
        <AccordionDetails
          id="question-answer-content"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* faqs */}
          <div style={{ width: "100%" }}>
            <div
              style={{
                width:
                  !compareArrayData(question_answer, old_question_answer) &&
                  values?.g_approval_status === "edited"
                    ? "50%"
                    : "100%",
                float: "left",
              }}
            >
              {question_answer ? (
                <>
                  {!compareArrayData(question_answer, old_question_answer) &&
                    values?.g_approval_status === "edited" && (
                      <>
                        <h5>New Data</h5>
                      </>
                    )}
                  {isArray(question_answer) &&
                    question_answer.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          flexDirection: "column",
                        }}
                      >
                        {!!item.q && (
                          <p
                            style={{
                              fontWeight: "bold",
                              color: "#10837D",
                              fontSize: 14,
                              paddingInline: 10,
                            }}
                          >
                            {compareText(item.q, old_question_answer[i]?.q)}
                          </p>
                        )}
                        {!!item.a && (
                          <p
                            style={{
                              color: "#4A4A4A",
                              paddingInline: 20,
                            }}
                          >
                            {compareText(item.a, old_question_answer[i]?.a)}
                          </p>
                        )}
                      </div>
                    ))}
                </>
              ) : (
                <NoDataFound />
              )}
            </div>
            {!compareArrayData(question_answer, old_question_answer) &&
              values?.g_approval_status === "edited" && (
                <div style={{ width: "50%", float: "left" }}>
                  {old_question_answer ? (
                    <>
                      <h5>Old Data</h5>
                      {isArray(old_question_answer) &&
                        old_question_answer.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              flexDirection: "column",
                            }}
                          >
                            {!!item.q && (
                              <p
                                style={{
                                  fontWeight: "bold",
                                  color: "#10837D",
                                  fontSize: 14,
                                  paddingInline: 10,
                                }}
                              >
                                {item.q}
                              </p>
                            )}
                            {!!item.a && (
                              <p
                                style={{
                                  color: "#4A4A4A",
                                  paddingInline: 20,
                                }}
                              >
                                {item.a}
                              </p>
                            )}
                          </div>
                        ))}
                    </>
                  ) : null}
                </div>
              )}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default GenericPreview;

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
