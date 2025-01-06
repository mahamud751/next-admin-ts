import { isJSONParsable } from "../utils/helpers";

const useGetCurrentUser = () => {
    const currentUser = isJSONParsable(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user"))
        : {};

    return currentUser;
};

export default useGetCurrentUser;
