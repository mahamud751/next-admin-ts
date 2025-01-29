import { FC, useState } from "react";
import {
    DateInput,
    Filter,
    FilterProps,
    SelectInput,
    TextInput,
} from "react-admin";

const LabReportShipmentFilter: FC<FilterProps> = (props) => {
    const [searchKey, setSearchKey] = useState("all");

    const handleOrderSearchKeyChange = (event) => {
        setSearchKey(event.target.value);
    };
    return (
        <Filter {...props}>
            <SelectInput
                variant="outlined"
                label="Search Key"
                source="searchKey"
                choices={[
                    { id: "user_id", name: "User ID" },
                    { id: "name", name: "Name" },
                    { id: "mobileNumber", name: "Mobile Number" },
                    { id: "orderNumber", name: "Order Number" },
                ]}
                onChange={handleOrderSearchKeyChange}
                value={searchKey}
                style={{ marginTop: 30 }}
                alwaysOn
            />
            <TextInput
                source="search"
                label="Search"
                variant="outlined"
                resettable
                alwaysOn
            />

            <SelectInput
                variant="outlined"
                label="Shipment Status"
                source="shipmentStatus"
                choices={[
                    { id: "pending", name: "Pending" },
                    { id: "delivered", name: "Delivered" },
                    { id: "cancelled", name: "Cancelled" },
                ]}
                alwaysOn
            />
            <DateInput
                source="orderedAt"
                label="Ordered At"
                variant="outlined"
                resettable
                alwaysOn
            />
            <TextInput
                source="orderNumberPrefix"
                label="Order ID Last 4 Digit"
                variant="outlined"
                resettable
                alwaysOn
            />
        </Filter>
    );
};

export default LabReportShipmentFilter;
