import { useEffect, useState } from "react";
import { useNotify, useRefresh } from "react-admin";

import { toQueryString } from "../dataProvider/toQueryString";
import { Status } from "../utils/enums";
import { logger } from "../utils/helpers";
import { httpClient } from "../utils/http";
import { isEmpty } from "./../utils/helpers";

type Method =
    | "get"
    | "GET"
    | "delete"
    | "DELETE"
    | "head"
    | "HEAD"
    | "options"
    | "OPTIONS"
    | "post"
    | "POST"
    | "put"
    | "PUT"
    | "patch"
    | "PATCH"
    | "purge"
    | "PURGE"
    | "link"
    | "LINK"
    | "unlink"
    | "UNLINK";

interface IApiOptions {
    body?: object;
    params?: object;
    headers?: object;
    method?: Method;
    [key: string]: any;
}
interface ISuccessData {
    data: any;
    total: number;
    status: "success";
    isError: false;
    isSuccess: true;
}
interface IFailResponse {
    data: any;
    message: any;
    status: "fail";
    trace: any;
}

interface IOptions {
    isBaseUrl?: boolean;
    isCustomUrl?: boolean;
    isRefresh?: boolean;
    isPreFetching?: boolean;
    isKeepPreviousData?: boolean;
    refreshDeps?: any[];
    isSuccessNotify?: boolean;
    isWarningNotify?: boolean;
    successNotify?: string;
    warningNotify?: string;
    onSuccess?: (successData: ISuccessData) => void;
    onFailure?: (failRespose?: IFailResponse) => void;
    onError?: Function;
    onFinally?: Function;
}

const useRequest = (
    endpoint?: string,
    apiOptions: IApiOptions = {},
    {
        isBaseUrl,
        isCustomUrl,
        isRefresh = false,
        isPreFetching = false,
        isKeepPreviousData = false,
        refreshDeps = [],
        isSuccessNotify = true,
        isWarningNotify = true,
        successNotify,
        warningNotify,
        onSuccess,
        onFailure,
        onError,
        onFinally,
    }: IOptions = {}
) => {
    const notify = useNotify();
    const refresh = useRefresh();

    const [state, setState] = useState({
        data: undefined,
        total: 0,
        status: undefined,
        isInitialFetch: isPreFetching,
        isLoading: false,
        isError: false,
        isSuccess: false,
    });
    const [refetchEndpoint, setRefetchEndpoint] = useState("");
    const [refetchBody, setRefetchBody] = useState({});
    const [refetchMethod, setRefetchMethod] = useState("");
    const [refetchIndex, setRefetchIndex] = useState(0);

    const {
        data,
        total,
        status,
        isInitialFetch,
        isLoading,
        isError,
        isSuccess,
    } = state;

    useEffect(() => {
        if (isInitialFetch) {
            fetchData();
        } else if (
            !isEmpty(refreshDeps) &&
            !refreshDeps?.every((dep) => dep === undefined || dep === null)
        ) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchIndex, ...refreshDeps]);

    const fetchData = () => {
        setState((prevState) => ({
            ...prevState,
            ...(!isKeepPreviousData && { data: undefined }),
            isLoading: true,
            isError: false,
            isSuccess: false,
        }));

        let options;

        if (!isEmpty(refetchBody)) {
            options = {
                ...apiOptions,
                body: toQueryString(refetchBody),
            };
        } else if (apiOptions.body) {
            options = {
                ...apiOptions,
                body: toQueryString(apiOptions.body),
            };
        } else {
            options = apiOptions;
        }
        !!refetchMethod && (options.method = refetchMethod);

        httpClient(refetchEndpoint || endpoint, {
            ...options,
            isBaseUrl,
            isCustomUrl,
        })
            .then((response) => {
                const { json } = response || {};

                if (json?.status === Status.SUCCESS || json?.success === true) {
                    const successData: ISuccessData = {
                        data: json?.data,
                        total: json?.count ? json?.count : json?.total,
                        status: json?.status,
                        isError: false,
                        isSuccess: true,
                    };
                    setState((prevState) => ({
                        ...prevState,
                        ...successData,
                    }));
                    !!onSuccess && onSuccess(successData);
                    !!isRefresh && refresh();
                    if (!isSuccessNotify) return;
                    if (successNotify || json?.message)
                        notify(successNotify || json?.message, {
                            type: "success",
                        });
                } else {
                    setState((prevState) => ({
                        ...prevState,
                        data: json?.data,
                        status: json?.status,
                        isError: true,
                        isSuccess: false,
                    }));
                    // Have to refactor this in future
                    const failResponse: IFailResponse = {
                        data: json?.data,
                        message: json?.message,
                        status: json?.status,
                        trace: json?.trace,
                    };
                    !!onFailure && onFailure(failResponse);
                    if (!isWarningNotify) return;
                    if (warningNotify || json?.message)
                        notify(warningNotify || json?.message, {
                            type: "warning",
                        });
                }
            })
            .catch((err) => {
                setState((prevState) => ({
                    ...prevState,
                    status: Status.FAIL,
                    isError: true,
                    isSuccess: false,
                }));
                !!onError && onError();
                notify(
                    warningNotify ||
                        err?.message ||
                        "Something went wrong, Please try again!",
                    { type: "error" }
                );
                logger(err);
            })
            .finally(() => {
                setState((prevState) => ({
                    ...prevState,
                    isLoading: false,
                }));
                !!onFinally && onFinally();
            });
    };

    /**
     * objData can be SyntheticBaseEvent or object containing only body object
     * @param objData - object
     */
    const refetch = (objData = {}) => {
        if (!state.isInitialFetch) {
            setState((prevState) => ({
                ...prevState,
                isInitialFetch: true,
            }));
        }
        const { endpoint, body, method }: any = objData;
        !!endpoint && setRefetchEndpoint(endpoint);
        !!method && setRefetchMethod(method);
        !isEmpty(body) && setRefetchBody(body);
        setRefetchIndex((prevState) => prevState + 1);
    };

    const reset = () =>
        setState({
            data: undefined,
            total: 0,
            status: undefined,
            isInitialFetch: isPreFetching,
            isLoading: false,
            isError: false,
            isSuccess: false,
        });

    return {
        data,
        total,
        status,
        isLoading,
        isError,
        isSuccess,
        refetch,
        reset,
    } as {
        data: any;
        total: number;
        status: "success" | "error" | "fail";
        isLoading: boolean;
        isError: boolean;
        isSuccess: boolean;
        refetch: (objData?: any) => void;
        reset: () => void;
    };
};

export default useRequest;
