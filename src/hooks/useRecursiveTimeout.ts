import { useEffect, useRef } from "react";

import { logger } from "../utils/helpers";

const useRecursiveTimeout = (
    callback: (hard?: boolean) => void,
    delay: number
) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        let id: NodeJS.Timeout;

        function tick() {
            const ret: any = savedCallback.current();

            if (ret instanceof Promise) {
                ret.then(() => {
                    if (delay !== null) {
                        id = setTimeout(tick, delay);
                    }
                }).catch((err) => logger(err));
            } else {
                if (delay !== null) {
                    id = setTimeout(tick, delay);
                }
            }
        }

        if (delay !== null) {
            id = setTimeout(tick, delay);
            return () => id && clearTimeout(id);
        }
    }, [delay]);
};

export default useRecursiveTimeout;
