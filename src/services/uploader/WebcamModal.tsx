import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

import AroggaDialogActions from "../../components/AroggaDialogActions";
import DokaModal from "../../lib/arogga-image-editor/components/DokaModal";
import { convertFileToBase64 } from "../../utils/helpers";

const WebcamModal = ({ callback }) => {
    const [open, setOpen] = useState(false);
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [enableDoka, setEnableDoka] = useState(false);
    const [image, setImage] = useState({
        src: null,
        title: null,
    });

    const onClose = () => setOpen(false);

    const onCapture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot({
            width: 1920,
            height: 1080,
        });
        setImageSrc(imageSrc);
        setEnableDoka(true);
    }, [webcamRef]);

    const handleDokaConfirm = async (output) => {
        const image: any = await convertFileToBase64({
            rawFile: output.file,
            title: "WebcamImage-" + Math.random().toString(36).substring(2, 15),
        });
        setImage(image);
        setImageSrc(null);
        setEnableDoka(false);
    };

    const handleDokaCancel = () => {
        setEnableDoka(false);
        setImage(null);
        setImageSrc(null);
    };

    const onConfirm = () => {
        callback(image);
        setOpen(false);
        setImage({
            src: null,
            title: null,
        });
        setImageSrc(null);
    };

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpen(true)}
            >
                Open Camera
            </Button>
            <Dialog open={open} onClose={onClose} maxWidth="lg">
                <DialogTitle>Capture Image</DialogTitle>
                <DialogContent style={{ padding: 0 }}>
                    {!imageSrc && !image?.src ? (
                        <Webcam
                            ref={webcamRef}
                            screenshotQuality={1}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                width: 1280,
                                height: 720,
                                facingMode: "user",
                            }}
                        />
                    ) : (
                        image?.src && (
                            <img
                                src={image.src}
                                alt={image.title}
                                style={{
                                    width: 500,
                                    height: 500,
                                }}
                            />
                        )
                    )}
                    {enableDoka && (
                        <DokaModal
                            src={imageSrc}
                            utils={["crop", "filter", "color"]}
                            cropShowSize={true}
                            cropAspectRatio={1}
                            cropMinImageWidth={1000}
                            cropMinImageHeight={1000}
                            onConfirm={handleDokaConfirm}
                            onCancel={handleDokaCancel}
                        />
                    )}
                </DialogContent>
                <AroggaDialogActions
                    isLoading={false}
                    onDialogClose={() => {
                        setOpen(false);
                        setImage({
                            src: null,
                            title: null,
                        });
                        setImageSrc(null);
                    }}
                    confirmLabel={image?.src ? "Use" : "Capture"}
                    onConfirm={image?.src ? onConfirm : onCapture}
                />
            </Dialog>
        </>
    );
};

export default WebcamModal;
