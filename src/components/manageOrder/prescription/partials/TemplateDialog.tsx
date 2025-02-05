import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useNotify } from "react-admin";
import { useFormState } from "react-final-form";

import { useRequest } from "../../../../../hooks";
import AroggaDialogActions from "../../../../AroggaDialogActions";

export const TemplateDialog = ({ open, setOpen, currentUser }) => {
    const notify = useNotify();
    const { values } = useFormState();
    const [templateName, setTemplateName] = useState<string>("");

    const { data, isLoading, refetch } = useRequest(`/v1/template/`, {
        method: "POST",
    });

    useEffect(() => {
        if (data) {
            notify("Template saved successfully!", "success");
            setOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleSave = () => {
        if (!templateName) {
            notify("Please enter template name", "warning");
        }

        const data = {
            t_type: open?.type,
            t_name: templateName,
            t_doctor_id: currentUser?.u_id,
            t_template: values[open?.type],
        };

        refetch({
            body: data,
        });
    };

    return (
        <Dialog
            open={open?.open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">{open?.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <TextField
                        variant="outlined"
                        margin="dense"
                        id="name"
                        label="Template Name"
                        type="text"
                        onChange={(e) => setTemplateName(e.target.value)}
                        autoFocus
                        fullWidth
                    />
                </DialogContentText>
            </DialogContent>
            <AroggaDialogActions
                isLoading={isLoading}
                confirmLabel="Save"
                onDialogClose={() => setOpen(false)}
                onConfirm={handleSave}
            />
        </Dialog>
    );
};
