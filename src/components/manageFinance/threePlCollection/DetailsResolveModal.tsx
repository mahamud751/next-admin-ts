import { Button, Dialog, DialogContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  FileField,
  FileInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
  useNotify,
} from "react-admin";
import { toQueryString } from "@/dataProvider/toQueryString";
import { httpClient } from "@/utils/http";
import ModalTitle from "./resolveModal/ModalTitle";
import { convertFileToBase64 } from "@/utils/helpers";
import { Status } from "@/utils/enums";
import { useState } from "react";
type Props = {
  data: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DetailsResolveModal({
  data,
  open,
  onClose,
  onSuccess,
}: Props) {
  const cs = useStyles();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const base64File: any = await convertFileToBase64(
      values?.attachedFiles_tcd_reference_doc
    );

    httpClient(`/v1/resolveThirdPartyCollection/${data?.tcd_id}`, {
      method: "POST",
      body: base64File
        ? toQueryString({
            tcd_settlement_remark: values?.tcd_settlement_remark,
            "attachedFiles_tcd_reference_doc[0][title]": base64File?.title,
            "attachedFiles_tcd_reference_doc[0][src]": base64File?.src,
            tcd_comment: values?.tcd_comment,
          })
        : toQueryString({
            tcd_settlement_remark: values?.tcd_settlement_remark,
            tcd_comment: values?.tcd_comment,
          }),
    })
      .then(({ json }: any) => {
        if (json?.status === Status.SUCCESS) {
          onClose();
          onSuccess();
          notify(json?.message, {
            type: "success",
          });
        }
        if (json?.status !== Status.SUCCESS) {
          notify(json?.message, {
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const CustomToolbar = (props) => (
    <Toolbar className={cs.actions} {...props}>
      <Button size="small" onClick={onClose}>
        Cancel
      </Button>
      <SaveButton label="Submit" size="small" icon={<></>} disabled={loading} />
    </Toolbar>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      maxWidth={"xl"}
    >
      <ModalTitle onClose={onClose} />
      <DialogContent className={cs.dialogContent}>
        <SimpleForm onSubmit={handleSubmit} toolbar={<CustomToolbar />}>
          <SelectInput
            source="tcd_settlement_remark"
            label="Select Case"
            variant="outlined"
            fullWidth
            choices={[
              // { id: "paid_later", name: "Paid later" },
              {
                id: "lost_damaged",
                name: "Lost & Damage (Arogga)",
              },
              // {
              //     id: "collection_not_found",
              //     name: "Collection not found",
              // },
              {
                id: "product_returned",
                name: "Delivered in system, but product returned",
              },
            ]}
            helperText={false}
            validate={[required()]}
            style={{ marginBottom: "20px" }}
          />
          <FileInput
            source="attachedFiles_tcd_reference_doc"
            label="Reference document (Max 5MB)"
            helperText={false}
            placeholder="Upload reference document (Max 5MB)"
            accept={{
              "application/pdf": [".pdf"],
              "image/*": [".jpg", ".jpeg", ".png", ".gif"],
            }}
            maxSize={5000000} // 5mb
            // validate={[required()]}
          >
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput
            source="tcd_comment"
            label="Remarks"
            variant="outlined"
            fullWidth
          />
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
}
const useStyles = makeStyles((theme) => ({
  heading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogContent: {
    padding: "0px 0px",
    minWidth: "350px",
  },
  summary: {
    fontWeight: 700,
    fontSize: "14px",
    color: "#333",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
  },
}));
