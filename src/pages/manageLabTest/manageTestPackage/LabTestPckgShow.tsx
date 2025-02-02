import { FC } from "react";
import {
  ArrayField,
  BooleanField,
  Datagrid,
  FunctionField,
  NumberField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
  TranslatableFields,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { toFixedNumber } from "@/utils/helpers";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const LabTestPckgShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Lab Tests| LabTestPckgShow");
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout>
          <TextField source="itemType" />
          <TextField source="targetGender" />
          <NumberField source="testCount" />
          <NumberField source="bookedCount" />
          <TextField source="discountPercent" />
          <FunctionField
            render={(record) => {
              return (
                <span>{toFixedNumber(record.discountPrice).toFixed(2)}</span>
              );
            }}
            label="Discount Price"
          />
          <FunctionField
            render={(record) => {
              return <span>{toFixedNumber(record.basePrice).toFixed(2)}</span>;
            }}
            label="Base Price"
          />
          <FunctionField
            render={(record) => {
              return (
                <span>{toFixedNumber(record.materialCost).toFixed(2)}</span>
              );
            }}
            label="Material Cost"
          />
          <FunctionField
            render={(record) => {
              return <span>{toFixedNumber(record.margin).toFixed(2)}</span>;
            }}
            label="Margin"
          />
          <FunctionField
            render={(record) => {
              return (
                <span>
                  {toFixedNumber(record.externalMaterialCost).toFixed(2)}
                </span>
              );
            }}
            label="External Material Cost"
          />
          <NumberField source="reportAvailableHour" />
          <TextField source="status" />
          <BooleanField source="isDiscountEnabled" />
          <TranslatableFields locales={["en", "bn"]}>
            <TextField source="name" />
          </TranslatableFields>
          <ArrayField source="knownAs">
            <Datagrid>
              <TextField source="en" />
              <TextField source="bn" />
            </Datagrid>
          </ArrayField>
          <ArrayField source="sampleRequirements">
            <Datagrid>
              <TextField source="en" />
              <TextField source="bn" />
            </Datagrid>
          </ArrayField>
          <ArrayField source="testRequirements">
            <Datagrid>
              <TextField source="en" />
              <TextField source="bn" />
            </Datagrid>
          </ArrayField>
          <TranslatableFields locales={["en", "bn"]}>
            <TextField source="description" />
          </TranslatableFields>
        </ColumnShowLayout>
      </SimpleShowLayout>
    </Show>
  );
};

export default LabTestPckgShow;
