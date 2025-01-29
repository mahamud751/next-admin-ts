import { FC } from "react";
import {
  FunctionField,
  ImageField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { getColorByStatus } from "@/utils/helpers";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const LabCollectionProcessShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga |Lab Collection Process Show");
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={6} simpleShowLayout={false}>
          <TextField source="id" label="ID" />
          <TextField source="title[en]" label="Title" />
          <TextField source="subTitle[en]" label="Sub Title" />
          <TextField source="description[en]" label="Description" />
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
            source="bannerUrl"
            label="Banner"
            src="src"
            title="title"
            className="small__img"
          />
        </ColumnShowLayout>
      </SimpleShowLayout>
    </Show>
  );
};

export default LabCollectionProcessShow;
