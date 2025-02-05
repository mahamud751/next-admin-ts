import { Box, Divider, Tab, Tabs } from "@mui/material";
import { DateTime } from "luxon";
import { FC, useCallback, useState } from "react";
import {
  Button,
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
  TextField,
  useListContext,
} from "react-admin";

import { useDocumentTitle, useExport, useRequest } from "@/hooks";
import { getQuantityLabel } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AuditSystemCreateDatagrid from "./AuditSystemCreateDatagrid";
import AuditSystemExpand from "./AuditSystemExpand";
import AuditSystemFilter from "./AuditSystemFilter";

const AuditSystemList: FC<ListProps> = (props) => {
  useDocumentTitle("Arogga | Audit System");

  const exporter = useExport(props);

  const [tabValue, setTabValue] = useState("unattended");

  return (
    <List
      {...props}
      title="List of Audit System"
      // @ts-ignore
      filters={<AuditSystemFilter children={""} tabValue={tabValue} />}
      filterDefaultValues={{ _status: "unattended" }}
      perPage={25}
      pagination={tabValue === "createAudit" ? null : <Pagination />}
      sort={{ field: "id", order: "DESC" }}
      exporter={exporter}
    >
      <TabbedDatagrid
        tabValue={tabValue}
        setTabValue={setTabValue}
        bulkActionButtons={false}
      />
    </List>
  );
};

export default AuditSystemList;

