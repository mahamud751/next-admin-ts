import { FC } from "react";
import {
  FunctionField,
  Link,
  List,
  ListProps,
  ReferenceField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import VocabularyFilter from "./VocabularyFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const VocabularyList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Vocabulary List");

  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList(
    "vocabularyView",
    "vocabularyEdit"
  );

  return (
    <List
      {...rest}
      title="List of Vocabulary"
      perPage={25}
      filters={<VocabularyFilter children={""} />}
      sort={{ field: "v_id", order: "DESC" }}
      exporter={exporter}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={["v_created_at", "v_created_by"]}
        bulkActionButtons={false}
      >
        <TextField source="v_id" label="ID" />
        <FunctionField
          label="Title"
          sortBy="v_title"
          // @ts-ignore
          onClick={(e: MouseEvent) => e.stopPropagation()}
          render={(record: { v_id: string; v_title: string }) => (
            <Link
              to={{
                pathname: "/v1/taxonomy",
                search: `filter=${JSON.stringify({
                  _v_id: record?.v_id,
                  _orderBy: "t_weight",
                  _order: "ASC",
                })}`,
              }}
            >
              {record.v_title}
            </Link>
          )}
        />
        <TextField source="v_description" label="Description" />
        <TextField source="v_machine_name" label="Machine Name" />
        <AroggaDateField source="v_created_at" label="Created At" />
        <ReferenceField
          source="v_created_by"
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

export default VocabularyList;
