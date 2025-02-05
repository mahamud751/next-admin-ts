/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Confirm, FileField, FileInput, useRefresh } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { numberFormat } from "@/utils/helpers";

type CreateBulkAdjustmentProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen) => void;
};

const CreateBulkAdjustment: FC<CreateBulkAdjustmentProps> = ({
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const { setValue } = useFormContext();
  const refresh = useRefresh();
  const { values } = useWatch();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [rowData, setRowData] = useState([]);

  const { isLoading: isSubmitLoading, refetch: handleSubmit } = useRequest(
    `/v1/bulkSalaryAdjustment`,
    {
      method: "POST",
      body: { rowData },
    },
    {
      onSuccess: () => {
        refresh();
        handleDialogClose();
        setValue("attachedFile", "");
      },
    }
  );

  useEffect(() => {
    setRowData([]);
  }, [values["attachedFile"]]);

  const csvToJsonConvert = (csvText) => {
    let lines = [];
    const linesArray = csvText.split("\n");
    // for trimming and deleting extra space
    linesArray.forEach((e: any) => {
      const row = e.replace(/[\s]+[,]+|[,]+[\s]+/g, ",").trim();
      lines.push(row);
    });
    // for removing empty record
    lines.splice(lines.length, 1);
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(",");
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      if (
        obj["salary_id"] &&
        obj["amount"] > 0 &&
        !isNaN(obj["amount"]) &&
        obj["type"]
      ) {
        result.push(obj);
      }
    }
    return result;
  };

  const handleProcess = () => {
    setIsSubmitDialogOpen(false);

    let file = values["attachedFile"];
    if (file) {
      if (!(file.rawFile instanceof File) && !(file.rawFile instanceof Blob)) {
        setRowData([]);
      }
      const reader = new FileReader();
      reader.readAsText(file.rawFile);
      reader.onload = () => {
        const text = reader.result;
        const csvToJson = csvToJsonConvert(text);
        setRowData(csvToJson);
      };
    } else {
      setRowData([]);
    }
  };

  const amountSum = (type, arr, targetValue) => {
    if (type === "amount") {
      return arr.reduce((amount, obj) => {
        if (obj.type === targetValue) {
          amount += parseFloat(obj.amount);
        }
        return amount;
      }, 0); // Initial amount is set to 0
    } else if (type === "count") {
      return arr.reduce((count, obj) => {
        if (obj.type === targetValue) {
          count += 1;
        }
        return count;
      }, 0); // Initial amount is set to 0
    }

    return 0;
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setRowData([]);
  };

  return (
    <Dialog maxWidth="xl" open={isDialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Create Bulk Adjustment</DialogTitle>
      <DialogContent>
        <FileInput
          source="attachedFile"
          label="Import Bulk Adjustment"
          helperText={false}
          accept={{
            "text/csv": [".csv"],
          }}
        >
          <FileField source="src" title="title" />
        </FileInput>
        <Button
          color="primary"
          variant="contained"
          onClick={handleProcess}
          disabled={!values["attachedFile"]}
        >
          Process
        </Button>
        {!!rowData?.length && (
          <Table
            size="small"
            style={{
              marginTop: 30,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  Total Employee: {amountSum("count", rowData, "addition")}
                </TableCell>
                <TableCell>
                  Total Addition:{" "}
                  {numberFormat(amountSum("amount", rowData, "addition"))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Total Employee: {amountSum("count", rowData, "deduction")}
                </TableCell>
                <TableCell>
                  Total Deduction :{" "}
                  {numberFormat(amountSum("amount", rowData, "deduction"))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsSubmitDialogOpen(true)}
                  >
                    <Button color="primary" variant="contained">
                      Submit
                    </Button>
                  </span>
                  <Confirm
                    title="Submit"
                    content="Are you sure you want to process bulk salary adjustment?"
                    isOpen={isSubmitDialogOpen}
                    loading={isSubmitLoading}
                    onConfirm={handleSubmit}
                    onClose={() => setIsSubmitDialogOpen(false)}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
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

export default CreateBulkAdjustment;
