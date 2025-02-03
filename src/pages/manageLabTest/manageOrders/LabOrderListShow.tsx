import { FC } from "react";
import {
  DateField,
  FunctionField,
  NumberField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "../../../hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getColorByStatus,
} from "../../../utils/helpers";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const LabOrderListShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga |Lab- Order List Show");
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout>
          <TextField source="orderNumber" />
          <TextField source="name" />
          <NumberField source="mobileNumber" />
          <TextField source="itemCount" />
          <FunctionField
            label="Total"
            render={(record) => `৳${record.totalAmount}`}
          />
          <TextField source="location.area" label="Zone" />
          <TextField source="assignedTo.name" />
          <FunctionField
            label="Pay Method"
            render={(record) => {
              return (
                <div
                  style={{
                    width: 93,
                    backgroundColor:
                      (record.paymentMethod === "online"
                        ? "#4CAF50"
                        : "#FFB547") + "10",
                    color:
                      record.paymentMethod === "cod" ? "#ff4949" : "#008000",
                    borderRadius: 42,
                    textAlign: "center",
                    paddingTop: 5,
                    paddingBottom: 5,
                    textTransform: "capitalize",
                  }}
                >
                  {record.paymentMethod}
                </div>
              );
            }}
          />
          <FunctionField
            label="Pay Status"
            render={(record) => {
              return (
                <div
                  style={{
                    width: 93,
                    backgroundColor:
                      (record.paymentStatus === "paid"
                        ? "#4CAF50"
                        : "#FFB547") + "10",
                    color:
                      record.paymentStatus === "unpaid" ? "#ff4949" : "#008000",
                    borderRadius: 42,
                    textAlign: "center",
                    paddingTop: 5,
                    paddingBottom: 5,
                    textTransform: "capitalize",
                  }}
                >
                  {record.paymentStatus}
                </div>
              );
            }}
          />
          <FunctionField
            render={(record) => {
              const color = getColorByStatus(record.orderStatus);
              return (
                <>
                  <div
                    style={{
                      color: color,
                    }}
                  >
                    {capitalizeFirstLetterOfEachWord(record.orderStatus)}
                  </div>
                </>
              );
            }}
            label="Order Status"
          />
          <DateField
            source="createdAt"
            label="Create Date & Time"
            showTime={true}
          />
          <FunctionField
            label="Scheduled At"
            render={(record) => (
              <>
                <DateField
                  source="formattedScheduleDate"
                  style={{
                    color: record.isScheduleExpired === true ? "red" : "black",
                  }}
                >
                  {record.formattedScheduleDate}
                </DateField>
                <br />
                <TextField
                  source="scheduleTimeRange.en"
                  style={{
                    color: record.isScheduleExpired === true ? "red" : "black",
                  }}
                />
              </>
            )}
          />
        </ColumnShowLayout>
      </SimpleShowLayout>
    </Show>
  );
};

export default LabOrderListShow;
