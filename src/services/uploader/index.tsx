import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { FileField, FileInput, useNotify } from "react-admin";

import { uploadDataProvider } from "@/dataProvider";
import { useRequest } from "@/hooks";
import { FILE_MAX_SIZE } from "@/utils/constants";
import { transformFiles } from "@/utils/helpers";
import WebcamModal from "./WebcamModal";
import AroggaBackdrop from "@/components/common/AroggaBackdrop";

interface TabPanelProps {
  children?: ReactNode;
  index: any;
  value: any;
}

interface AroggaUploaderProps {
  open: boolean;
  accept?: string;
  source?: string;
  webCam?: boolean;
  onClose: () => void;
  refresh?: () => void;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const AroggaUploader = ({
  open,
  source,
  webCam = true,
  onClose,
  refresh,
}: AroggaUploaderProps) => {
  const notify = useNotify();
  const [value, setValue] = useState(0);
  const [webCamImage, setWebCamImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isSuccess, isError, isLoading, refetch } = useRequest(`/${source}`, {
    method: "POST",
  });

  useEffect(() => {
    if (webCamImage) {
      refetch({
        body: { attachedFiles: [webCamImage] },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webCamImage]);

  useEffect(() => {
    if (isSuccess) {
      notify("Successfully uploaded!", {
        type: "success",
      });
      setWebCamImage(null);
      onClose();
      refresh && refresh();
    }
    if (isError) {
      notify("Something went wrong, Please try again!", {
        type: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <AroggaBackdrop isLoading={isLoading || loading} />
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          aria-label="simple tabs example"
        >
          <Tab label="Upload From Local" {...a11yProps(0)} />
          {webCam && <Tab label="Upload From Camera" {...a11yProps(1)} />}
        </Tabs>
        <TabPanel value={value} index={0}>
          <FileInput
            source="filesAttached"
            label=""
            helperText={false}
            accept="image/*, application/pdf"
            maxSize={FILE_MAX_SIZE}
            placeholder={
              "Drag and drop some files here, or click to select files"
            }
            options={{
              onDrop: async (newFiles) => {
                setLoading(true);

                const modifiedFiles = transformFiles(newFiles, "attachedFiles");

                try {
                  await uploadDataProvider.create(source, {
                    data: {
                      attachedFiles: modifiedFiles,
                    },
                  });
                  notify("Successfully uploaded!", {
                    type: "success",
                  });
                  refresh && refresh();
                } catch {
                  notify("Something went wrong, Please try again!", {
                    type: "error",
                  });
                }
                setLoading(false);
              },
            }}
            multiple
          >
            <FileField source="src" title="title" />
          </FileInput>
        </TabPanel>
        {webCam && (
          <TabPanel value={value} index={1}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <WebcamModal callback={setWebCamImage} />
            </div>
          </TabPanel>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
