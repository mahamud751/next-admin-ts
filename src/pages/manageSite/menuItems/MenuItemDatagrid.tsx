import { Box } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useState } from "react";
import {
    Confirm,
    Datagrid,
    FunctionField,
    Pagination,
    Record,
    ReferenceManyField,
    TextField,
} from "react-admin";

import AroggaImageField from "../../../components/AroggaImageField";
import { useRequest } from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import MenuItemDialog from "./MenuItemDialog";

const MenuItemDatagrid = (props) => {
    const classes = useAroggaStyles();

    const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] =
        useState(false);
    const [isMenuItemDeleteDialogOpen, setIsMenuItemDeleteDialogOpen] =
        useState(false);
    const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
    const [record, setRecord] = useState(null);
    const [action, setAction] = useState(null);

    const { isLoading, refetch } = useRequest(
        `/v1/menuItem/${selectedMenuId}`,
        { method: "DELETE" },
        {
            isRefresh: true,
            onSuccess: () => setIsMenuItemDeleteDialogOpen(false),
        }
    );

    return (
        <>
            <Datagrid
                {...props}
                isRowExpandable={(row) => !!row?.mi_has_child}
                classes={{ expandedPanel: classes.expandedPanel }}
                expand={
                    <ReferenceManyField
                        reference="v1/menuItem"
                        target="_parent_id"
                        pagination={<Pagination />}
                        filter={{ _orderBy: "mi_has_child", _order: "asc" }}
                    >
                        <MenuItemDatagrid />
                    </ReferenceManyField>
                }
                optimized
            >
                <TextField source="mi_id" label="ID" />
                <FunctionField
                    source="mi_name"
                    label="Title"
                    render={({
                        mi_name,
                        mi_cat_id,
                        mi_overwrite_name,
                    }: Record) =>
                        mi_cat_id && mi_overwrite_name
                            ? `${mi_name} (OT: ${mi_overwrite_name})`
                            : mi_name
                    }
                />
                <TextField source="mi_url" label="URL" />
                <AroggaImageField
                    source="attachedFiles_mi_logo"
                    label="Logo"
                    src="src"
                    title="title"
                    className="small__img"
                />
                <TextField source="mi_weight" label="Weight" />
                <FunctionField
                    label="Menu Type"
                    render={({ mi_cat_id }: Record) =>
                        mi_cat_id === 0 ? "Menu" : "Category"
                    }
                />
                <FunctionField
                    source="mi_status"
                    label="Status"
                    render={({ mi_status }: Record) => (
                        <span className={!mi_status && classes.textRed}>
                            {mi_status ? "Active" : "Inactive"}
                        </span>
                    )}
                />
                <FunctionField
                    label="Action"
                    render={({ mi_id, mi_cat_id, ...rest }: Record) => (
                        <Box display="flex" gridGap={10}>
                            {!mi_cat_id && (
                                <AddBoxIcon
                                    cursor="pointer"
                                    style={{ color: "#0E7673" }}
                                    onClick={() => {
                                        setAction("add");
                                        setSelectedMenuId(mi_id);
                                        setIsAddMenuItemDialogOpen(true);
                                    }}
                                />
                            )}
                            <EditIcon
                                cursor="pointer"
                                style={{ color: "#0E7673" }}
                                onClick={() => {
                                    setAction("update");
                                    setSelectedMenuId(mi_id);
                                    setRecord({
                                        ...rest,
                                        mi_id,
                                        mi_cat_id,
                                    });
                                    setIsAddMenuItemDialogOpen(true);
                                }}
                            />
                            {!mi_cat_id && (
                                <DeleteIcon
                                    cursor="pointer"
                                    style={{ color: "#F04438" }}
                                    onClick={() => {
                                        setSelectedMenuId(mi_id);
                                        setIsMenuItemDeleteDialogOpen(true);
                                    }}
                                />
                            )}
                        </Box>
                    )}
                />
            </Datagrid>
            <MenuItemDialog
                action={action}
                selectedMenuId={selectedMenuId}
                record={record}
                setRecord={setRecord}
                isDialogOpen={isAddMenuItemDialogOpen}
                setIsDialogOpen={setIsAddMenuItemDialogOpen}
            />
            {!!selectedMenuId && (
                <Confirm
                    title={`Menu Item Deletion #${selectedMenuId}`}
                    content="Are you sure you want to delete this menu item?"
                    isOpen={isMenuItemDeleteDialogOpen}
                    loading={isLoading}
                    onConfirm={refetch}
                    onClose={() => setIsMenuItemDeleteDialogOpen(false)}
                />
            )}
        </>
    );
};

export default MenuItemDatagrid;
