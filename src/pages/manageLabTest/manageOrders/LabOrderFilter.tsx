import { FC, useState } from "react";
import {
    AutocompleteInput,
    DateInput,
    Filter,
    FilterProps,
    ReferenceInput,
    SelectInput,
    TextInput,
} from "react-admin";

const LabOrderFilter: FC<FilterProps> = (props) => {
    const [filterStatus, setFilterStatus] = useState("all");
    const [orderStatus, setOrderStatus] = useState("pending");
    const [searchKey, setSearchKey] = useState("all");
    const handleFilterStatusChange = (event) => {
        setFilterStatus(event.target.value);
        setOrderStatus("pending");
        setSearchKey("all");
    };
    const handleOrderStatusChange = (event) => {
        setOrderStatus(event.target.value);
        setFilterStatus("all");
        setSearchKey("all");
    };
    const handleOrderSearchKeyChange = (event) => {
        setSearchKey(event.target.value);
        setFilterStatus("all");
        setOrderStatus("pending");
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
                    {
                        id: "patientTrackingNumber",
                        name: "Patient Tracking Number",
                    },
                    {
                        id: "vendorReferenceNumber",
                        name: "Vendor Reference Number",
                    },
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
                label="Filter Status"
                source="filterStatus"
                choices={[
                    { id: "all", name: "All" },
                    { id: "pending", name: "Pending" },
                    { id: "active", name: "Active" },
                    { id: "completed", name: "Completed" },
                    { id: "cancelled", name: "Cancelled" },
                    { id: "today", name: "Today" },
                    { id: "upcoming", name: "Upcoming" },
                    { id: "report_pending", name: "Report Pending" },
                    { id: "report_unpublished", name: "Report Unpublished" },
                ]}
                onChange={handleFilterStatusChange}
                value={filterStatus}
                alwaysOn
            />
            <SelectInput
                variant="outlined"
                label="Order Status"
                source="orderStatus"
                choices={[
                    { id: "pending", name: "Pending" },
                    { id: "confirmed", name: "Confirmed" },
                    { id: "scheduled", name: "Scheduled" },
                    { id: "rescheduled", name: "Rescheduled" },
                    { id: "collected", name: "Collected" },
                    { id: "processing", name: "Processing" },
                    { id: "tested", name: "Tested" },
                    { id: "completed", name: "Completed" },
                    { id: "cancelled", name: "Cancelled" },
                ]}
                onChange={handleOrderStatusChange}
                value={orderStatus}
                alwaysOn
            />
            {/* <DateInput
                source="orderedAt"
                label="Ordered At"
                variant="outlined"
                resettable
                alwaysOn
            /> */}
            <DateInput
                source="fromDate"
                label="Date"
                variant="outlined"
                resettable
                alwaysOn
            />
            <DateInput
                source="toDate"
                label="Date Range"
                variant="outlined"
                resettable
                alwaysOn
            />
            {/* <TextInput
                source="orderNumberPrefix"
                label="Order ID Last 4 Digit"
                variant="outlined"
                resettable
                alwaysOn
            /> */}
            <SelectInput
                variant="outlined"
                label="Payment Status"
                source="paymentStatus"
                choices={[
                    { id: "paid", name: "Paid" },
                    { id: "unpaid", name: "Unpaid" },
                ]}
                alwaysOn
            />
            <SelectInput
                variant="outlined"
                label="Payment Method"
                source="paymentMethod"
                choices={[
                    { id: "cod", name: "COD" },
                    { id: "online", name: "Online" },
                ]}
                alwaysOn
            />
            <ReferenceInput
                source="collectorUqid"
                label="Assigned Collector"
                variant="outlined"
                reference="lab-order/api/v1/admin/collectors"
                alwaysOn
            >
                <AutocompleteInput
                    optionText="name"
                    options={{
                        InputProps: {
                            multiline: true,
                        },
                    }}
                    resettable
                />
            </ReferenceInput>
        </Filter>
    );
};

export default LabOrderFilter;
