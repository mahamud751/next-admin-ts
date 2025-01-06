import { useEffect } from "react";

const useClearResourcePaginationTrack = () => {
    useEffect(() => {
        localStorage.removeItem("resourcePaginationTrack");
        return () => localStorage.removeItem("resourcePaginationTrack");
    }, []);
};

export default useClearResourcePaginationTrack;
