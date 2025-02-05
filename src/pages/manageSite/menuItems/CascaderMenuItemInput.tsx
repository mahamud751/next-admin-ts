import queryString from "query-string";
import { CSSProperties, FC, useMemo, useState } from "react";
import { Labeled, TextInput } from "react-admin";
import { useForm, useFormState } from "react-final-form";
import Cascader from "rsuite/Cascader";
import "rsuite/dist/rsuite-no-reset.min.css";

import { useRequest } from "../../../hooks";
import { httpClient } from "../../../utils/http";

const API_ENDPOINT = "/v1/menuItem";
const QUERY_PARAMS = {
    _fields: "mi_id,mi_parent_mi_id,mi_name,mi_weight,mi_has_child,mi_status",
    _order: "ASC",
    _page: 1,
    _perPage: 50000,
};

type CascaderMenuItemInputProps = {
    source: string;
    label?: string;
    placeholder?: string;
    addLabel?: boolean;
    menuId: number;
    selectedMenuId: number;
    isLastLevelSelectable?: boolean;
    disabled?: boolean;
    style?: CSSProperties;
};

const CascaderMenuItemInput: FC<CascaderMenuItemInputProps> = ({
    source,
    label,
    placeholder,
    addLabel = true,
    menuId,
    selectedMenuId,
    isLastLevelSelectable = true,
    disabled = false,
    style,
}) => {
    const form = useForm();
    const { values } = useFormState();

    const stringified = queryString.stringify(QUERY_PARAMS);

    const [defaultValueString, setDefaultValueString] = useState("");

    const { isLoading, data } = useRequest(
        `${API_ENDPOINT}?${stringified}&${queryString.stringify({
            _menu_id: menuId,
            _parent_id: 0,
            _cat_id: 0,
            _status: 1,
            _orderBy: "mi_weight",
        })}`,
        {},
        {
            isPreFetching: !disabled,
            isWarningNotify: false,
        }
    );

    useRequest(
        `${API_ENDPOINT}?${stringified}&${queryString.stringify({
            _menu_id: menuId,
            _reverse_parent: selectedMenuId,
            _orderBy: "mi_parent_mi_id",
        })}`,
        {},
        {
            isPreFetching: !!selectedMenuId,
            isWarningNotify: false,
            ...(isLastLevelSelectable && { refreshDeps: [values?.[source]] }),
            onSuccess: ({ data }) => {
                setDefaultValueString(
                    data?.map((item) => item.mi_name)?.join(" > ")
                );
            },
        }
    );

    const tree = useMemo(() => buildTreeFromList(data), [data]);

    const setParentMenuId = (value) => form.change(source, value);

    const renderCascader = () => (
        <Cascader
            valueKey="mi_id"
            labelKey="mi_name"
            data={tree}
            placeholder={placeholder || defaultValueString}
            getChildren={(node) =>
                httpClient(
                    `${API_ENDPOINT}?${stringified}&_parent_id=${node.mi_id}&_status=1`
                ).then((res: any) => buildTreeFromList(res?.json?.data))
            }
            renderValue={(_, activePaths) =>
                activePaths.map((item) => item.mi_name).join(" > ")
            }
            onSelect={({ mi_id, mi_has_child }) => {
                if (isLastLevelSelectable && !mi_has_child) {
                    setParentMenuId(mi_id);
                }
                !isLastLevelSelectable && setParentMenuId(mi_id);
            }}
            onClean={() => {
                setDefaultValueString("");
                setParentMenuId(undefined);
            }}
            // @ts-ignore
            loading={isLoading}
            parentSelectable={!isLastLevelSelectable}
            size="lg"
            style={style}
            menuWidth={180}
            searchable={false}
            block
        />
    );

    const renderDisabledCascader = () => (
        <TextInput
            source="tempDisabledInput"
            label={label}
            variant="outlined"
            helperText={false}
            initialValue={defaultValueString}
            multiline
            disabled
            fullWidth
        />
    );

    if (disabled) return renderDisabledCascader();

    if (label && addLabel)
        return (
            <Labeled label={label} fullWidth>
                {renderCascader()}
            </Labeled>
        );

    return renderCascader();
};

export default CascaderMenuItemInput;

const buildTreeFromList = (list) => {
    if (!list?.length) return [];

    const map = new Map();
    const tree = [];

    const initializeItem = (item) => ({
        ...item,
        children: item.mi_has_child ? [] : null,
    });

    list.forEach((item) => {
        const initializedItem = initializeItem(item);
        map.set(item.mi_id, initializedItem);
    });

    list.forEach((item) => {
        const parent = map.get(item.mi_parent_mi_id);

        if (!parent) {
            tree.push(map.get(item.mi_id));
        } else {
            parent.children.push(map.get(item.mi_id));
        }
    });

    return tree;
};
