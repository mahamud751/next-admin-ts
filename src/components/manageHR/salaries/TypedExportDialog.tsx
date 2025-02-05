import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { isEqual } from "lodash";
import { FC, useEffect, useState } from "react";
import {
  AutocompleteInput,
  Confirm,
  ReferenceInput,
  SelectInput,
  useRefresh,
} from "react-admin";
import { useWatch } from "react-hook-form";

import {
  useGetTaxonomiesByVocabulary,
  useRequest,
  useXLSXDownloader,
} from "@/hooks";
import { monthsWithId } from "@/utils/constants";
import {
  capitalizeFirstLetterOfEachWord,
  numberFormat,
  toFormattedDateTime,
} from "@/utils/helpers";
import YearSelectInput from "@/components/common/YearSelectInput";

type TypedExportDialogProps = {
  permissions;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen) => void;
};

const TypedExportDialog: FC<TypedExportDialogProps> = ({
  permissions,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const refresh = useRefresh();
  const { values } = useWatch();
  const { onExportToXLSX } = useXLSXDownloader();
  const [state, setState] = useState({});
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] =
    useState(false);

  const {
    bank_type,
    payment_accounting_head,
    s_month,
    s_year,
    s_payment_mode,
  } = values;

  const paymentModes = useGetTaxonomiesByVocabulary({
    fetchKey: "payment_mode",
  });

  const { data, isSuccess, refetch, reset } = useRequest(
    `/v1/employee/salaryExport`,
    {
      method: "POST",
      body: {
        bank_type,
        s_month,
        s_year,
        s_payment_mode: s_payment_mode === "all" ? "" : s_payment_mode,
      },
    }
  );

  const {
    isLoading: isChangeStatusToPaidLoading,
    refetch: changeStatusToPaid,
  } = useRequest(
    `/v1/employee/setSalaryStatusPaid`,
    {
      method: "POST",
      body: {
        bank_type,
        payment_accounting_head,
        s_month,
        s_year,
        s_payment_mode: s_payment_mode === "all" ? "" : s_payment_mode,
      },
    },
    {
      onSuccess: () => {
        refresh();
        handleDialogClose();
      },
    }
  );

  useEffect(() => {
    isSuccess && setState({ bank_type, s_month, s_year, s_payment_mode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const paymentModeChoices = !!paymentModes?.length
    ? paymentModes.map(({ t_title, t_machine_name }) => ({
        id: t_machine_name,
        name: capitalizeFirstLetterOfEachWord(t_title),
      }))
    : [];

  const handleDialogClose = () => {
    values.bank_type = undefined;
    values.s_month = undefined;
    values.s_year = undefined;
    values.s_payment_mode = undefined;
    reset();
    setState({});
    setIsDialogOpen(false);
  };

  const excelFilename = `Salary-${
    s_payment_mode === "bank" ? `bank-${bank_type}` : s_payment_mode
  }-${s_year}-${s_month}_T${toFormattedDateTime({
    isHyphen: true,
    dateString: new Date().toString(),
  })}`;

  const isDialogActions = isEqual(state, {
    bank_type,
    s_month,
    s_year,
    s_payment_mode,
  });

  return (
    <Dialog maxWidth="xl" open={isDialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Salary Export</DialogTitle>
      <DialogContent>
        <YearSelectInput source="s_year" fullWidth />
        <SelectInput
          source="s_month"
          label="Month"
          variant="outlined"
          helperText={false}
          choices={monthsWithId}
          fullWidth
        />
        <SelectInput
          source="s_payment_mode"
          label="Payment Mode"
          variant="outlined"
          helperText={false}
          choices={[...[{ id: "all", name: "All" }], ...paymentModeChoices]}
          fullWidth
        />
        {(s_payment_mode === "bank" || s_payment_mode === "card") && (
          <SelectInput
            source="bank_type"
            label="Bank"
            variant="outlined"
            helperText={false}
            choices={[
              { id: "city", name: "City to City" },
              { id: "other", name: "City to Other" },
            ]}
            fullWidth
          />
        )}
        <Button
          color="primary"
          variant="contained"
          onClick={refetch}
          disabled={!s_month || !s_year}
        >
          Process
        </Button>
        {!!data?.data?.length && (
          <Table
            size="small"
            style={{
              marginTop: 30,
              display: !isDialogActions ? "none" : "",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Total Employee</TableCell>
                <TableCell align="right">Total Salary</TableCell>
                <TableCell align="center">Export</TableCell>
                {permissions?.includes("setSalaryStatusPaid") &&
                  s_payment_mode !== "all" && (
                    <TableCell align="center">CHANGE STATUS TO PAID</TableCell>
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{data?.totalEmployee}</TableCell>
                <TableCell align="right">
                  {!!data?.totalSalary ? numberFormat(data.totalSalary) : ""}
                </TableCell>
                <TableCell align="center">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => onExportToXLSX(data?.data, excelFilename)}
                  >
                    <ImportExportIcon />
                  </span>
                </TableCell>
                {permissions?.includes("setSalaryStatusPaid") &&
                  s_payment_mode !== "all" && (
                    <TableCell align="center">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsChangeStatusDialogOpen(true)}
                      >
                        Mark As Paid
                      </span>
                      <Confirm
                        title="Are you sure you want to change salary status to paid?"
                        content={
                          <ReferenceInput
                            source="payment_accounting_head"
                            label="Head"
                            variant="outlined"
                            helperText={false}
                            reference="v1/accountingHead"
                            fullWidth
                          >
                            <AutocompleteInput
                              optionValue="ah_id"
                              optionText="ah_name"
                            />
                          </ReferenceInput>
                        }
                        isOpen={isChangeStatusDialogOpen}
                        loading={isChangeStatusToPaidLoading}
                        onConfirm={changeStatusToPaid}
                        onClose={() => setIsChangeStatusDialogOpen(false)}
                      />
                    </TableCell>
                  )}
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleDialogClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TypedExportDialog;
