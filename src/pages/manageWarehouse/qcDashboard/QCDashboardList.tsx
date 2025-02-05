import { Divider, Tab, Tabs } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { FC, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Confirm,
  Datagrid,
  FunctionField,
  Link,
  List,
  ListContextProvider,
  ListProps,
  Pagination,
  RaRecord as Record,
  ReferenceField,
  ReferenceManyField,
  SimpleForm,
  TextField,
  useListContext,
} from "react-admin";

import { useDocumentTitle, useExport, useRequest } from "@/hooks";
import { toFilterObj } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import QCDashboardFilter from "./QCDashboardFilter";
import ShipmentDatagrid from "./ShipmentDatagrid";
import AroggaDateField from "@/components/common/AroggaDateField";

const QCDashboardList: FC<ListProps> = (props) => {
  useDocumentTitle("Arogga | QC Logistics");

  const exporter = useExport(props);

  const location = useLocation();
  const filterObj = toFilterObj(location.search);

  return (
    <List
      {...props}
      title="QC Logistics"
      filters={
        filterObj?._before_in_bag ? <QCDashboardFilter children={""} /> : null
      }
      filterDefaultValues={{ _before_in_bag: 0 }}
      resource={
        filterObj?._before_in_bag === 2 ? "v1/qcDashboard3pl" : undefined
      }
      sort={{ field: "id", order: "DESC" }}
      perPage={25}
      exporter={exporter}
    >
      <TabbedDatagrid bulkActionButtons={false} />
    </List>
  );
};

export default QCDashboardList;

const TabbedDatagrid = (props) => {
  const classes = useAroggaStyles();
  const listContext = useListContext();
  const { filterValues, setFilters, displayedFilters } = listContext;

  const [isCloseBagDialogOpen, setIsCloseBagDialogOpen] = useState(false);
  const [bagId, setBagId] = useState(null);

  const { isLoading, refetch } = useRequest(
    `/v1/qcBagClose/${bagId}`,
    {
      method: "POST",
    },
    {
      isRefresh: true,
      successNotify: "Successfully bag closed!",
      onSuccess: () => setIsCloseBagDialogOpen(false),
    }
  );

  const tabs = [
    { id: 0, name: "Bags" },
    { id: 1, name: "Shipments" },
    { id: 2, name: "3PL" },
  ];

  const handleOnChange = useCallback(
    (_, value) => {
      setFilters && setFilters({ _before_in_bag: value }, displayedFilters);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedFilters, filterValues, setFilters]
  );

  return (
    <>
      <Tabs
        value={filterValues._before_in_bag}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleOnChange}
        centered
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} label={tab.name} value={tab.id} />
        ))}
      </Tabs>
      <Divider />
      <ListContextProvider value={listContext}>
        {!filterValues._before_in_bag && (
          <Datagrid
            {...props}
            expand={
              <SimpleForm toolbar={null}>
                <ReferenceManyField
                  label=""
                  reference="v1/qcBagDashboardDetails"
                  target="sb_id"
                  perPage={100}
                  pagination={
                    <Pagination rowsPerPageOptions={[5, 10, 25, 100]} />
                  }
                >
                  <ShipmentDatagrid beforeInBag={filterValues._before_in_bag} />
                </ReferenceManyField>
              </SimpleForm>
            }
            classes={{ expandedPanel: classes.expandedPanel }}
          >
            <FunctionField
              label="Bag ID"
              onClick={(e) => e.stopPropagation()}
              sortBy="sb_id"
              render={({ sb_id }: Record) => (
                <Link to={`/v1/shipmentBag/${sb_id}/show`}>{sb_id}</Link>
              )}
            />
            <FunctionField
              label="Cold"
              sortBy="sb_is_cold"
              render={(record: Record) => {
                if (!record.sb_is_cold) return;
                return <AcUnitIcon />;
              }}
            />
            <ReferenceField
              source="sb_zone_id"
              label="Zone"
              reference="v1/zone"
              link="show"
            >
              <TextField source="z_name" />
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
            <ReferenceField
              source="sb_deliveryman_id"
              label="Deliveryman"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
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
              className={classes.whitespaceNowrap}
            >
              <FunctionField
                render={({ s_title, ss_date }: Record) =>
                  `${s_title} (${ss_date})`
                }
              />
            </ReferenceField>
            <AroggaDateField source="sb_submitted_at" label="Submitted At" />
            <TextField source="sb_note" label="Note" />
            <FunctionField
              label="Action"
              render={({ sb_id }: Record) => (
                <Button
                  label="Close Bag"
                  variant="contained"
                  className={classes.whitespaceNowrap}
                  onClick={() => {
                    setBagId(sb_id);
                    setIsCloseBagDialogOpen(true);
                  }}
                />
              )}
            />
          </Datagrid>
        )}
        {!!filterValues._before_in_bag && (
          <SimpleForm toolbar={null}>
            <ShipmentDatagrid
              beforeInBag={filterValues._before_in_bag}
              {...props}
            />
          </SimpleForm>
        )}
      </ListContextProvider>
      <Confirm
        title={`Close Bag #${bagId}`}
        content="Are you sure you want to close this bag?"
        isOpen={isCloseBagDialogOpen}
        loading={isLoading}
        onConfirm={refetch}
        onClose={() => setIsCloseBagDialogOpen(false)}
      />
    </>
  );
};
