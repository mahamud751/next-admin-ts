import axios from "axios";

const toGoogleTranslate = async (
    text,
    apiKey: string,
    source: string,
    target: string
) => {
    if (!text) return "";

    const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
            q: text,
            source,
            target,
        }
    );

    return response.data.data.translations[0].translatedText;
};

const toGoogleTranslateFromAnyData = async (
    data,
    apiKey: string,
    source: string = "en",
    target: string = "bn"
) => {
    if (data !== null) {
        switch (typeof data) {
            case "string":
                const translatedText = await toGoogleTranslate(
                    data,
                    apiKey,
                    source,
                    target
                );
                data = translatedText;
                break;
            case "object":
                if (data?.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        data[i] = await toGoogleTranslateFromAnyData(
                            data[i],
                            apiKey
                        );
                    }
                } else {
                    for (let i in data) {
                        data[i] = await toGoogleTranslateFromAnyData(
                            data[i],
                            apiKey
                        );
                    }
                }
                break;
        }
    }

    return data;
};

export default toGoogleTranslateFromAnyData;
