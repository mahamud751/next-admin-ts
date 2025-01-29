import { FC } from "react";
import { List, ListProps } from "react-admin";

import { useDocumentTitle, useExport } from "../../../hooks";
import PurchaseDatagrid from "./PurchaseDatagrid";
import PurchaseFilter from "./PurchaseFilter";

const PurchaseList: FC<ListProps> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Purchase List");

    const exporter = useExport(rest);

    return (
        <List
            {...rest}
            title="List of Purchase"
            filters={<PurchaseFilter children={""} />}
            perPage={25}
            sort={{ field: "pp_id", order: "DESC" }}
            exporter={exporter}
            bulkActionButtons={false}
        >
            <PurchaseDatagrid />
        </List>
    );
};

export default PurchaseList;
