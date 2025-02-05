import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FC, useState } from "react";
import { FileField, SelectInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { toFixedNumber } from "@/utils/helpers";
import Footer from "./Footer";
import UploadFile from "./UploadFile";

type ExpensesTableProps = {
  page: "create" | "edit";
  choices: { id: string; name: string }[];
  refresh: () => void;
  allItems: any[];
  setAllItems: (items: object[]) => void;
};

const ExpensesTable: FC<ExpensesTableProps> = ({
  page,
  choices,
  refresh,
  allItems,
  setAllItems,
}) => {
  const classes = useStyles();
  const { values } = useWatch();

  const [deletedExpenseIds, setDeletedExpenseIds] = useState([]);

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    } else if (
      !["Backspace", "ArrowLeft", "ArrowRight", "."].includes(e.key) &&
      isNaN(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleTypeOnFocus = (index: number) => {
    const newAllItems = [...allItems];
    const findIndex = newAllItems.findIndex((_, i) => i === index);
    newAllItems[findIndex].l_type = values[`l_type-${index}`];
    setAllItems(newAllItems);
  };

  const handleReasonOnBlur = (newValue: string, index: number) => {
    const newAllItems = [...allItems];
    const findIndex = newAllItems.findIndex((_, i) => i === index);
    newAllItems[findIndex].l_reason = newValue;
    setAllItems(newAllItems);
  };

  const handleAmountOnBlur = (newValue, index) => {
    const newAllItems = [...allItems];
    const findIndex = newAllItems.findIndex((_, i) => i === index);
    newAllItems[findIndex].l_amount = newValue * 1;
    setAllItems(newAllItems);
  };

  if (page === "edit") {
    values.deletedExpenseIds = deletedExpenseIds;
  }

  const handleRemove = (index, expenseId) => {
    if (page === "edit" && expenseId) {
      setDeletedExpenseIds((prevState) => [...prevState, expenseId]);
    }
    setAllItems(allItems.toSpliced(index, 1));
  };

  return (
    <>
      {!!allItems?.length && (
        <TableContainer>
          <Table size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Sl No</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Amount</TableCell>
                {page === "edit" && (
                  <>
                    <TableCell>Related Files</TableCell>
                    <TableCell>Upload</TableCell>
                  </>
                )}
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!allItems?.length &&
                allItems.map((item, i) => (
                  <TableRow key={allItems.length - i}>
                    <TableCell>{allItems.length - i}</TableCell>
                    <TableCell>
                      <SelectInput
                        label={false}
                        variant="outlined"
                        defaultValue={item.l_type}
                        source={`l_type-${i}`}
                        onFocus={() => handleTypeOnFocus(i)}
                        choices={choices}
                      />
                    </TableCell>
                    <TableCell
                      contentEditable={item.l_type !== "Salary and Allowances"}
                      suppressContentEditableWarning={true}
                      onBlur={(e) =>
                        handleReasonOnBlur(e.currentTarget.innerText.trim(), i)
                      }
                    >
                      {item.l_reason}
                    </TableCell>
                    <TableCell
                      contentEditable
                      suppressContentEditableWarning={true}
                      onKeyDown={handleOnKeyDown}
                      onBlur={(e) =>
                        handleAmountOnBlur(e.currentTarget.innerText.trim(), i)
                      }
                    >
                      {Math.abs(toFixedNumber(item.l_amount))}
                    </TableCell>
                    {page === "edit" && (
                      <>
                        <TableCell>
                          {(item.l_id || item.e_id) && (
                            <FileField
                              source="attachedFiles"
                              src="src"
                              title="title"
                              target="_blank"
                              record={item}
                              // @ts-ignore
                              multiple
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {(item.l_id || item.e_id) && (
                            <UploadFile
                              id={!!item.l_id ? item.l_id : item.e_id}
                              endpointKey="expenses"
                              refresh={refresh}
                            />
                          )}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <Button onClick={() => handleRemove(i, item.e_id)}>
                        <HighlightOffIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Footer
            title="Total Expense"
            amount={toFixedNumber(values.total_expenses)}
          />
        </TableContainer>
      )}
    </>
  );
};

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    marginTop: 20,
  },
});

export default ExpensesTable;
