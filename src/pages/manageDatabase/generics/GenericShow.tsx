import { FC, useEffect, useState } from "react";
import {
  FunctionField,
  RaRecord as Record,
  Show,
  ShowProps,
  TextField,
} from "react-admin";

import { useDocumentTitle, useGetStoreData } from "@/hooks";
import GenericPreview from "@/components/manageDatabase/generics/Preview";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const GenericShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Generic Show");

  const [expanded, setExpanded] = useState<string | false>("brief-description");
  const data = useGetStoreData("v1/generics");
  const handleChange = (panel: string) => (_, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const values = data[props.id];
  const [newvalues, setnewvalues] = useState(values);

  useEffect(() => {
    let newvalues = { ...values };
    const keys = [
      "g_name",
      "g_is_antibiotics",
      "g_is_controlled",
      "g_brief_description",
      "g_brief_description_bn",
      "g_overview",
      "g_overview_bn",
      "g_quick_tips",
      "g_quick_tips_bn",
      "g_safety_advices",
      "g_safety_advices_bn",
      "g_question_answer",
      "g_question_answer_bn",
    ];
    keys.forEach((key) => {
      if (values?.changeData?.[key]) {
        newvalues[key] = values?.changeData?.[key];
      }
    });
    setnewvalues(newvalues);
  }, [values]);

  return (
    <Show {...props}>
      <ColumnShowLayout title="Generic" md={12}>
        <>
          <div
            style={{
              marginBottom: "1rem",
              fontSize: 18,
            }}
          >
            <TextField
              source="g_name"
              label="Name"
              style={{
                width: "100%",
                fontWeight: "bold",
                color: "#050203",
                fontSize: 20,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <FunctionField
              label="Is Antibiotics"
              sortBy="g_is_antibiotics"
              render={(record: Record) => (
                <span>
                  Antibiotics:{" "}
                  <strong>{record.g_is_antibiotics ? "Yes" : "No"}</strong>
                </span>
              )}
            />
            <FunctionField
              label="Is Controlled"
              sortBy="g_is_controlled"
              render={(record: Record) => (
                <span>
                  Controlled:{" "}
                  <strong>{record.g_is_controlled ? "Yes" : "No"}</strong>
                </span>
              )}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ width: "100%" }}>
              <GenericPreview
                language="en"
                values={newvalues}
                record={values}
                expanded={expanded}
                handleChange={handleChange}
              />
            </div>
            <div style={{ width: "100%" }}>
              <GenericPreview
                language="bn"
                values={newvalues}
                record={values}
                expanded={expanded}
                handleChange={handleChange}
              />
            </div>
          </div>
        </>
      </ColumnShowLayout>
    </Show>
  );
};

export default GenericShow;
