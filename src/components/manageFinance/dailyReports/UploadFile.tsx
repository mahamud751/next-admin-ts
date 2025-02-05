import AttachFileIcon from "@mui/icons-material/AttachFile";
import { FC } from "react";
import { FileField, FileInput, useNotify } from "react-admin";

import { uploadDataProvider } from "@/dataProvider";
import { FILE_MAX_SIZE } from "@/utils/constants";
import { logger, transformFiles } from "@/utils/helpers";

type UploadFileProps = {
  id: string;
  endpointKey: "ledger" | "expenses" | "productPurchase";
  refresh: () => void;
};

const UploadFile: FC<UploadFileProps> = ({ id, endpointKey, refresh }) => {
  const notify = useNotify();

  return (
    <FileInput
      source={`filesAttached-${id}`}
      label=""
      accept={{
        "application/pdf": [".pdf"],
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      }}
      maxSize={FILE_MAX_SIZE}
      placeholder={<AttachFileIcon />}
      helperText={false}
      options={{
        onDrop: async (newFiles) => {
          const modifiedFiles = transformFiles(newFiles, "attachedFiles");

          try {
            await uploadDataProvider.create(
              endpointKey === "productPurchase"
                ? `v3/${endpointKey}/attachedFileUpload/${id}`
                : `v1/${endpointKey}/attachedFileUpload/${id}`,
              {
                data: { attachedFiles: modifiedFiles },
              }
            );
            notify("Successfully uploaded!", {
              type: "success",
            });
            refresh();
          } catch (err) {
            logger(err);
            notify("Something went wrong, Please try again!", {
              type: "error",
            });
          }
        },
      }}
      multiple
    >
      <FileField source="src" title="title" />
    </FileInput>
  );
};

export default UploadFile;
