import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  List,
  ListProps,
  NumberField,
  RaRecord as Record,
  ReferenceField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import CollectionFilter from "./CollectionFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const CollectionList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Collection List");

  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList(
    "collectionView",
    "collectionEdit"
  );

  return (
    <List
      {...rest}
      title="List of Collection"
      filters={<CollectionFilter children={""} />}
      perPage={25}
      sort={{ field: "co_id", order: "DESC" }}
      exporter={exporter}
      {...rest}
    >
      <Datagrid rowClick={navigateFromList} bulkActionButtons={false}>
        <AroggaDateField source="cc_created" label="Date" />
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

        {/* <ArrayField source="cc_entity" label="CC Entity">
                    <Datagrid>
                        <NumberField source="entity" label="Entity" />
                        <NumberField source="entity_id" label="Entity ID" />
                    </Datagrid>
                </ArrayField> */}
        {/* <NumberField
                    source="cc_shipment_amount"
                    label="Supplier Amount"
                />
                <NumberField source="profit" label="Profit" />
                    // TODO: remove cc_po_ids from response
                <FunctionField
                    label="Orders Count"
                    render={(record: Record) =>
                        `${JSON.parse(record.cc_po_ids)?.length}`
                    }
                /> */}
        <FunctionField
          label="Status"
          sortBy="cc_status"
          render={({ cc_status }: Record) => (
            <span
              className={`${classes.capitalize} ${
                cc_status === "pending" && classes.textRed
              }`}
            >
              {cc_status}
            </span>
          )}
        />
      </Datagrid>
    </List>
  );
};

export default CollectionList;
