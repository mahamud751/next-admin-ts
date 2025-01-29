import {
  Datagrid,
  Pagination,
  ReferenceField,
  ReferenceManyField,
  TextField,
} from "react-admin";

import { useNavigateFromList } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const TaxonomyExpand = () => {
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("taxonomyView", "taxonomyEdit");

  return (
    <ReferenceManyField
      reference="v1/taxonomy"
      target="_parent_id"
      pagination={<Pagination />}
      sort={{ field: "t_weight", order: "ASC" }}
    >
      <Datagrid
        rowClick={navigateFromList}
        isRowExpandable={(row) => !!row?.t_has_child}
        expand={<TaxonomyExpand />}
        //@ts-ignore
        classes={{ expandedPanel: classes.expandedPanel }}
        optimized
      >
        <TextField source="t_id" label="ID" sortable={false} />
        <TextField source="t_title" label="Title" sortable={false} />
        <TextField
          source="t_machine_name"
          label="Machine Name"
          sortable={false}
        />
        <TextField source="t_weight" label="Weight" sortable={false} />
        <AroggaDateField
          source="t_created_at"
          label="Created At"
          sortable={false}
        />
        <ReferenceField
          source="t_created_by"
          label="Created By"
          reference="v1/users"
          sortBy="t_created_by"
          link="show"
          sortable={false}
        >
          <TextField source="u_name" />
        </ReferenceField>
      </Datagrid>
    </ReferenceManyField>
  );
};

export default TaxonomyExpand;
