import { FC } from "react";
import {
    FunctionField,
    Link,
    List,
    ListProps,
    ReferenceField,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import {
    useDocumentTitle,
    useExport,
    useNavigateFromList,
} from "../../../hooks";
import { CustomizableDatagrid } from "../../../lib";
import VocabularyFilter from "./VocabularyFilter";

const VocabularyList: FC<ListProps> = ({ permissions, ...rest }) => {
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
            bulkActionButtons={false}
        >
            <CustomizableDatagrid
                rowClick={navigateFromList}
                hideableColumns={["v_created_at", "v_created_by"]}
            >
                <TextField source="v_id" label="ID" />
                <FunctionField
                    label="Title"
                    sortBy="v_title"
                    // @ts-ignore
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                    render={(record) => (
                        <Link
                            to={{
                                pathname: "/v1/taxonomy",
                                search: `filter=${JSON.stringify({
                                    _v_id: record.v_id,
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
