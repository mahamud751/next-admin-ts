import { FC } from "react";
import { Show, ShowProps, SimpleShowLayout, TextField } from "react-admin";

import AroggaDateField from "../../../components/AroggaDateField";
import { useDocumentTitle } from "../../../hooks";

const HolidayShow: FC<ShowProps> = (props) => {
    useDocumentTitle("Arogga | Holiday Show");

    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="h_id" label="ID" />
                <TextField source="h_type" label="Type" />
                <AroggaDateField source="h_date" label="Date" />
                <TextField source="h_title" label="Title" />
            </SimpleShowLayout>
        </Show>
    );
};

export default HolidayShow;
