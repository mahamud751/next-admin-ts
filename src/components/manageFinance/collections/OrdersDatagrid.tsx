import AcUnitIcon from "@mui/icons-material/AcUnit";
import {
  Datagrid,
  FunctionField,
  RaRecord as Record,
  TextField,
} from "react-admin";

const OrdersDatagrid = () => (
  <Datagrid>
    <TextField source="po_id" label="Order ID" />
    <TextField source="po_created_at" label="Order Created" />
    <TextField source="po_payable_total" label="Total" />
    <FunctionField
      label="Status"
      render={({ po_status }: Record) => {
        let color;

        if (po_status === "processing") color = "#EF1962";
        else if (po_status === "confirmed") color = "blue";
        else if (po_status === "delivered") color = "green";
        else color = "";

        return (
          <span
            style={{
              color,
            }}
          >
            {po_status}
          </span>
        );
      }}
    />
    <TextField source="po_payment_status" label="Payment Status" />
    <TextField source="po_is_status" label="Issue status" />
    <FunctionField
      label="Is Cold"
      sortBy="m_cold"
      render={(record: Record) => {
        if (!record.po_is_cold) return;
        return <AcUnitIcon />;
      }}
    />
    <TextField source="po_delivery_option" label="Delivery Option" />
    <TextField source="po_address" label="Address" />
    <TextField source="po_internal_notes" label="Internal Notes" />
  </Datagrid>
);

export default OrdersDatagrid;
