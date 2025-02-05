import { FC } from "react";
import {
    FunctionField,
    Link,
    List,
    ListProps,
    Record,
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
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import MenuFilter from "./MenuFilter";

const MenuList: FC<ListProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Menu List");

    const exporter = useExport(rest);
    const classes = useAroggaStyles();
    const navigateFromList = useNavigateFromList("menuView", "menuEdit");

    return (
        <List
            {...rest}
            title="List of Menu"
            filters={<MenuFilter children={""} />}
            perPage={25}
            sort={{ field: "m_id", order: "DESC" }}
            exporter={exporter}
        >
            <CustomizableDatagrid
                rowClick={navigateFromList}
                hideableColumns={["m_created_at", "m_created_by"]}
            >
                <TextField source="m_id" label="ID" />
                <FunctionField
                    source="m_name"
                    label="Name"
                    onClick={(e) => e.stopPropagation()}
                    render={({ m_id, m_name, m_machine_name }: Record) => {
                        if (!m_id) return;

                        return (
                            <Link
                                to={`/menu-items/${m_id}?_machine_name=${m_machine_name}`}
                            >
                                {m_name}
                            </Link>
                        );
                    }}
                />
                <TextField source="m_description" label="Description" />
                <FunctionField
                    source="m_status"
                    label="Status"
                    render={({ m_status }: Record) => (
                        <span className={!m_status && classes.textRed}>
                            {m_status ? "Active" : "Inactive"}
                        </span>
                    )}
                />
                <AroggaDateField source="m_created_at" label="Created At" />
                <ReferenceField
                    source="m_created_by"
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

export default MenuList;
