import { logger } from "../utils/helpers";

const getCameraBaseUrl = () => {
    let cameraBaseUrl = localStorage.getItem("camera-base-url");

    cameraBaseUrl = cameraBaseUrl.trim().replace(/^\/+|\/+$/g, "");

    if (!cameraBaseUrl.startsWith("https://")) {
        cameraBaseUrl = "https://" + cameraBaseUrl;
    }

    return cameraBaseUrl;
};

export const getCameraInfo = async () => {
    const BASE_URL = getCameraBaseUrl();

    try {
        const response = await fetch(`${BASE_URL}/sony/camera`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                method: "getEvent",
                id: 1,
                params: [false],
            }),
        });
        return response;
    } catch (err) {
        logger(err, true);
    }
};

export const getPictureUrlFromCamera = async () => {
    const BASE_URL = getCameraBaseUrl();

    try {
        const response = await fetch(`${BASE_URL}/sony/camera`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                method: "actTakePicture",
                id: 1,
                params: [],
                version: "1.0",
            }),
        });
        const json = await response.json();
        return json.result[0][0];
    } catch (err) {
        logger(err, true);
    }
};

export const getBase64ImageFromUrl = async (url) => {
    const BASE_URL = getCameraBaseUrl();

    try {
        const response = await fetch(BASE_URL + url);

        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        logger(err, true);
    }
};
