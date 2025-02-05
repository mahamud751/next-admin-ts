// ShipmentEdit.tsx

import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    SelectInput,
    EditProps,
    ReferenceInput,
    AutocompleteInput,
} from "react-admin";

const ShipmentEdit: React.FC<EditProps> = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <NumberInput source="s_id" label="ID" disabled />
            <TextInput source="s_sequence" label="Sequence" />
            <NumberInput source="s_order_id" label="Order ID" />
            <SelectInput
                source="s_type"
                label="Type"
                choices={[
                    { id: "delivery", name: "Delivery" },
                    { id: "issue", name: "Issue" },
                    { id: "return", name: "Return" },
                ]}
            />
            <ReferenceInput
                source="s_zone_id"
                label="Zone ID"
                reference="v1/zone"
            >
                <AutocompleteInput
                    matchSuggestion={() => true}
                    optionText={(value) => (value && value?.z_name) || ""}
                />
            </ReferenceInput>
            <TextInput source="s_status" label="Status" />
            <NumberInput source="s_issue_id" label="Issue ID" />
            <SelectInput
                source="s_delivery_option"
                label="Delivery Option"
                choices={[
                    { id: "regular", name: "Regular" },
                    { id: "express", name: "Express" },
                ]}
            />
            <TextInput source="s_shift_schedule_id" label="Shift Schedule ID" />
            <TextInput source="s_internal_notes" label="Internal Notes" />
            <NumberInput source="s_user_location_id" label="User Location ID" />
            <NumberInput source="s_is_outside_dhaka" label="Is Outside Dhaka" />
            <NumberInput source="s_is_b2b" label="Is B2B" />
            <TextInput source="s_address" label="Address" />
            <NumberInput source="s_item_count" label="Item Count" />
            <NumberInput source="s_m_cold" label="Cold Count" />
            <NumberInput source="s_packed_wrong" label="Packed Wrong Count" />
            <TextInput source="s_packed_wrong_note" label="Packed Wrong Note" />
            <TextInput source="s_qc_status" label="QC Status" />
            <NumberInput source="s_scheduled_by" label="Scheduled By" />
            <NumberInput source="s_refund_qty" label="Refund Quantity" />
            <NumberInput source="s_damage_qty" label="Damage Quantity" />
            <NumberInput source="s_deposited_by" label="Deposited By" />
            <TextInput
                source="s_picker_assigned_at"
                label="Picker Assigned At"
            />
            <NumberInput
                source="s_picker_assigned_by"
                label="Picker Assigned By"
            />
            <TextInput
                source="s_packer_assigned_at"
                label="Packer Assigned At"
            />
            <NumberInput
                source="s_packer_assigned_by"
                label="Packer Assigned By"
            />
            <TextInput source="s_picked_at" label="Picked At" />
            <NumberInput source="s_picked_by" label="Picked By" />
            <TextInput source="s_packed_at" label="Packed At" />
            <NumberInput source="s_packed_by" label="Packed By" />
            <TextInput source="s_sorted_at" label="Sorted At" />
            <NumberInput source="s_sorted_by" label="Sorted By" />
            <TextInput source="s_called_at" label="Called At" />
            <NumberInput source="s_called_by" label="Called By" />
            <TextInput source="s_in_bag_at" label="In Bag At" />
            <NumberInput source="s_in_bag_by" label="In Bag By" />
            <TextInput source="s_delivering_at" label="Delivering At" />
            <NumberInput source="s_delivering_by" label="Delivering By" />
            <TextInput source="s_delivered_at" label="Delivered At" />
            <NumberInput source="s_delivered_by" label="Delivered By" />
            <TextInput source="s_closed_at" label="Closed At" />
            <NumberInput source="s_closed_by" label="Closed By" />
            <TextInput source="s_wrong_checked_at" label="Wrong Checked At" />
            <NumberInput source="s_wrong_checked_by" label="Wrong Checked By" />
            <TextInput source="s_created_at" label="Created At" />
            <NumberInput source="s_created_by" label="Created By" />
            <TextInput source="s_modified_at" label="Modified At" />
            <NumberInput source="s_modified_by" label="Modified By" />
            <TextInput
                source="s_cancel_requested_at"
                label="Cancel Requested At"
            />
            <NumberInput
                source="s_cancel_requested_by"
                label="Cancel Requested By"
            />
            <TextInput
                source="s_cancel_request_reason"
                label="Cancel Request Reason"
            />
            <TextInput
                source="s_cancel_requested_approval_status"
                label="Cancel Request Approval Status"
            />
            <TextInput source="s_re_scheduled_at" label="Re-scheduled At" />
            <NumberInput source="s_re_scheduled_by" label="Re-scheduled By" />
            <NumberInput
                source="s_re_scheduled_shift_schedule_id"
                label="Re-scheduled Shift Schedule ID"
            />
            <TextInput
                source="s_re_scheduled_reason"
                label="Re-scheduled Reason"
            />
            <TextInput
                source="s_re_schedule_approval_status"
                label="Re-schedule Approval Status"
            />
            <NumberInput source="s_is_cancelled" label="Is Cancelled" />
            <NumberInput source="s_is_reschedule" label="Is Reschedule" />
            <NumberInput source="s_reschedule_count" label="Reschedule Count" />
            <TextInput source="s_qc_at" label="QC At" />
            <NumberInput source="s_qc_by" label="QC By" />
            <NumberInput source="s_sorting_by" label="Sorting By" />
            <TextInput source="s_sorting_at" label="Sorting At" />
            <NumberInput source="s_is_parcel_needed" label="Is Parcel Needed" />
            <TextInput source="s_printed_at" label="Printed At" />
            <NumberInput source="s_printed_by" label="Printed By" />
        </SimpleForm>
    </Edit>
);

export default ShipmentEdit;
