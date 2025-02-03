import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import {
  Button,
  Create,
  CreateProps,
  DateTimeInput,
  FileField,
  FileInput,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  useNotify,
} from "react-admin";
import { useNavigate } from "react-router-dom";

import { useDocumentTitle, useRequest } from "@/hooks";
import { toFormattedDateTime } from "@/utils/helpers";
import AroggaBackdrop from "@/components/common/AroggaBackdrop";

const NotificationScheduleCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Notification Schedule Create");
  const navigate = useNavigate();
  const classes = useStyles();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    ns_name: "",
    ns_status: "",
    ns_date_time: "",
    ns_attachment: "",
  });
  const [channels, setChannels] = useState([]);

  const { refetch } = useRequest(
    "/v1/NotificationSchedule",
    {
      method: "POST",
      body: {
        ns_name: formValues?.ns_name,
        ns_channels: channels,
        ns_status: "pending",
        ns_date_time: formValues?.ns_date_time,
      },
    },
    {
      onSuccess: (data) => {
        const presignedUrl =
          data?.data.attachedFiles_ns_attachment_presignedUrl;

        if (presignedUrl) {
          setTimeout(() => {
            uploadFileToS3(presignedUrl);
          }, 3000);
        } else {
          setLoading(false);
        }
      },
      onError: () => {
        setLoading(false);
      },
      isSuccessNotify: false,
    }
  );

  const uploadFileToS3 = async (presignedUrl) => {
    try {
      const res = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          // @ts-ignore
          "Content-Type": formValues?.ns_attachment?.type,
        },
        body: formValues?.ns_attachment,
      });

      if (res.ok) {
        notify("File uploaded successfully!", { type: "success" });
        navigate("/v1/NotificationSchedule");
      } else {
        notify("Failed to upload file to S3!", { type: "error" });
      }
    } catch {
      notify("Error uploading file!", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await refetch();
  };

  return (
    <Create {...rest}>
      <SimpleForm toolbar={null}>
        <AroggaBackdrop isLoading={loading} />
        <TextInput
          source="ns_name"
          label="Name *"
          variant="outlined"
          helperText={false}
          onChange={(e) => handleOnChange("ns_name", e.target.value)}
        />

        <SelectArrayInput
          source="ns_channels"
          label="Service"
          variant="outlined"
          choices={[
            { id: "email", name: "Email" },
            { id: "sms", name: "Sms" },
            { id: "push", name: "Push" },
            { id: "all", name: "All" },
          ]}
          helperText={false}
          onChange={(e) => setChannels(e.target.value)}
        />
        <DateTimeInput
          source="ns_date_time"
          label="Date"
          variant="outlined"
          parse={(dateTime) =>
            toFormattedDateTime({
              dateString: dateTime,
            })
          }
          helperText={false}
          onChange={(e) => handleOnChange("ns_date_time", e.target.value)}
          inputProps={{
            min: new Date().toISOString().slice(0, 16),
          }}
        />
        <FileInput
          source="ns_attachment"
          label="Attachment *"
          placeholder={
            "Drag and drop some files here or click to select files. Only .csv files are allowed"
          }
          accept={{ "text/csv": [".csv"] }}
          helperText={false}
          onChange={(e) => handleOnChange("ns_attachment", e)}
        >
          <FileField source="src" title="title" />
        </FileInput>
        <Box mb={1}>
          <Button
            label="Submit"
            variant="contained"
            disabled={
              loading ||
              !formValues?.ns_name ||
              !formValues?.ns_date_time ||
              !formValues?.ns_attachment
            }
            onClick={handleSubmit}
          />
        </Box>
      </SimpleForm>
    </Create>
  );
};

export default NotificationScheduleCreate;

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
