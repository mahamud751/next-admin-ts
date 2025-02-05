import { FC } from "react";
import {
  FunctionField,
  NumberField,
  RaRecord as Record,
  ReferenceField,
  Show,
  ShowProps,
  Tab,
  TabbedShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const CollectionShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Collection Show");

  const classes = useAroggaStyles();

  return (
    <Show {...rest}>
      <TabbedShowLayout>
        <Tab label="Information">
          <AroggaDateField source="co_created" label="Date" />
          <ReferenceField
            source="cc_from_id"
            label="From User"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <ReferenceField
            source="cc_to_id"
            label="To User"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <NumberField source="cc_amount" label="Amount" />
          <NumberField source="cc_shipment_amount" label="Shipment Amount" />
          <NumberField source="profit" label="Profit" />
          <FunctionField
            label="Status"
            render={(record: Record) => (
              <span
                className={`${classes.capitalize} ${
                  record.cc_status === "pending" && classes.textRed
                }`}
              >
                {record?.cc_status}
              </span>
            )}
          />
        </Tab>
        {/* // TODO: remove cc_po_ids from response */}
        {/* <Tab label="Delivered Orders">
                    <p>Show</p>
                    <FunctionField
                        addLabel={false}
                        render={(record: Record) => (
                            <ReferenceArrayField
                                source="cc_po_ids"
                                reference="v1/productOrder"
                                record={{
                                    ...record,
                                    cc_po_ids: JSON.parse(record.cc_po_ids),
                                }}
                                sort={{
                                    field: "o_delivered",
                                    order: "ASC",
                                }}
                                {...rest}
                            >
                                <OrdersDatagrid />
                            </ReferenceArrayField>
                        )}
                    />
                </Tab> */}
      </TabbedShowLayout>
    </Show>
  );
};

export default CollectionShow;