const TabbedDatagrid = ({ tabValue, setTabValue, ...rest }) => {
  const classes = useAroggaStyles();
  const listContext = useListContext();
  const { filterValues, setFilters, displayedFilters } = listContext;

  const [selectedVariantIds, setSelectedVariantIds] = useState([]);

  const { refetch: handleMoveToLiveAudit } = useRequest(
    "/v1/stockAudit",
    {
      method: "POST",
      body: {
        ids: selectedVariantIds,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => {
        setTabValue("unattended");
        setFilters({ _status: "unattended" }, displayedFilters);
      },
    }
  );

  const tabs = [
    { id: "unattended", name: "Live" },
    { id: "pending", name: "Problems" },
    { id: "approved", name: "History" },
    { id: "createAudit", name: "Create Audit" },
  ];

  const handleOnChange = useCallback(
    (_, value) => {
      setTabValue(value);
      setFilters &&
        value !== "createAudit" &&
        setFilters({ _status: value }, displayedFilters);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedFilters, filterValues, setFilters]
  );

  return (
    <>
      {!!selectedVariantIds?.length && (
        <Box display="flex" justifyContent="flex-end" mt={2} mr={2}>
          <Button
            label="Move to Live Audit"
            variant="contained"
            onClick={handleMoveToLiveAudit}
          />
        </Box>
      )}
      <Tabs
        value={tabValue}
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
      {tabValue === "createAudit" ? (
        <ReferenceManyField
          reference="v1/productVariant"
          target="ids"
          filter={{
            ...filterValues,
            _forAudit: 1,
            _status: "",
            // _search: 53053,
          }}
          pagination={<Pagination />}
        >
          <AuditSystemCreateDatagrid
            setSelectedVariantIds={setSelectedVariantIds}
          />
        </ReferenceManyField>
      ) : (
        <ListContextProvider value={listContext}>
          <Datagrid
            {...rest}
            expand={<AuditSystemExpand />}
            // classes={{ expandedPanel: classes.expandedPanel }}
          >
            <TextField source="sa_id" label="ID" />
            <FunctionField
              label="Product"
              onClick={(e) => e.stopPropagation()}
              sortBy="p_name"
              render={({ sa_product_id, p_name }: Record) => (
                <Link to={`/v1/product/${sa_product_id}/edit`}>{p_name}</Link>
              )}
            />
            {filterValues._status === "unattended" && (
              <TextField
                source="p_type"
                label="Category"
                className={classes.capitalize}
              />
            )}
            <TextField source="p_strength" label="Strength" />
            <TextField source="p_form" label="Form" />
            <TextField
              source="base_pu_label"
              label="Unit"
              className={classes.whitespaceNowrap}
            />
            <FunctionField
              source="sa_in_shelf"
              label="Shelf Qty"
              sortBy="sa_in_shelf"
              className={classes.whitespaceNowrap}
              render={({
                sa_in_shelf: qty,
                base_pu_label: baseUnit,
                b2c_pu_label: salesUnit,
                base_pu_multiplier: salesUnitMultiplier,
                b2c_pu_multiplier,
              }: Record) =>
                getQuantityLabel({
                  qty,
                  salesUnit,
                  baseUnit,
                  salesUnitMultiplier,
                  baseUnitMultiplier: qty / b2c_pu_multiplier,
                })
              }
            />
            {filterValues._status === "unattended" && (
              <TextField source="rack_ids" label="Rack Number" />
            )}
            {filterValues._status !== "unattended" && (
              <FunctionField
                source="sa_found"
                label="Found"
                sortBy="sa_found"
                className={classes.whitespaceNowrap}
                render={({
                  sa_found: qty,
                  base_pu_label: baseUnit,
                  b2c_pu_label: salesUnit,
                  base_pu_multiplier: salesUnitMultiplier,
                  b2c_pu_multiplier,
                }: Record) =>
                  getQuantityLabel({
                    qty,
                    salesUnit,
                    baseUnit,
                    salesUnitMultiplier,
                    baseUnitMultiplier: qty / b2c_pu_multiplier,
                  })
                }
              />
            )}
            {filterValues._status !== "unattended" && (
              <FunctionField
                source="sa_lost"
                label="Lost"
                sortBy="sa_lost"
                className={classes.whitespaceNowrap}
                render={({
                  sa_lost: qty,
                  base_pu_label: baseUnit,
                  b2c_pu_label: salesUnit,
                  base_pu_multiplier: salesUnitMultiplier,
                  b2c_pu_multiplier,
                }: Record) =>
                  getQuantityLabel({
                    qty,
                    salesUnit,
                    baseUnit,
                    salesUnitMultiplier,
                    baseUnitMultiplier: qty / b2c_pu_multiplier,
                  })
                }
              />
            )}
            {filterValues._status !== "unattended" && (
              <FunctionField
                source="sa_damaged"
                label="Damage"
                sortBy="sa_damaged"
                className={classes.whitespaceNowrap}
                render={({
                  sa_damaged: qty,
                  base_pu_label: baseUnit,
                  b2c_pu_label: salesUnit,
                  base_pu_multiplier: salesUnitMultiplier,
                  b2c_pu_multiplier,
                }: Record) =>
                  getQuantityLabel({
                    qty,
                    salesUnit,
                    baseUnit,
                    salesUnitMultiplier,
                    baseUnitMultiplier: qty / b2c_pu_multiplier,
                  })
                }
              />
            )}
            {filterValues._status !== "unattended" && (
              <FunctionField
                source="sa_expired"
                label="Expired"
                sortBy="sa_expired"
                render={({ sa_expired }: Record) => sa_expired || ""}
              />
            )}
            {filterValues._status !== "unattended" && (
              <FunctionField
                label="Problems"
                render={({
                  base_pu_label: baseUnit,
                  b2c_pu_label: salesUnit,
                  base_pu_multiplier: salesUnitMultiplier,
                  b2c_pu_multiplier,
                  sa_in_shelf = 0,
                  sa_found = 0,
                  sa_lost = 0,
                  sa_damaged = 0,
                  sa_expired = 0,
                }: Record) => {
                  const qty = Math.abs(
                    sa_in_shelf - (sa_found + sa_lost + sa_damaged + sa_expired)
                  );

                  return (
                    <span className={classes.whitespaceNowrap}>
                      {getQuantityLabel({
                        qty,
                        salesUnit,
                        baseUnit,
                        salesUnitMultiplier,
                        baseUnitMultiplier: qty / b2c_pu_multiplier,
                      })}
                    </span>
                  );
                }}
              />
            )}
            {filterValues._status === "pending" && (
              <TextField source="rack_ids" label="Rack Number" />
            )}
            {filterValues._status === "approved" && (
              <FunctionField
                label="Number of Edit"
                sortBy="s_audit_count"
                render={({ s_audit_count }: Record) => s_audit_count || ""}
              />
            )}
            {filterValues._status === "approved" && (
              <TextField source="rack_ids" label="Rack Number" />
            )}
            {filterValues._status === "approved" && (
              <FunctionField
                label="Closed Duration"
                sortBy="sa_created_at"
                render={({ sa_created_at, sa_approved_at }: Record) => {
                  const date = DateTime.fromSQL(sa_approved_at);

                  const diff = date
                    .diff(DateTime.fromSQL(sa_created_at), [
                      "days",
                      "hours",
                      "minutes",
                    ])
                    .toObject();

                  return (
                    <span
                      className={
                        diff.days >= 1
                          ? `${classes.textRed} ${classes.whitespaceNowrap}`
                          : classes.whitespaceNowrap
                      }
                    >
                      {!!diff.days && `${diff.days} Day `}
                      {!!diff.hours && `${diff.hours} hour `}
                      {!!Math.floor(diff.minutes) &&
                        `${Math.floor(diff.minutes)} min`}
                    </span>
                  );
                }}
              />
            )}
            {filterValues._status !== "approved" && (
              <FunctionField
                label="Duration"
                sortBy="sa_created_at"
                render={({ sa_created_at }: Record) => {
                  const date = DateTime.local();

                  const diff = date
                    .diff(DateTime.fromSQL(sa_created_at), [
                      "days",
                      "hours",
                      "minutes",
                    ])
                    .toObject();

                  return (
                    <span
                      className={
                        diff.days >= 1
                          ? `${classes.textRed} ${classes.whitespaceNowrap}`
                          : classes.whitespaceNowrap
                      }
                    >
                      {!!diff.days && `${diff.days} Day `}
                      {!!diff.hours && `${diff.hours} hour `}
                      {!!Math.floor(diff.minutes) &&
                        `${Math.floor(diff.minutes)} min`}
                    </span>
                  );
                }}
              />
            )}
            <ReferenceField
              source="sa_audited_by"
              label="Audited By"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
            <ReferenceField
              source="sa_approved_by"
              label="Verified By"
              reference="v1/users"
              link="show"
            >
              <TextField source="u_name" />
            </ReferenceField>
          </Datagrid>
        </ListContextProvider>
      )}
    </>
  );
};
