import { FC } from "react";
import {
  Datagrid,
  EditButton,
  FunctionField,
  List,
  ListProps,
  RaRecord,
  ShowButton,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { getColorByStatus } from "@/utils/helpers";
import LabTestPckgFilter from "./LabTestPckgFilter";

const LabTestPckgList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test & Package| List");
  const exporter = useExport(rest);
  return (
    <>
      <List
        {...rest}
        title="List of Tests & Packages"
        filters={<LabTestPckgFilter children={""} />}
        perPage={25}
        exporter={exporter}
      >
        <Datagrid rowClick="edit" bulkActionButtons={false}>
          <TextField
            source="id"
            label="Test ID"
            style={{ fontFamily: "monospace" }}
          />
          <TextField
            source="name.en"
            label="Test Name"
            style={{ textTransform: "capitalize" }}
          />
          <FunctionField
            render={(record) => {
              return (
                <div
                  style={{
                    width: 93,
                    backgroundColor:
                      (record.itemType === "test" ? "#4CAF50" : "#FFB547") +
                      "10",
                    color: record.itemType === "test" ? "#4CAF50" : "#FFB547",
                    borderRadius: 42,
                    textAlign: "center",
                    paddingTop: 5,
                    paddingBottom: 5,
                    textTransform: "capitalize",
                  }}
                >
                  {record.itemType}
                </div>
              );
            }}
            label="Item Type"
          />
          {/* <FunctionField
                        render={(record) => {
                            return (
                                <span>
                                    {toFixedNumber(record.basePrice).toFixed(2)}
                                </span>
                            );
                        }}
                        label="Base Price"
                    />
                    <FunctionField
                        render={(record) => {
                            return (
                                <span>
                                    {toFixedNumber(record.materialCost).toFixed(
                                        2
                                    )}
                                </span>
                            );
                        }}
                        label="Material Cost"
                    />
                    <FunctionField
                        render={(record) => {
                            return (
                                <span>
                                    {toFixedNumber(record.margin).toFixed(2)}
                                </span>
                            );
                        }}
                        label="Margin"
                    />
                    <FunctionField
                        render={(record) => {
                            return (
                                <span>
                                    {toFixedNumber(record.regularPrice).toFixed(
                                        2
                                    )}
                                </span>
                            );
                        }}
                        label="MRP Price"
                    />
                    <FunctionField
                        render={(record) => {
                            return (
                                <span>
                                    {toFixedNumber(
                                        record.externalMaterialCost
                                    ).toFixed(2)}
                                </span>
                            );
                        }}
                        label="External Material Cost"
                    />
                    <FunctionField
                        render={(record) => {
                            return (
                                <span>
                                    {toFixedNumber(
                                        record.discountPrice
                                    ).toFixed(2)}
                                </span>
                            );
                        }}
                        label="Discount Price"
                    /> */}
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
            label="Test Status"
          />
          <FunctionField
            label="Action"
            render={(record: RaRecord) => {
              return (
                <div style={{ display: "flex" }}>
                  <EditButton label="Edit" record={record} />
                  <ShowButton label="View" record={record} />
                </div>
              );
            }}
          />
        </Datagrid>
      </List>
    </>
  );
};

export default LabTestPckgList;
