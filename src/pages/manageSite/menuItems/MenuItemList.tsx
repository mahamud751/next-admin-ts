import { FC } from "react";
import { List, ListProps } from "react-admin";
import { useParams } from "react-router-dom";

import { useDocumentTitle } from "../../../hooks";
import MenuItemAction from "./MenuItemAction";
import MenuItemDatagrid from "./MenuItemDatagrid";
import MenuItemFilter from "./MenuItemFilter";

const MenuItemList: FC<ListProps> = (props) => {
    useDocumentTitle("Arogga | Menu Item List");

    const params = useParams();

    return (
        <List
            {...props}
            title="List of Menu Item"
            resource="v1/menuItem"
            basePath="v1/menuItem"
            perPage={25}
            filter={{
                // @ts-ignore
                _menu_id: params?.id,
                _parent_id: 0,
                _menu_machine_name:
                    props?.location?.search?.split("?_machine_name=")?.[1],
            }}
            sort={{ field: "mi_id", order: "DESC" }}
            filters={<MenuItemFilter children={""} />}
            actions={<MenuItemAction />}
            bulkActionButtons={false}
        >
            <MenuItemDatagrid />
        </List>
    );
};

export default MenuItemList;
