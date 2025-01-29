import { FC } from "react";
import {
  FunctionField,
  ImageField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "../../../hooks";
import { getColorByStatus } from "../../../utils/helpers";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const LabGeneralIconShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga |Lab Test | General Icon Show");

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={6} simpleShowLayout={false}>
          <TextField source="sortOrder" label="Sort Order" />
          <TextField
            source="iconType"
            label="Icon Type"
            style={{ textTransform: "capitalize" }}
          />
          <FunctionField
            render={(record) => {
              const color = getColorByStatus(record.status);
              return (
                <div
                  style={{
                    width: 93,
                    backgroundColor: color + "10",
                    color: color,
                    borderRadius: 42,
                    textAlign: "center",
                    paddingTop: 5,
                    paddingBottom: 5,
                    textTransform: "capitalize",
                  }}
                >
                  {record.status}
                </div>
              );
            }}
            label="Status"
          />
          <ImageField
            source="active"
            label="Active Icon"
            src="src"
            title="title"
            className="small__img"
          />
          <ImageField
            source="default"
            label="Default Icon"
            src="src"
            title="title"
            className="small__img"
          />
        </ColumnShowLayout>
      </SimpleShowLayout>
    </Show>
  );
};

export default LabGeneralIconShow;
