import { FC } from "react";
import {
  DateField,
  FunctionField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { getColorByStatus } from "@/utils/helpers";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const LabVendorShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga |Lab Test | Vendor Show");

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={6} simpleShowLayout={false}>
          <TextField
            source="name.en"
            label="Name EN"
            style={{ textTransform: "capitalize" }}
          />
          <TextField
            source="name.bn"
            label="Name BN"
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
          <DateField source="createdAt" label="Created" showTime={true} />
        </ColumnShowLayout>
      </SimpleShowLayout>
    </Show>
  );
};

export default LabVendorShow;
