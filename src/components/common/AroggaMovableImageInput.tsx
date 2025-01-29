import { Dialog } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import { ImageField, useNotify } from "react-admin";
import { useFormContext } from "react-hook-form";
import { DropzoneArea } from "mui-file-dropzone";

import { FILE_MAX_SIZE } from "@/utils/constants";
import { getImageDetails } from "@/utils/helpers";

type AroggaMovableImageInputProps = {
  source: string;
  minimumDimension?: number;
  dimentionValidation?: boolean;
  [key: string]: any;
  label?: string;
};

const AroggaMovableImageInput: FC<AroggaMovableImageInputProps> = ({
  source,
  minimumDimension = 700,
  dimentionValidation = false,
  label,
  ...rest
}) => {
  const { setValue } = useFormContext();
  const classes = useStyles();
  const notify = useNotify();
  console.log(rest);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const onDropHandler = async (newFiles) => {
    const imageDetails = await getImageDetails(newFiles);

    let isWarningToasterShow = false;
    const haveToRemoveImageNames = [];

    imageDetails?.forEach((image) => {
      if (
        image.width < minimumDimension ||
        image.height < minimumDimension ||
        image.width !== image.height
      ) {
        haveToRemoveImageNames.push(image.title);
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
    const updatedFiles = attachedFiles;

    setValue(source, updatedFiles);

    if (isWarningToasterShow) {
      notify(
        `Please upload an image with a minimum dimensions of ${minimumDimension}x${minimumDimension} pixels! Only square-shaped images allowed such as an aspect ratio of 1:1`,
        { type: "warning" }
      );
    }
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
          onDrop={dimentionValidation ? onDropHandler : undefined}
          showPreviews={true}
          showPreviewsInDropzone={false}
          previewGridProps={{
            container: { spacing: 2 },
            item: { xs: 12, sm: 6, md: 4 },
          }}
          {...rest}
        />
        <ImageField
          source="src"
          title="title"
          // @ts-ignore
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage({
              src: e.target?.currentSrc,
              alt: e.target?.alt,
            });
            e.target?.currentSrc && setIsDialogOpen(true);
          }}
        />

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
