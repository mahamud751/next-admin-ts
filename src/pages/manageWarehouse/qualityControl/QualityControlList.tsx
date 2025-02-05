import { FC } from "react";
import {
  BooleanField,
  FunctionField,
  ImageField,
  Labeled,
  Link,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import QualityControlExpand from "./QualityControlExpand";
import QualityControlFilter from "./QualityControlFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const QualityControlList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Quality Control List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();

  return (
    <List
      {...rest}
      title="List of Quality Control"
      filters={<QualityControlFilter children={""} />}
      perPage={25}
      sort={{ field: "qc_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        expand={
          <Labeled label="Items">
            <QualityControlExpand />
          </Labeled>
        }
        classes={{ expandedPanel: classes.expandedPanel }}
        hideableColumns={["qc_created_at", "qc_created_by"]}
        bulkActionButtons={permissions?.includes("qualityControlDelete")}
      >
        <TextField source="qc_id" label="ID" />
        <FunctionField
          label="QC Type"
          sortBy="qc_entity"
          onClick={(e) => e.stopPropagation()}
          className={classes.capitalize}
          render={({ qc_entity_id, qc_entity }: Record) => (
            <Link
              to={`/v1/${
                qc_entity === "purchase" ? "productPurchase" : "shipment"
              }/${qc_entity_id}`}
            >
              {qc_entity}
            </Link>
          )}
        />
        <TextField
          source="qc_status"
          label="QC Status"
          className={classes.capitalize}
        />
        <TextField
          source="qc_issue_type"
          label="Issue Type"
          className={classes.capitalize}
        />
        <BooleanField
          source="qc_approve_full_refund"
          label="Approve Full Refund"
          FalseIcon={null}
          looseValue
        />
        {/* TODO: */}
        {/* <TextField source="qc_print_count" label="Print Count" /> */}
        <TextField
          source="qc_damage_responsible"
          label="Lost / Dam Responsible"
          className={classes.capitalize}
        />
        <ImageField
          source="attachedFiles_qc_damage_picture"
          label="Damaged Images"
          src="src"
          title="title"
          className="small__img"
        />
        <ReferenceField
          source="qc_by"
          label="QC By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <AroggaDateField source="qc_created_at" label="Created At" />
        <ReferenceField
          source="qc_created_by"
          label="Created By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default QualityControlList;
