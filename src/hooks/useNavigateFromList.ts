import { usePermissions } from "react-admin";

type NavigateFromList = (
    viewPerm: string,
    editPerm: string
) => "show" | "edit" | null;

const useNavigateFromList: NavigateFromList = (viewPerm, editPerm) => {
    const { permissions } = usePermissions();

    if (permissions?.includes(viewPerm) && !permissions?.includes(editPerm)) {
        return "show";
    } else if (permissions?.includes(editPerm)) {
        return "edit";
    }

    return null;
};

export default useNavigateFromList;
