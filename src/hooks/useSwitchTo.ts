import { useEffect } from "react";
import { useRedirect } from "react-admin";
import { useLocation } from "react-router-dom";

import { inMemoryJWT } from "../services";
import useRequest from "./useRequest";

const useSwitchTo = (userId) => {
    const redirect = useRedirect();
    const location = useLocation();

    const { isLoading, isSuccess, data, refetch } = useRequest(
        `/v1/auth/switch-to/${userId}`,
        {
            method: "POST",
            credentials: "include",
        },
        { isBaseUrl: true }
    );

    useEffect(() => {
        if (!isSuccess) return;

        inMemoryJWT.setToken(data?.authToken, data?.tokenExpiry);
        localStorage.setItem("user", JSON.stringify(data?.user));
        // @ts-ignore
        redirect(location?.search?.split("?prevLocation=")?.[1]);
        globalThis.location.reload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    return {
        isLoading,
        refetch,
    } as {
        isLoading: boolean;
        refetch: (objData?: any) => void;
    };
};

export default useSwitchTo;
