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
import { FC } from "react";
import {
  AutocompleteInput,
  DateInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import { useWatch } from "react-hook-form";

import { autoGeneratedLedgerReason, toFixedNumber } from "@/utils/helpers";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import UserNameRankOptionTextRenderer from "@/components/common/UserNameRankOptionTextRenderer";

type LedgerMultipleEntryTableProps = {
  allItems: any[];
  setAllItems: (items: object[]) => void;
};

const LedgerMultipleEntryTable: FC<LedgerMultipleEntryTableProps> = ({
  allItems,
  setAllItems,
}) => {
  const classes = useStyles();
  const { values } = useWatch();

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
    const findIndex = allItems?.findIndex((_, i) => i === index);
    const newAllItems = [...allItems];
    newAllItems[findIndex].l_type = values[`l_type-${index}`];
    if (values[`l_type-${index}`] !== "salary_and_allowances") {
      newAllItems[findIndex].l_a_uid = 0;
      newAllItems[findIndex].l_a_date = 0;
    } else {
      newAllItems[findIndex].l_a_uid = values[`l_a_uid-${index}`];
      newAllItems[findIndex].l_a_date = values[`l_a_date-${index}`];
    }
    setAllItems(newAllItems);
  };

  const handleMethodOnFocus = (index) => {
    const findIndex = allItems?.findIndex((_, i) => i === index);
    const newAllItems = [...allItems];
    newAllItems[findIndex].l_method = values[`l_method-${index}`];
    setAllItems(newAllItems);
  };

  const handleAutoGeneratedReason = (index, user) => {
    const { u_name, u_id, u_rank } = user || {};

    const findIndex = allItems?.findIndex((_, i) => i === index);
    const newAllItems = [...allItems];
    newAllItems[findIndex].l_a_uid = values[`user-${index}`]?.u_id;
    newAllItems[findIndex].l_a_date = values[`l_a_date-${index}`];
    newAllItems[findIndex].l_reason = autoGeneratedLedgerReason({
      l_a_date: values[`l_a_date-${index}`],
      username: u_name || values[`user-${index}`]?.u_name,
      rank: u_rank || values[`user-${index}`]?.u_rank,
      l_a_uid: u_id || values[`user-${index}`]?.u_id,
    });
    setAllItems(newAllItems);
  };

  const handleReasonOnBlur = (newValue: string, index: number) => {
    const findIndex = allItems?.findIndex((_, i) => i === index);
    const newAllItems = [...allItems];
    newAllItems[findIndex].l_reason = newValue;
    setAllItems(newAllItems);
  };

  const handleAmountOnBlur = (newValue, index) => {
    const findIndex = allItems?.findIndex((_, i) => i === index);
    const newAllItems = [...allItems];
    newAllItems[findIndex].l_amount = newValue * 1;
    setAllItems(newAllItems);
  };

  const RemoveRow = ({ index }) => {
    const handleClickRowRemove = () => {
      setAllItems(allItems.toSpliced(index, 1));
    };

    return (
      <Button onClick={handleClickRowRemove}>
        <HighlightOffIcon />
      </Button>
    );
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
                <TableCell>Method</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!allItems?.length &&
                allItems.map((item, i) => (
                  <TableRow key={allItems.length - i}>
                    <TableCell>{allItems.length - i}</TableCell>
                    <TableCell>
                      <TaxonomiesByVocabularyInput
                        fetchKey="ledger_types"
                        source={`l_type-${i}`}
                        label={false}
                        optionValue="t_title"
                        initialValue={item.l_type}
                        onFocus={() => handleTypeOnFocus(i)}
                      />
                    </TableCell>
                    <TableCell>
                      <SelectInput
                        source={`l_method-${i}`}
                        label="Method"
                        variant="outlined"
                        helperText={false}
                        defaultValue={item.l_method}
                        choices={[
                          {
                            id: "Cash",
                            name: "Cash",
                          },
                          {
                            id: "Bank",
                            name: "Bank",
                          },
                        ]}
                        onFocus={() => handleMethodOnFocus(i)}
                      />
                    </TableCell>
                    <TableCell>
                      {item.l_type === "salary_and_allowances" && (
                        <ReferenceInput
                          initialValue={item.l_a_uid}
                          source={`l_a_uid-${i}`}
                          label=""
                          variant="outlined"
                          helperText={false}
                          reference="v1/users"
                          filter={{
                            _isEmployee: true,
                          }}
                        >
                          <AutocompleteInput
                            matchSuggestion={() => true}
                            optionValue="u_id"
                            inputText={(value) => value?.u_name}
                            optionText={<UserNameRankOptionTextRenderer />}
                            onSelect={(item: any) => {
                              const { u_name, u_id, u_rank } = item;
                              values[`user-${i}`] = {
                                u_name,
                                u_id,
                                u_rank,
                              };
                              handleAutoGeneratedReason(i, {
                                u_name,
                                u_id,
                                u_rank,
                              });
                            }}
                            fullWidth
                          />
                        </ReferenceInput>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.l_type === "salary_and_allowances" && (
                        <DateInput
                          source={`l_a_date-${i}`}
                          label=""
                          variant="outlined"
                          defaultValue={item.l_a_date}
                          onFocus={() => handleAutoGeneratedReason(i, {})}
                          fullWidth
                        />
                      )}
                    </TableCell>
                    <TableCell
                      contentEditable={item.l_type !== "salary_and_allowances"}
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
                      {toFixedNumber(item.l_amount)}
                    </TableCell>
                    <TableCell>
                      <RemoveRow index={i} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default LedgerMultipleEntryTable;
