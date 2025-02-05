import { FC } from "react";
import {
    FunctionField,
    Link,
    Record,
    ReferenceField,
    Show,
    ShowProps,
    TextField,
} from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import ColumnShowLayout from "../../../components/ColumnShowLayout";
import { useDocumentTitle } from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";

const MenuShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Menu Show");

    const classes = useAroggaStyles();

    return (
        <Show {...props}>
            <ColumnShowLayout md={6}>
                <TextField source="m_id" label="ID" />
                <FunctionField
                    label="Name"
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
                <AroggaDateField source="m_modified_at" label="Modified At" />
                <ReferenceField
                    source="m_modified_by"
                    label="Modified By"
                    reference="v1/users"
                    link="show"
                >
                    <TextField source="u_name" />
                </ReferenceField>
            </ColumnShowLayout>
        </Show>
    );
};

export default MenuShow;
