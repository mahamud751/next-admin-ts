import { FC } from "react";
import {
  CreateButton,
  ExportButton,
  List,
  ListProps,
  ReferenceField,
  TextField,
  TopToolbar,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import TaxonomyExpand from "./TaxonomyExpand";
import TaxonomyFilter from "./TaxonomyFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const TaxonomyList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Taxonomy Term List");

  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("taxonomyView", "taxonomyEdit");

  const ListActions = (props) => {
    const vocabularyId = props?.filterValues?._v_id;

    return (
      <TopToolbar>
        <CreateButton
          //@ts-ignore
          basePath={
            vocabularyId
              ? `taxonomy/create?vocabularyId=${vocabularyId}`
              : "taxonomy"
          }
        />
        <ExportButton />
      </TopToolbar>
    );
  };

  return (
    <List
      {...rest}
      title="List of Taxonomy Term"
      perPage={25}
      filter={{ _parent_id: 0 }}
      filters={<TaxonomyFilter children={""} />}
      sort={{ field: "t_id", order: "DESC" }}
      exporter={exporter}
      actions={<ListActions />}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        isRowExpandable={(row) => !!row?.t_has_child}
        expand={<TaxonomyExpand />}
        classes={{ expandedPanel: classes.expandedPanel }}
        hideableColumns={["t_created_at", "t_created_by"]}
        bulkActionButtons={false}
      >
        <TextField source="t_id" label="ID" />
        <TextField source="t_title" label="Title" />
        <TextField source="t_machine_name" label="Machine Name" />
        <ReferenceField
          source="t_v_id"
          label="Vocabulary"
          reference="v1/vocabulary"
          sortBy="t_v_id"
          link="show"
        >
          <TextField source="v_title" />
        </ReferenceField>
        <TextField source="t_weight" label="Weight" />
        <AroggaDateField source="t_created_at" label="Created At" />
        <ReferenceField
          source="t_created_by"
          label="Created By"
          reference="v1/users"
          sortBy="t_created_by"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default TaxonomyList;
