import axios from "axios";

const toAvroTranslate = async (text: string) => {
    if (!text) return [];

    const { data } = await axios.get(
        `https://inputtools.google.com/request?text=${text}&itc=bn-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
    );

    return data?.[1]?.[0]?.[1];
};

export default toAvroTranslate;
