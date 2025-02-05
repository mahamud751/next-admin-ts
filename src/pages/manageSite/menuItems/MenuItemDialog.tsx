import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import {
    Labeled,
    minLength,
    NumberInput,
    Record,
    required,
    SimpleForm,
    TextInput,
    useNotify,
    usePermissions,
    useRefresh,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";
import { useParams } from "react-router-dom";

import AroggaDialogActions from "../../../components/AroggaDialogActions";
import AroggaImageField from "../../../components/AroggaImageField";
import AroggaMovableImageInput from "../../../components/AroggaMovableImageInput";
import FormatedBooleanInput from "../../../components/FormatedBooleanInput";
import { uploadDataProvider } from "../../../dataProvider";
import { logger } from "../../../utils/helpers";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import CascaderMenuItemInput from "./CascaderMenuItemInput";

type MenuItemDialogProps = {
    action?: "create" | "add" | "update";
    selectedMenuId?: number;
    record?: Record | null;
    setRecord?: (value: Record) => void;
    isDialogOpen: boolean;
    setIsDialogOpen: (value: boolean) => void;
};

const MenuItemDialog: FC<MenuItemDialogProps> = ({
    action,
    selectedMenuId,
    record,
    setRecord,
    isDialogOpen,
    setIsDialogOpen,
}) => {
    const classes = useAroggaStyles();

    return (
        <SimpleForm toolbar={null} className={classes.absolute}>
            <MIDialog
                action={action}
                selectedMenuId={selectedMenuId}
                record={record}
                setRecord={setRecord}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
            />
        </SimpleForm>
    );
};

export default MenuItemDialog;

const MIDialog = ({
    action,
    selectedMenuId,
    record,
    setRecord,
    isDialogOpen,
    setIsDialogOpen,
}) => {
    const refresh = useRefresh();
    const notify = useNotify();
    const form = useForm();
    const params = useParams();
    const { permissions } = usePermissions();
    const { values, hasValidationErrors } = useFormState();

    const [isLoading, setIsLoading] = useState(false);

    const isOverwriteTitle = action === "update" && record?.mi_cat_id;

    useEffect(() => {
        if (action === "update") {
            form.change("title", record?.mi_name);
            isOverwriteTitle &&
                form.change("overwriteTitle", record?.mi_overwrite_name);
            form.change("url", record?.mi_url);
            form.change("weight", record?.mi_weight);
            form.change("status", record?.mi_status);
            form.change("logo", record?.attachedFiles_mi_logo);
        } else {
            form.change("status", 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDialogOpen]);

    let mi_parent_mi_id;

    if (action === "add") {
        mi_parent_mi_id = selectedMenuId;
    } else if (action === "update") {
        mi_parent_mi_id = values.parentMenuId || record?.mi_parent_mi_id;
    } else if (action === "create") {
        mi_parent_mi_id = values.parentMenuId || 0;
    }

    const onConfirm = async () => {
        setIsLoading(true);

        const payload = {
            // @ts-ignore
            mi_menu_id: params.id,
            mi_parent_mi_id,
            ...(record?.mi_cat_id && {
                mi_cat_id: record?.mi_cat_id,
            }),
            mi_name: values.title,
            ...(isOverwriteTitle && {
                mi_overwrite_name: values.overwriteTitle,
            }),
            mi_url: values.url,
            mi_weight: values.weight,
            mi_status: values.status || 0,
            attachedFiles_mi_logo: values.logo,
        };

        try {
            if (action === "update") {
                await uploadDataProvider.update("v1/menuItem", {
                    id: record?.mi_id,
                    data: payload,
                });
            } else {
                await uploadDataProvider.create("v1/menuItem", {
                    data: payload,
                });
            }
            refresh();
            handleOnClose();
        } catch (err) {
            logger(err);
            // @ts-ignore
            notify(err?.message || "Something went wrong! Please try again!", {
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnClose = () => {
        resetForm();
        setRecord && setRecord(null);
        setIsDialogOpen(false);
    };

    const resetForm = () => {
        [
            "parentMenuId",
            "title",
            "overwriteTitle",
            "url",
            "weight",
            "logo",
        ].forEach((key) => form.change(key, undefined));
    };

    let dialogTitle;

    if (action === "add") {
        dialogTitle = "Create Sub Menu Item";
    } else if (action === "update") {
        dialogTitle = record?.mi_cat_id
            ? "Update Category Title"
            : "Update Menu";
    } else {
        dialogTitle = "Create Menu Item";
    }

    return (
        <Dialog
            open={isDialogOpen}
            onClose={handleOnClose}
            style={{ zIndex: 1 }}
            maxWidth="xl"
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent style={{ width: 1000 }}>
                <CascaderMenuItemInput
                    source="parentMenuId"
                    label={
                        action === "add" || isOverwriteTitle
                            ? "Parent Menu"
                            : "Select Parent Menu"
                    }
                    // @ts-ignore
                    menuId={params.id}
                    selectedMenuId={selectedMenuId}
                    isLastLevelSelectable={false}
                    disabled={action === "add" || isOverwriteTitle}
                />
                <TextInput
                    source="title"
                    label="Title"
                    variant="outlined"
                    helperText={false}
                    validate={[
                        required(),
                        minLength(
                            2,
                            "Title must be at least 2 characters long"
                        ),
                    ]}
                    disabled={isOverwriteTitle}
                    multiline
                    fullWidth
                />
                {!!isOverwriteTitle && (
                    <TextInput
                        source="overwriteTitle"
                        label="Overwrite Title"
                        variant="outlined"
                        helperText={false}
                        multiline
                        fullWidth
                    />
                )}
                <TextInput
                    source="url"
                    label="URL"
                    variant="outlined"
                    helperText={false}
                    validate={[
                        required(),
                        minLength(1, "URL must be at least 1 characters long"),
                    ]}
                    disabled={
                        isOverwriteTitle &&
                        !permissions?.includes("updateProductCategoryURL")
                    }
                    multiline
                    fullWidth
                />
                <NumberInput
                    source="weight"
                    label="Weight"
                    variant="outlined"
                    helperText={false}
                    disabled={isOverwriteTitle}
                    fullWidth
                />
                <FormatedBooleanInput
                    source="status"
                    label="Active?"
                    disabled={isOverwriteTitle}
                />
                {isOverwriteTitle ? (
                    !!record?.attachedFiles_mi_logo?.length && (
                        <Labeled label="Attached Logo">
                            <AroggaImageField
                                source="attachedFiles_mi_logo"
                                record={record}
                            />
                        </Labeled>
                    )
                ) : (
                    <AroggaMovableImageInput
                        source="logo"
                        label="Attached Logo"
                        placeholder="Click to upload or drag and drop SVG, PNG, JPG or GIF (max. 400x400px)"
                        multiple={false}
                    />
                )}
            </DialogContent>
            <AroggaDialogActions
                isLoading={isLoading}
                onDialogClose={handleOnClose}
                onConfirm={onConfirm}
                disabled={hasValidationErrors}
            />
        </Dialog>
    );
};
