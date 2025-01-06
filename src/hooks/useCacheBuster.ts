/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

import { logger } from "../utils/helpers";

interface IUseCacheBuster {
    timeout?: number;
    isEnabled?: boolean;
}

const useCacheBuster = ({
    timeout = 10 * 60 * 1000, // 10 minutes
    isEnabled = true,
}: IUseCacheBuster) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLatestVersion, setIsLatestVersion] = useState(true);

    const intervalRef = useRef<number | null>(null);
    const CACHE_CHECK_KEY = "cache-check-timestamp";

    useEffect(() => {
        if (isEnabled && !isLatestVersion) {
            refreshCacheAndReload();
        }
    }, [isEnabled, isLatestVersion]);

    useEffect(() => {
        if (!isEnabled) return logger("Cache Buster is disabled!", false);

        const startIfNeeded = () => {
            if (globalThis.navigator.onLine && !intervalRef.current) {
                checkCacheStatus();
                startInterval();
            }
        };

        globalThis.addEventListener("online", startIfNeeded);
        globalThis.addEventListener("offline", stopInterval);
        globalThis.addEventListener("focus", startIfNeeded);
        globalThis.addEventListener("blur", stopInterval);

        startIfNeeded();

        return () => {
            stopInterval();
            globalThis.removeEventListener("online", startIfNeeded);
            globalThis.removeEventListener("offline", stopInterval);
            globalThis.removeEventListener("focus", startIfNeeded);
            globalThis.removeEventListener("blur", stopInterval);
        };
    }, []);

    const startInterval = () => {
        stopInterval();
        intervalRef.current = +globalThis.setInterval(
            checkCacheStatus,
            timeout
        );
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            globalThis.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const shouldRunCacheCheck = () => {
        const lastCheck = localStorage.getItem(CACHE_CHECK_KEY);
        const now = Date.now();
        if (!lastCheck || now - parseInt(lastCheck, 10) > timeout) {
            localStorage.setItem(CACHE_CHECK_KEY, now.toString());
            return true;
        }
        return false;
    };

    const checkCacheStatus = async () => {
        if (!shouldRunCacheCheck()) return;

        setIsLoading(true);

        try {
            const latestResponse = await fetch(
                `meta.json?cacheBuster=${Date.now()}`,
                { cache: "no-store" }
            );

            const { version: latestVersion } = await latestResponse.json();
            const currentVersion = localStorage.getItem("app-random-version");

            const shouldForceRefresh = latestVersion !== currentVersion;

            if (shouldForceRefresh) {
                console.log(
                    `There is a new version (v${latestVersion}). Should force refresh.`
                );
                setIsLatestVersion(false);
                localStorage.setItem("app-random-version", latestVersion);
            } else {
                setIsLatestVersion(true);
            }
        } catch (err) {
            logger(err);
            setIsLatestVersion(true);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshCacheAndReload = async () => {
        try {
            if ("caches" in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map((cache) => caches.delete(cache))
                );
            }
            window.location.reload();
        } catch (err) {
            logger(err);
        }
    };

    return {
        isLoading,
        isLatestVersion,
        refreshCacheAndReload,
        startCheckCacheStatus: startInterval,
        stopCheckCacheStatus: stopInterval,
    };
};

export default useCacheBuster;
