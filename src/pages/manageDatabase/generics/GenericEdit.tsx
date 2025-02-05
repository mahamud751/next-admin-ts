import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { FC, useState } from "react";
import {
  Datagrid,
  Edit,
  EditProps,
  FormTab,
  FunctionField,
  Pagination,
  RaRecord as Record,
  ReferenceField,
  ReferenceManyField,
  TabbedForm,
  TextField,
  TransformData,
} from "react-admin";
import { StringDiff } from "react-string-diff";

import { useDocumentTitle } from "@/hooks";
import { isArray, isObject, isString } from "@/utils/helpers";
import GenericEditActions from "./GenericEditActions";
import AroggaDateField from "@/components/common/AroggaDateField";
import LoaderOrButton from "@/components/common/LoaderOrButton";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import GenericEditForm from "@/components/manageDatabase/generics/GenericEditForm";

export const transform: TransformData = ({
  id,
  g_overview,
  g_quick_tips,
  g_safety_advices,
  g_brief_description,
  g_question_answer,
  g_overview_bn,
  g_quick_tips_bn,
  g_safety_advices_bn,
  g_brief_description_bn,
  g_question_answer_bn,
  ...rest
}) => ({
  ...rest,
  g_overview: g_overview ? JSON.stringify(g_overview) : [],
  g_quick_tips: g_quick_tips ? JSON.stringify(g_quick_tips) : [],
  g_safety_advices: g_safety_advices ? JSON.stringify(g_safety_advices) : [],
  g_brief_description: g_brief_description
    ? JSON.stringify(g_brief_description)
    : [],
  g_question_answer: g_question_answer ? JSON.stringify(g_question_answer) : [],
  g_overview_bn: g_overview_bn ? JSON.stringify(g_overview_bn) : [],
  g_quick_tips_bn: g_quick_tips_bn ? JSON.stringify(g_quick_tips_bn) : [],
  g_safety_advices_bn: g_safety_advices_bn
    ? JSON.stringify(g_safety_advices_bn)
    : [],
  g_brief_description_bn: g_brief_description_bn
    ? JSON.stringify(g_brief_description_bn)
    : [],
  g_question_answer_bn: g_question_answer_bn
    ? JSON.stringify(g_question_answer_bn)
    : [],
});

