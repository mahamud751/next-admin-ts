import queryString from "query-string";

import useRequest from "./useRequest";

type UseGetTaxonomiesByVocabularyProps = {
    fetchKey: string;
    filter?: any;
    isPreFetching?: boolean;
};

const useGetTaxonomiesByVocabulary = ({
    fetchKey,
    filter,
    isPreFetching = true,
}: UseGetTaxonomiesByVocabularyProps) => {
    const QUERY_PARAMS = {
        _v_machine_name: fetchKey,
        _fields: "t_id,t_parent_id,t_title,t_machine_name,t_has_child,t_weight",
        _order: "ASC",
        _orderBy: "t_weight",
        _page: 1,
        _perPage: 50000,
        ...filter,
    };

    const { data } = useRequest(
        `/v1/taxonomy?${queryString.stringify(QUERY_PARAMS)}`,
        {},
        {
            isPreFetching,
            isWarningNotify: false,
        }
    );

    return data;
};

export default useGetTaxonomiesByVocabulary;
