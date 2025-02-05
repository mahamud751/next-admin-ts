import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
  BooleanField,
  Button,
  Confirm,
  FunctionField,
  Link,
  Pagination,
  RaRecord as Record,
  ReferenceField,
  ReferenceManyField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
  usePermissions,
  useShowController,
} from "react-admin";

import ShipmentDetailsDatagrid from "@/components/manageDelivery/bags/ShipmentDetailsDatagrid";
import { useDocumentTitle, useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const BagShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Bag Show");
  const { permissions } = usePermissions();
  const classes = useAroggaStyles();
  const { record } = useShowController(rest);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // State to track current page and perPage
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100); // Default perPage value

  const { isLoading, refetch } = useRequest(
    `/employeeApp/v1/shipmentAction/${rest.id}/bagReceiveAction`,
    {
      method: "POST",
    },
    {
      isBaseUrl: true,
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );

  // Get the IDs for the current page based on perPage
  const paginatedIds = record?.sbd
    ?.map((item) => item.sbd_shipment_id)
    .slice((page - 1) * perPage, page * perPage); // Slice ids based on the current page

  // Get total count of items (for pagination and display)
  const totalItems = record?.sbd?.length || 0;

  useEffect(() => {
    // Reset page to 1 when perPage changes
    setPage(1);
  }, [perPage]);

  return (
    <>
      <Show {...rest}>
        <SimpleShowLayout>
          <ColumnShowLayout md={4} simpleShowLayout={false}>
            <TextField source="sb_id" label="ID" />
            <FunctionField
              label="Warehouse"
              render={({ sb_warehouse_id, sb_warehouse_name }: Record) => (
                <Link to={`warehouse/${sb_warehouse_id}/show`}>
                  {sb_warehouse_name}
                </Link>
              )}
            />
            <ReferenceField
              source="sb_zone_id"
              label="Zone"
              reference="v1/zone"
              link={false}
            >
              <TextField source="z_name" />
            </ReferenceField>
            <TextField
              source="sb_status"
              label="Status"
              className={classes.capitalize}
            />
            <TextField
              source="sb_shift_type"
              label="Shift Type"
              className={classes.capitalize}
            />
            <ReferenceField
              source="sb_shift_schedule_id"
              label="Shift Schedule"
              reference="v1/shiftSchedule"
              link="show"
            >
              <FunctionField
                render={({ s_title, ss_date }: Record) =>
                  `${s_title} (${ss_date})`
                }
              />
            </ReferenceField>
            <TextField source="sb_total_shipments" label="Total Shipment" />
            <TextField
              source="sb_shipment_cancel_count"
              label="Shipment Cancel Count"
            />
            <TextField
              source="sb_shipment_reschedule_count"
              label="Shipment Reschedule Count"
            />
            <FunctionField
              label="Assign"
              render={({ sb_deliveryman_id, sb_deliveryman_name }: Record) => (
                <Link to={`/v1/users/${sb_deliveryman_id}/show`}>
                  {sb_deliveryman_name}
                </Link>
              )}
            />
            <BooleanField source="sb_received" label="Received?" looseValue />
            <AroggaDateField source="sb_received_at" label="Received At" />
            <AroggaDateField source="sb_created_at" label="Created At" />
            <ReferenceField
              source="sb_created_by"
              label="Created By"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
            <AroggaDateField source="sb_modified_at" label="Modified At" />
            <ReferenceField
              source="sb_modified_by"
              label="Modified By"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
          </ColumnShowLayout>
          {!!record?.sbd?.length && (
            <ReferenceManyField
              key={`${page}-${perPage}`} // Force re-render when page or perPage changes
              source="sbd"
              label="Bag Details"
              reference="v1/shipment"
              target="ids"
              filter={{
                ids: paginatedIds.join(","), // Send only the IDs for the current page to the backend
              }}
              perPage={perPage} // Control items per page
              page={page} // Set current page
              sort={{ field: "s_id", order: "DESC" }}
              pagination={
                <Pagination
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  //@ts-ignore
                  page={page}
                  perPage={perPage}
                  total={totalItems} // Set the total number of items for pagination
                  setPage={setPage} // Update page state
                  setPerPage={(newPerPage: any) => {
                    setPerPage(newPerPage); // Update perPage state
                  }}
                />
              }
            >
              <ShipmentDetailsDatagrid page={page} perPage={perPage} />
            </ReferenceManyField>
          )}
          <FunctionField
            // addLabel={false}
            render={({ sb_received }: Record) => (
              <Box display="flex" gap={5}>
                {permissions?.includes("assignOthersBag") && !sb_received && (
                  <Button
                    label="Bag Receive"
                    variant="contained"
                    onClick={() => setIsDialogOpen(true)}
                  />
                )}
              </Box>
            )}
          />
        </SimpleShowLayout>
      </Show>
      <Confirm
        title={`Bag #${rest.id}`}
        content={`Are you sure you want to receive this bag?`}
        isOpen={isDialogOpen}
        loading={isLoading}
        onConfirm={refetch}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default BagShow;
