export const toQueryString = (obj, prefix: string = ""): string => {
    var str = [],
        k,
        v;
    for (var p in obj) {
        if (!obj.hasOwnProperty(p)) {
            continue;
        }
        // Skip things from the prototype.
        if (~p.indexOf("[")) {
            k = prefix
                ? prefix +
                  "[" +
                  p.substring(0, p.indexOf("[")) +
                  "]" +
                  p.substring(p.indexOf("["))
                : p;
            // Only put whatever is before the bracket into new brackets; append the rest.
        } else {
            k = prefix ? prefix + "[" + p + "]" : p;
        }
        v = obj[p];
        if (
            null === v ||
            false === v ||
            undefined === v ||
            (typeof v === "object" && !Object.keys(v).length)
        ) {
            v = "";
        }
        str.push(
            typeof v === "object"
                ? toQueryString(v, k)
                : encodeURIComponent(k) + "=" + encodeURIComponent(v)
        );
    }

    return str.join("&");
};
