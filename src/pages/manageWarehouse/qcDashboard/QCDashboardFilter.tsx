import { FC } from "react";
import { Filter, FilterProps, TextInput } from "react-admin";

const QCDashboardFilter: FC<FilterProps> = (props) => (
    <Filter {...props}>
        <TextInput
            source="_order_id"
            label="Order ID"
            variant="outlined"
            resettable
            alwaysOn
        />
    </Filter>
);

export default QCDashboardFilter;
