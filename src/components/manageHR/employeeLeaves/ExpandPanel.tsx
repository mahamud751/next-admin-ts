import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { isEqual } from "lodash";
import { FC, useEffect, useState } from "react";
import {
  ArrayInput,
  Confirm,
  DateInput,
  FormDataConsumer,
  RaRecord as Record,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from "react-admin";
import { FormSpy } from "react-final-form";

import { useRequest } from "../../../hooks";

type ExpandPanelProps = {
  record?: Record;
  setLeaveDetailChangesInfo: (leaveDetailChangesInfo: object) => void;
};

const ExpandPanel: FC<ExpandPanelProps> = ({
  record,
  setLeaveDetailChangesInfo,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>([]);

  const { data: employeeShifts } = useRequest(
    `/v1/employeeShift?_e_id=${record?.el_employee_id}`,
    {},
    {
      isPreFetching: true,
    }
  );
  const { data: employeeLeaveDetails } = useRequest(
    `/v1/employee/employeeLeaveDetails/${record?.el_id}`,
    {},
    {
      isPreFetching: true,
    }
  );

  const shiftIds = employeeShifts?.map((item) => item.es_shift_id);

  const { data: shifts, refetch: refetchShifts } = useRequest(
    `/v1/shift?ids=${shiftIds}`
  );

  useEffect(() => {
    shiftIds?.length && refetchShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftIds?.length]);

  const leaves = formValues.leave_details?.map((item) => ({
    eld_date: item?.eld_date,
    eld_shift_id: item?.eld_shift_id,
  }));

  const { isLoading, refetch } = useRequest(
    `/v1/employeeLeave/${formValues.id}`,
    {
      method: "POST",
      body: { leaves },
    },
    {
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );

  useEffect(() => {
    if (formValues?.el_id) {
      setLeaveDetailChangesInfo((prevState) => ({
        ...prevState,
        [formValues.el_id]: !isEqual(
          record.leave_details,
          formValues.leave_details?.map((item) => ({
            eld_date: item?.eld_date,
            eld_id: item?.eld_id,
            eld_shift_id: item?.eld_shift_id,
          }))
        ),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.leave_details]);

  const isLeaveDetailsLength = !!formValues.leave_details?.length;

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
      }}
    >
      <Grid container spacing={2}>
        <Grid item sm={12} md={6}>
          <SimpleForm toolbar={false}>
            <ArrayInput
              source="leave_details"
              label={isLeaveDetailsLength ? "Leave Details" : ""}
              style={{
                marginTop: isLeaveDetailsLength ? 5 : 0,
              }}
            >
              <>
                <SimpleFormIterator
                  // @ts-ignore
                  TransitionProps={{
                    classNames: "fade-exit",
                  }}
                  addButton={
                    <Box mt={isLeaveDetailsLength ? 0 : -2} ml={3}>
                      <Button
                        variant="outlined"
                        style={{
                          backgroundColor: "#027bff",
                          color: "white",
                        }}
                      >
                        {isLeaveDetailsLength ? "Add" : "Add Leave Date"}
                      </Button>
                    </Box>
                  }
                  removeButton={
                    <Box mt={1} ml={1} style={{ cursor: "pointer" }}>
                      <HighlightOffIcon />
                    </Box>
                  }
                  disableAdd={formValues.el_status !== "pending"}
                  disableRemove={formValues.el_status !== "pending"}
                  disableReordering
                >
                  <FormDataConsumer>
                    {({ scopedFormData }) => (
                      <Box display="flex" gap={10}>
                        <DateInput
                          source={"eld_date"}
                          label="Date"
                          variant="outlined"
                          disabled={formValues.el_status !== "pending"}
                        />
                        <TextInput
                          source={"s_shift_type"}
                          label="Shift Type"
                          variant="outlined"
                          defaultValue={shifts?.[0]?.s_shift_type}
                          disabled
                        />
                        <SelectInput
                          source={"eld_shift_id"}
                          label="Shifts"
                          variant="outlined"
                          choices={!!shifts?.length ? shifts : []}
                          optionText="s_title"
                          optionValue="s_id"
                          disabled={formValues.el_status !== "pending"}
                        />
                      </Box>
                    )}
                  </FormDataConsumer>
                </SimpleFormIterator>
                {formValues.el_status === "pending" &&
                  !!formValues.leave_details?.length && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: isLeaveDetailsLength ? 95 : 185,
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={25} thickness={2} />
                      ) : (
                        <Button
                          variant="outlined"
                          style={{
                            backgroundColor: "#008069",
                            color: "white",
                          }}
                          onClick={() => setIsDialogOpen(true)}
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  )}
              </>
            </ArrayInput>
            <FormSpy
              subscription={{ values: true }}
              onChange={({ values }) =>
                // Fix bad setState() call inside `FormSpy` error using setTimeout
                setTimeout(() => {
                  setFormValues(values);
                }, 0)
              }
            />
            <Confirm
              isOpen={isDialogOpen}
              loading={isLoading}
              title="Are you sure you want to update leave?"
              content={false}
              onConfirm={refetch}
              onClose={() => setIsDialogOpen(false)}
            />
          </SimpleForm>
        </Grid>
        <Grid item sm={12} md={6}>
          <Grid container>
            <TableContainer>
              {!!(
                employeeLeaveDetails?.r_sick_leaves ||
                employeeLeaveDetails?.r_casual_leaves ||
                employeeLeaveDetails?.r_annual_leaves ||
                employeeLeaveDetails?.r_compensatory_leaves ||
                employeeLeaveDetails?.r_maternity_leaves ||
                employeeLeaveDetails?.r_weekend_leaves
              ) && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Payable Leave</TableCell>
                      <TableCell>Spent Leave</TableCell>
                      <TableCell>Available Leave</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!!employeeLeaveDetails?.e_dynamic_leave_mode && (
                      <>
                        {!!employeeLeaveDetails?.r_sick_leaves && (
                          <TableRow>
                            <TableCell>
                              Sick: {employeeLeaveDetails?.r_sick_leaves}
                            </TableCell>
                            <TableCell>
                              Sick: {employeeLeaveDetails?.e_sick_leaves}
                            </TableCell>
                            <TableCell>
                              {" "}
                              Sick:{" "}
                              {employeeLeaveDetails?.r_sick_leaves -
                                employeeLeaveDetails?.e_sick_leaves}
                            </TableCell>
                          </TableRow>
                        )}
                        {!!employeeLeaveDetails?.r_casual_leaves && (
                          <TableRow>
                            <TableCell>
                              Casual: {employeeLeaveDetails?.r_casual_leaves}
                            </TableCell>
                            <TableCell>
                              Casual: {employeeLeaveDetails?.e_casual_leaves}
                            </TableCell>
                            <TableCell>
                              Casual:{" "}
                              {employeeLeaveDetails?.r_casual_leaves -
                                employeeLeaveDetails?.e_casual_leaves}
                            </TableCell>
                          </TableRow>
                        )}
                        {!!employeeLeaveDetails?.r_annual_leaves && (
                          <TableRow>
                            <TableCell>
                              Annual: {employeeLeaveDetails?.r_annual_leaves}
                            </TableCell>
                            <TableCell>
                              Annual: {employeeLeaveDetails?.e_annual_leaves}
                            </TableCell>
                            <TableCell>
                              Annual:{" "}
                              {employeeLeaveDetails?.r_annual_leaves -
                                employeeLeaveDetails?.e_annual_leaves}
                            </TableCell>
                          </TableRow>
                        )}
                        {!!employeeLeaveDetails?.r_compensatory_leaves && (
                          <TableRow>
                            <TableCell>
                              Compensatory:{" "}
                              {employeeLeaveDetails?.r_compensatory_leaves}
                            </TableCell>
                            <TableCell>
                              Compensatory:{" "}
                              {employeeLeaveDetails?.e_compensatory_leaves}
                            </TableCell>
                            <TableCell>
                              Compensatory:{" "}
                              {employeeLeaveDetails?.r_compensatory_leaves -
                                employeeLeaveDetails?.e_compensatory_leaves}
                            </TableCell>
                          </TableRow>
                        )}
                        {!!employeeLeaveDetails?.r_maternity_leaves && (
                          <TableRow>
                            <TableCell>
                              Maternity:{" "}
                              {employeeLeaveDetails?.r_maternity_leaves}
                            </TableCell>
                            <TableCell>
                              Maternity:{" "}
                              {employeeLeaveDetails?.e_maternity_leaves}
                            </TableCell>
                            <TableCell>
                              Maternity:{" "}
                              {employeeLeaveDetails?.r_maternity_leaves -
                                employeeLeaveDetails?.e_maternity_leaves}
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                    {!!employeeLeaveDetails?.e_dynamic_leave_mode && (
                      <>
                        {!!employeeLeaveDetails?.r_weekend_leaves && (
                          <TableRow>
                            <TableCell>
                              Weekend: {employeeLeaveDetails?.r_weekend_leaves}
                            </TableCell>
                            <TableCell>
                              Weekend: {employeeLeaveDetails?.e_weekend_leaves}
                            </TableCell>
                            <TableCell>
                              Weekend:{" "}
                              {employeeLeaveDetails?.r_weekend_leaves -
                                employeeLeaveDetails?.e_weekend_leaves}
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpandPanel;
