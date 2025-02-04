import { Dialog } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import { Button, ImageField, useNotify } from "react-admin";
import { useFormContext } from "react-hook-form";
import { DropzoneArea } from "mui-file-dropzone";

import { FILE_MAX_SIZE } from "@/utils/constants";
import { getImageDetails } from "@/utils/helpers";

type AroggaMovableImageInputProps = {
  source: string;
  minimumDimension?: number;
  dimentionValidation?: boolean;
  existingFiles?: Array<{ src: string; title: string }>;
  [key: string]: any;
  label?: string;
};

const AroggaMovableImageInput: FC<AroggaMovableImageInputProps> = ({
  source,
  minimumDimension = 700,
  dimentionValidation = false,
  existingFiles = [],
  label,
  ...rest
}) => {
  const { setValue, getValues, trigger } = useFormContext();
  const classes = useStyles();
  const notify = useNotify();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const currentAttachedFiles = getValues(source) || existingFiles;

  const onDropHandler = async (newFiles) => {
    const imageDetails = await getImageDetails(newFiles);

    let isWarningToasterShow = false;
    const haveToRemoveImageNames: string[] = [];

    imageDetails?.forEach((image) => {
      if (
        image.width < minimumDimension ||
        image.height < minimumDimension ||
        image.width !== image.height
      ) {
        haveToRemoveImageNames.push(image?.title);
        if (!isWarningToasterShow) {
          isWarningToasterShow = true;
        }
      }
    });

    const attachedFiles = newFiles.map((file) => ({
      rawFile: file,
      src: URL.createObjectURL(file),
      title: file.name,
    }));

    const updatedFiles = [...currentAttachedFiles, ...attachedFiles];
    setValue(source, updatedFiles);

    if (isWarningToasterShow) {
      notify(
        `Please upload an image with minimum dimensions of ${minimumDimension}x${minimumDimension} pixels! Only square-shaped images allowed such as an aspect ratio of 1:1`,
        { type: "warning" }
      );
    }
  };

  const handleRemoveImage = async (index: number) => {
    const updatedFiles = currentAttachedFiles.filter((_, i) => i !== index);
    setValue(source, updatedFiles);
    await trigger(source);
  };

  return (
    <>
      <div className={classes.rootDiv}>
        {label
          ? label
          : `Attached Images (Minimum dimensions: ${minimumDimension}x${minimumDimension}px, Ratio: 1:1)`}

        <DropzoneArea
          acceptedFiles={[".jpeg", ".jpg", ".png", ".webp"]}
          maxFileSize={FILE_MAX_SIZE}
          classes={{
            root: classes.root,
          }}
          dropzoneText="Drag and drop an image here or click"
          onDrop={onDropHandler}
          showPreviews={existingFiles.length > 0}
          showPreviewsInDropzone={false}
          previewGridProps={{
            container: { spacing: 2 },
            item: { xs: 12, sm: 6, md: 4 },
          }}
          {...rest}
        />

        <div className={classes.preview}>
          {currentAttachedFiles.map((file, index) => (
            <>
              <div key={index} style={{ display: "inline-block", margin: 10 }}>
                <ImageField
                  source="src"
                  title="title"
                  record={file}
                  //@ts-ignore
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage({
                      src: file.src,
                      alt: file.title,
                    });
                    setIsDialogOpen(true);
                  }}
                />
                <Button onClick={() => handleRemoveImage(index)}>
                  <span>Remove</span>
                </Button>
              </div>
            </>
          ))}
        </div>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <img src={selectedImage?.src} alt={selectedImage?.alt} />
        </Dialog>
      </div>
    </>
  );
};

export default AroggaMovableImageInput;

const useStyles = makeStyles({
  rootDiv: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    width: "100%",
  },
  root: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    border: "2px dashed #008069",
  },
  preview: {
    marginTop: 12,
  },
});
