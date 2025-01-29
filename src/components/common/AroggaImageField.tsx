import { Dialog } from "@mui/material";
import { FC, useState } from "react";
import { ImageField } from "react-admin";

type AroggaImageFieldProps = {
  source: string;
  [key: string]: any;
};

const AroggaImageField: FC<AroggaImageFieldProps> = ({ source, ...rest }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <ImageField
        //@ts-ignore
        source={source}
        src="src"
        title="title"
        {...rest}
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
    </>
  );
};

export default AroggaImageField;
