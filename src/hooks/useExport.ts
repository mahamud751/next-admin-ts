import { ListProps, usePermissions } from "react-admin";

const useExport = (props: ListProps) => {
    const { permissions } = usePermissions();

    let exporter = props.exporter;

    if (!permissions?.includes("export")) {
        exporter = false;
    }

    return exporter;
};

export default useExport;