const GenericEdit: FC<EditProps> = ({ hasEdit, permissions, ...rest }) => {
  useDocumentTitle("Arogga | Generic Edit");
  const [isShowTable, setIsShowTable] = useState(false);
  const compareText = (newValue = "", oldValue = "") => {
    if (newValue === oldValue) return newValue;
    return (
      <span>
        <StringDiff oldValue={oldValue} newValue={newValue} />
      </span>
    );
  };

  return (
    <Edit
      transform={transform}
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      actions={<GenericEditActions data={rest.record} />}
      {...rest}
      redirect="list"
    >
      <TabbedForm
        toolbar={
          <SaveDeleteToolbar isSave={permissions?.includes("genericEdit")} />
        }
      >
        <FormTab label="Name">
          <GenericEditForm permissions={permissions} {...rest} language="" />
        </FormTab>
        <FormTab label="Description">
          <GenericEditForm permissions={permissions} {...rest} language="en" />
        </FormTab>
        <FormTab label="Description (Bangla)">
          <GenericEditForm permissions={permissions} {...rest} language="bn" />
        </FormTab>
        <FormTab label="History">
          <>
            {!isShowTable && (
              <LoaderOrButton
                label="Load History"
                isLoading={false}
                display="flex"
                justifyContent="center"
                mt={3}
                mb={4}
                onClick={() => setIsShowTable(true)}
              />
            )}
            {isShowTable && (
              <ReferenceManyField
                // addLabel={false}
                reference="v1/generics/history"
                target="_g_id"
                pagination={<Pagination />}
                sort={{ field: "gh_id", order: "DESC" }}
              >
                <Datagrid>
                  <TextField source="gh_id" label="ID" />
                  <AroggaDateField
                    source="gh_modified_at"
                    label="Modified At"
                  />
                  <ReferenceField
                    source="gh_modified_by"
                    label="Modified By"
                    reference="v1/users"
                    link="show"
                  >
                    <TextField source="u_name" />
                  </ReferenceField>
                  <AroggaDateField
                    source="gh_supervised_at"
                    label="Supervised At"
                  />
                  <ReferenceField
                    source="gh_supervised_by"
                    label="Supervised By"
                    reference="v1/users"
                    link="show"
                  >
                    <TextField source="u_name" />
                  </ReferenceField>
                  <TextField source="gh_action" label="Action" />
                  <FunctionField
                    label="From"
                    render={({ gh_from, gh_action }: Record) => {
                      if (
                        gh_action === "g_brief_description" ||
                        gh_action === "g_brief_description_bn"
                      ) {
                        return (
                          <>
                            {isArray(gh_from) &&
                              gh_from.map((item, i) => (
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
                                      }}
                                    >
                                      {item.title}
                                    </p>
                                  )}
                                  {!!item.content && (
                                    <p
                                      style={{
                                        color: "#050203",
                                      }}
                                    >
                                      {item.content}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </>
                        );
                      } else if (
                        gh_action === "g_overview" ||
                        gh_action === "g_overview_bn"
                      ) {
                        return (
                          <>
                            {isArray(gh_from) &&
                              gh_from.map((item, i) => (
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
                                    <p
                                      style={{
                                        color: "#4A4A4A",
                                      }}
                                    >
                                      {item.content}
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
                                              {lt}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                </div>
                              ))}
                          </>
                        );
                      } else if (
                        gh_action === "g_quick_tips" ||
                        gh_action === "g_quick_tips_bn"
                      ) {
                        return (
                          <>
                            {isArray(gh_from) &&
                              gh_from.map((item, i) => (
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
                        );
                      } else if (
                        gh_action === "g_safety_advices" ||
                        gh_action === "g_safety_advices_bn"
                      ) {
                        return (
                          <>
                            <Table>
                              <TableBody>
                                {isArray(gh_from) &&
                                  gh_from?.map((item, i) => (
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
                                          >
                                            {item.content}
                                          </div>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </>
                        );
                      } else if (
                        gh_action === "g_question_answer" ||
                        gh_action === "g_question_answer_bn"
                      ) {
                        return (
                          <>
                            {isArray(gh_from) &&
                              gh_from.map((item, i) => (
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
                                      }}
                                    >
                                      {item.q}
                                    </p>
                                  )}
                                  {!!item.a && (
                                    <p
                                      style={{
                                        color: "#4A4A4A",
                                      }}
                                    >
                                      {item.a}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </>
                        );
                      } else {
                        return <TextField source="gh_from" />;
                      }
                    }}
                  />
                  <FunctionField
                    label="To"
                    render={({ gh_to, gh_from, gh_action }: Record) => {
                      if (
                        gh_action === "g_brief_description" ||
                        gh_action === "g_brief_description_bn"
                      ) {
                        return (
                          <>
                            {isArray(gh_to) &&
                              gh_to.map((item, i) => (
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
                                      }}
                                    >
                                      {compareText(
                                        item.title,
                                        gh_from[i]?.title
                                      )}
                                    </p>
                                  )}
                                  {!!item.content && (
                                    <p
                                      style={{
                                        color: "#050203",
                                      }}
                                    >
                                      {compareText(
                                        item.content,
                                        gh_from[i]?.content
                                      )}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </>
                        );
                      } else if (
                        gh_action === "g_overview" ||
                        gh_action === "g_overview_bn"
                      ) {
                        return (
                          <>
                            {isArray(gh_to) &&
                              gh_to.map((item, i) => (
                                <div key={i}>
                                  {!!item.title && (
                                    <p
                                      style={{
                                        fontWeight: "bold",
                                        color: "#050203",
                                      }}
                                    >
                                      {compareText(
                                        item.title,
                                        gh_from[i]?.title
                                      )}
                                    </p>
                                  )}
                                  {!!item.content && isString(item.content) && (
                                    <p
                                      style={{
                                        color: "#4A4A4A",
                                      }}
                                    >
                                      {compareText(
                                        item.content,
                                        isString(gh_from[i]?.content)
                                          ? gh_from[i]?.content
                                          : ""
                                      )}
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
                                            isObject(gh_from[i]?.content)
                                              ? gh_from[i]?.content?.tag
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
                                                isObject(gh_from[i]?.content)
                                                  ? gh_from[i]?.content?.list[k]
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
                        );
                      } else if (
                        gh_action === "g_quick_tips" ||
                        gh_action === "g_quick_tips_bn"
                      ) {
                        return (
                          <>
                            {isArray(gh_to) &&
                              gh_to.map((item, i) => (
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
                                    <span>{compareText(item, gh_from[i])}</span>
                                  </li>
                                </ul>
                              ))}
                          </>
                        );
                      } else if (
                        gh_action === "g_safety_advices" ||
                        gh_action === "g_safety_advices_bn"
                      ) {
                        return (
                          <>
                            <Table>
                              <TableBody>
                                {isArray(gh_to) &&
                                  gh_to?.map((item, i) => (
                                    <TableRow key={i}>
                                      <TableCell>
                                        <span>
                                          {compareText(
                                            item.type,
                                            gh_from[i]?.type
                                          )}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        {!!item.tag && (
                                          <div
                                            style={{
                                              display: "inherit",
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
                                                gh_from[i]?.tag
                                              )}
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
                                          >
                                            {compareText(
                                              item.content,
                                              gh_from[i]?.content
                                            )}
                                          </div>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </>
                        );
                      } else if (
                        gh_action === "g_question_answer" ||
                        gh_action === "g_question_answer_bn"
                      ) {
                        return (
                          <>
                            {isArray(gh_to) &&
                              gh_to.map((item, i) => (
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
                                      }}
                                    >
                                      {compareText(item.q, gh_from[i]?.q)}
                                    </p>
                                  )}
                                  {!!item.a && (
                                    <p
                                      style={{
                                        color: "#4A4A4A",
                                      }}
                                    >
                                      {compareText(item.a, gh_from[i]?.a)}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </>
                        );
                      } else {
                        return <TextField source="gh_to" />;
                      }
                    }}
                  />
                </Datagrid>
              </ReferenceManyField>
            )}
          </>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

export default GenericEdit;
