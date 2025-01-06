const fs = require("fs");
const path = require("path");
const metaJson = path.join(process.cwd(), "public", "meta.json");

const getRandomVersion = () => {
    const timestamp = Date.now().toString(36);
    const randomNum = Math.random().toString(36).substr(2, 9);

    return `${timestamp}-${randomNum}`;
};

const appVersion = getRandomVersion();

const jsonContent = JSON.stringify({
    version: appVersion,
});

fs.writeFile(metaJson, jsonContent, "utf8", function (err) {
    if (err) {
        console.error(
            "An error occurred while writing JSON Object to meta.json"
        );
        throw console.error(err);
    } else {
        console.log(`meta.json file has been saved with v${appVersion}`);
    }
});
