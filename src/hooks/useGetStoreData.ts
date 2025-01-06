import { useSelector } from "react-redux";

const useGetStoreData = (resource: string) => {
    const data = useSelector(
        (state) =>
            // @ts-ignore
            state.admin.resources[resource].data
    );

    return data;
};

export default useGetStoreData;
