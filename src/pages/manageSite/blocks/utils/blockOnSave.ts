import { NotificationType } from "react-admin";

import {
    capitalizeFirstLetterOfEachWord,
    convertAttachmentsToBase64,
    isArray,
    logger,
} from "../../../../utils/helpers";

type BlockOnSaveProps = {
    notify: (
        message: string,
        type?:
            | NotificationType
            | (NotificationOptions & { type: NotificationType })
    ) => void;
    redirect: (action: string, url: string) => void;
    mutate: (data: any, options?: any) => void | Promise<any>;
    values: any;
};

export const blockOnSave = async ({
    notify,
    redirect,
    mutate,
    values,
}: BlockOnSaveProps) => {
    if (!values[`b_config-${values.b_type}`])
        return notify(
            `${capitalizeFirstLetterOfEachWord(values.b_type)} is required!`,
            { type: "warning" }
        );

    const {
        width,
        height,
        isCloneActionFrom,
        b_id,
        b_start_date,
        b_end_date,
        b_view_detail_link,
        b_link_parameter,
        ...restValues
    } = values;

    let data;

    switch (restValues.b_type) {
        case "actions":
        case "image":
        case "carousel":
        case "banner":
        case "video":
            const linkParameterObj = (linkParameterData) => ({
                link_parameter: convertArrayOfObjectToObject(linkParameterData),
            });

            data = {
                ...restValues,
                b_config:
                    restValues.b_type === "video"
                        ? restValues[`b_config-${restValues.b_type}`].map(
                              (item) => ({
                                  ...item,
                                  ...linkParameterObj(item.link_parameter),
                              })
                          )
                        : await convertAttachmentsToBase64(
                              ["file", "file_banner"],
                              restValues[`b_config-${restValues.b_type}`].map(
                                  (item) => ({
                                      ...item,
                                      ...linkParameterObj(item.link_parameter),
                                      width,
                                      height,
                                  })
                              )
                          ),
            };
            break;
        case "function":
            data = {
                ...restValues,
                b_config: {
                    function:
                        restValues[`b_config-${restValues.b_type}`].function,
                    params: restValues.b_config.params,
                },
            };
            break;
        case "sql":
        case "html":
            data = {
                ...restValues,
                b_config: restValues.b_config,
            };
            break;
        default:
            data = {
                ...restValues,
                b_config: restValues[`b_config-${restValues.b_type}`],
            };
    }

    for (const key in data) {
        if (key.startsWith("b_config-")) {
            delete data[key];
        }
    }

    try {
        const payload = {
            ...(restValues.id && !isCloneActionFrom
                ? { id: restValues.id }
                : {}),
            data: {
                ...data,
                b_start_date: b_start_date || "0000-00-00 00:00:00",
                b_end_date: b_end_date || "0000-00-00 00:00:00",
                b_view_detail_link:
                    b_view_detail_link?.value || b_view_detail_link,
                b_link_parameter:
                    convertArrayOfObjectToObject(b_link_parameter),
            },
        };

        const { message } = await mutate(
            {
                type: restValues.id && !isCloneActionFrom ? "update" : "create",
                resource: "v1/block",
                payload,
            },
            { returnPromise: true }
        );
        notify(message, {
            type: "success",
        });
        redirect("list", "/v1/block");
    } catch (err: any) {
        logger(err);
        notify(err?.message || "Something went wrong, Please try again!", {
            type: "error",
        });
    }
};

const convertArrayOfObjectToObject = (data) => {
    if (!isArray(data)) return {};

    return data?.reduce((acc, current) => {
        if (current?.key) {
            acc[current.key] = current.value;
        }
        return acc;
    }, {});
};
