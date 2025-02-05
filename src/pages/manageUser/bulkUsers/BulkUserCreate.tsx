import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import {
  Button,
  Create,
  CreateProps,
  FileField,
  FileInput,
  SimpleForm,
  TextInput,
  useNotify,
  usePermissions,
} from "react-admin";
import { useNavigate } from "react-router-dom";

import { useDocumentTitle, useRequest } from "../../../hooks";

const BulkUserCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Bulk User Create");
  const classes = useStyles();
  const navigate = useNavigate();
  const notify = useNotify();
  const { permissions } = usePermissions();
  const [formValues, setFormValues] = useState({
    bucr_title: "",
    bucr_request_status: "",
    bucr_attachment: "",
  });

  const { refetch: handleSubmit } = useRequest(
    "/v1/bulkUserCreateRequest",
    {
      method: "POST",
      body: {
        bucr_title: formValues?.bucr_title,
        bucr_request_status: "pending",
      },
    },
    {
      isSuccessNotify: false,
      onSuccess: ({ data }) => {
        uploadFileToS3(
          data?.attachedFiles_bucr_attachment_presignedUrl,
          data?.bucr_id
        );
      },
    }
  );

  const uploadFileToS3 = async (presignedUrl, keyId) => {
    try {
      const res = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          // @ts-ignore
          "Content-Type": formValues?.bucr_attachment?.type,
        },
        body: formValues?.bucr_attachment,
      });
      if (res.status === 200) {
        keyId &&
          fetchAccountingHead({
            endpoint: `/v1/users/bulkUserCreate`,
            body: { _bucr_id: keyId },
          });
      }
      if (res.ok) {
        notify("File uploaded successfully!", { type: "success" });
        navigate("/v1/bulkUserCreateRequest");
        // rest.history.push("/v1/bulkUserCreateRequest");
      } else {
        notify("Failed to upload file to S3!", { type: "error" });
      }
    } catch {
      notify("Error uploading attachment to S3!", { type: "error" });
    }
  };
  const { refetch: fetchAccountingHead } = useRequest(
    "",
    {
      method: "POST",
    },
    {
      isSuccessNotify: true,
    }
  );

  const handleOnChange = (key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Create {...rest}>
      <SimpleForm toolbar={null}>
        <TextInput
          source="bucr_title"
          label="Title *"
          variant="outlined"
          helperText={false}
          onChange={(e) => handleOnChange("bucr_title", e.target.value)}
        />
        <FileInput
          source="bucr_attachment"
          label="Attachment *"
          placeholder={
            "Drag and drop some files here or click to select files. Only .csv files are allowed"
          }
          accept={{
            "text/csv": [".csv"],
          }}
          helperText={false}
          onChange={(e) => handleOnChange("bucr_attachment", e)}
        >
          <FileField source="src" title="title" />
        </FileInput>
        <>
          <Button
            label="Submit"
            variant="contained"
            onClick={handleSubmit}
            disabled={!formValues?.bucr_title || !formValues?.bucr_attachment}
            style={{ marginTop: 15, marginBottom: 2 }}
          />
        </>
      </SimpleForm>
    </Create>
  );
};

export default BulkUserCreate;

const useStyles = makeStyles({
  root: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  dropZone: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    border: "2px dashed #008069",
    borderRadius: 10,
  },
  preview: {
    marginTop: 12,
  },
});
