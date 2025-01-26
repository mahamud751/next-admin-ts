import { useSelector } from "react-redux";

const useGetStoreData = (resource: string) => {
  console.log("resource", resource);

  const data = useSelector(
    (state) =>
      // @ts-ignore
      state.admin.resources[resource].data
  );

  return data;
};

export default useGetStoreData;
