import { Button, Checkbox, FormControlLabel, Grid } from "@mui/material";
import queryString from "query-string";
import { FC, useEffect, useState } from "react";
import {
  AutocompleteInput,
  DateInput,
  Edit,
  EditProps,
  Labeled,
  NumberInput,
  Pagination,
  ReferenceField,
  ReferenceInput,
  ReferenceManyField,
  SimpleForm,
  TextField,
  required,
  useEditController,
} from "react-admin";
import { FormSpy, useForm } from "react-final-form";

import BagDialog from "@/components/manageDelivery/bags/BagDialog";
import ShiftScheduleInput from "@/components/manageDelivery/bags/ShiftScheduleInput";
import ShiftTypeInput from "@/components/manageDelivery/bags/ShiftTypeInput";
import ShipmentDetailsDatagrid from "@/components/manageDelivery/bags/ShipmentDetailsDatagrid";
import ZoneInput from "@/components/manageDelivery/bags/ZoneInput";
import { useDocumentTitle, useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import BagEditToolbar from "./BagEditToolbar";
import Form from "@/components/common/Form";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

const BagEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Bag Edit");

  const classes = useAroggaStyles();
  const { record } = useEditController(rest);

  const [isChecked, setIsChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [toShiftScheduleTitle, setToShiftScheduleTitle] = useState("");
  const [toDeliveryman, setToDeliveryman] = useState("");
  // State to track current page and perPage
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100); // Default perPage value

  // Get the IDs for the current page based on perPage
  const paginatedIds = record?.sbd
    ?.map((item) => item.sbd_shipment_id)
    .slice((page - 1) * perPage, page * perPage); // Slice ids based on the current page

  // Get total count of items (for pagination and display)
  const totalItems = record?.sbd?.length || 0;

  const SHIPMENT_ZONE_QUERY_PARAMS = {
    _order: "ASC",
    _perPage: 500,
    // _type: record?.sb_shift_type,
  };

  const { data, isLoading, refetch } = useRequest(
    `/v1/zone?${queryString.stringify(SHIPMENT_ZONE_QUERY_PARAMS)}`
  );

  // const { data, isLoading, refetch } = useRequest(
  //     `/v1/shipmentZone?warehouse_id=${record?.sb_warehouse_id}&isExpress=${
  //         record?.sb_shift_type === "regular" ? 0 : 1
  //     }`
  // );

  useEffect(() => {
    if (record?.sb_warehouse_id && record?.sb_shift_type) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);

  const ShipmentDetails = (props) => {
    const form = useForm();

    useEffect(() => {
      form.change("selectedIds", props.selectedIds);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedIds]);

    return (
      <ShipmentDetailsDatagrid
        page={page}
        perPage={perPage}
        isChecked={isChecked}
      />
    );
  };

  useEffect(() => {
    // Reset page to 1 when perPage changes
    setPage(1);
  }, [perPage]);

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
      redirect="list"
    >
      <SimpleForm
        toolbar={
          <BagEditToolbar
            record={record}
            isChecked={isChecked}
            toShiftScheduleTitle={toShiftScheduleTitle}
            toDeliveryman={toDeliveryman}
          />
        }
      >
        <Grid container spacing={1} style={{ width: "100%" }}>
          <Grid item xs={1}>
            <Labeled label="Bag ID">
              <TextField source="sb_id" />
            </Labeled>
          </Grid>
          <Grid item xs={1}>
            <Labeled label="Warehouse">
              <ReferenceField source="sb_warehouse_id" reference="v1/warehouse">
                <TextField source="w_title" />
              </ReferenceField>
            </Labeled>
          </Grid>
          <Grid item xs={1}>
            <Labeled label="Zone">
              <ReferenceField
                source="sb_zone_id"
                reference="v1/zone"
                link="show"
              >
                <TextField source="z_name" />
              </ReferenceField>
            </Labeled>
          </Grid>
          <Grid item xs={1}>
            <Labeled label="Total Shipment">
              <TextField source="sb_total_shipments" />
            </Labeled>
          </Grid>
          <Grid item xs={1}>
            <Labeled label="Status">
              <TextField source="sb_status" className={classes.capitalize} />
            </Labeled>
          </Grid>
        </Grid>
        <FormControlLabel
          label="Move shipment to another bag"
          className={classes.wFull}
          control={
            <Checkbox
              checked={isChecked}
              onChange={() => setIsChecked((prevState) => !prevState)}
              color="primary"
            />
          }
        />
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
            <ShipmentDetails />
          </ReferenceManyField>
        )}
        {isChecked && (
          <Grid container spacing={1} style={{ width: "100%" }}>
            <Grid item xs={12} md={2}>
              <ZoneInput
                variant="outlined"
                choices={
                  !!data?.length
                    ? data.map((zone) => ({
                        id: zone.z_id,
                        name: zone.z_name,
                      }))
                    : []
                }
                validate={[required()]}
                loading={isLoading}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <NumberInput
                source="new_sb_id"
                label="Bag No"
                variant="outlined"
                helperText={false}
                fullWidth
              />
            </Grid>
            {!!formValues?.selectedIds?.length && !!formValues.new_sb_id && (
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsDialogOpen(true)}
                  style={{
                    marginTop: 10,
                  }}
                >
                  Move
                </Button>
              </Grid>
            )}
            {isDialogOpen && (
              <BagDialog
                record={record}
                isChecked={isChecked}
                isDialogOpen={isDialogOpen}
                handleDialogClose={() => setIsDialogOpen(false)}
              />
            )}
          </Grid>
        )}
        {!isChecked && (
          <Grid container spacing={1} style={{ width: "100%" }}>
            <Grid item xs={12} md={2}>
              <ShiftTypeInput variant="outlined" fullWidth />
            </Grid>
            {formValues?.sb_shift_type && (
              <Form>
                {({ form }) => (
                  <Grid item xs={12} md={2}>
                    <DateInput
                      source="filterByDate"
                      label="Filter by date"
                      variant="outlined"
                      helperText={false}
                      onChange={() => form.change("sb_shift_schedule_id", null)}
                      fullWidth
                    />
                  </Grid>
                )}
              </Form>
            )}
            {formValues?.sb_shift_type && (
              <Grid item xs={12} md={2}>
                <ShiftScheduleInput
                  variant="outlined"
                  onSelect={(item) => setToShiftScheduleTitle(item.s_title)}
                  fullWidth
                />
              </Grid>
            )}
            <Grid item xs={12} md={2}>
              <ReferenceInput
                source="sb_deliveryman_id"
                label="Delivery Man"
                variant="outlined"
                helperText={false}
                reference="v1/users/delivery-man"
                filter={{
                  shift_type: formValues?.isAllShiftType
                    ? "all"
                    : formValues?.shiftType,
                  ...(!formValues?.isAllShiftType && {
                    _shift_schedule_id: formValues?.sb_shift_schedule_id,
                    _zone_ids: record?.sb_zone_id,
                  }),
                }}
                onSelect={(item) => setToDeliveryman(item.u_name)}
                fullWidth
              >
                <AutocompleteInput
                  matchSuggestion={() => true}
                  optionText={(value) =>
                    !!value?.bag_assigned
                      ? `${value?.u_name} (Assigned)`
                      : value?.u_name
                  }
                  // options={{
                  //     InputProps: {
                  //         multiline: true,
                  //     },
                  // }}
                />
              </ReferenceInput>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormatedBooleanInput
                source="isAllShiftType"
                label="All"
                style={{ marginTop: 8 }}
              />
            </Grid>
          </Grid>
        )}
        <FormSpy
          subscription={{ values: true }}
          onChange={({ values }) =>
            // Fix bad setState() call inside `FormSpy` error using setTimeout
            setTimeout(() => {
              setFormValues(values);
            }, 0)
          }
        />
      </SimpleForm>
    </Edit>
  );
};

export default BagEdit;
