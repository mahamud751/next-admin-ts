import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReferenceField, TextField } from "react-admin";

import { getFormattedDateString } from "@/utils/helpers";
import TotalAmount from "../TotalAmount";
import NoDataFound from "@/components/common/NoDataFound";
import AroggaProgress from "@/components/common/AroggaProgress";

const Collections = ({ isLoading, count, data }) => {
  const classes = useStyles();

  if (isLoading)
    return (
      <Box position="relative" pt={10} pb={10}>
        <AroggaProgress />
      </Box>
    );

  if (!data?.length) return <NoDataFound />;

  return (
    <>
      <TableContainer>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Sl No</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Confirmed At</TableCell>
              <TableCell>From Name</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{getFormattedDateString(item.cc_created)}</TableCell>
                <TableCell>
                  {getFormattedDateString(item.cc_confirmed_at)}
                </TableCell>
                <TableCell>
                  <ReferenceField
                    source="cc_from_id"
                    reference="v1/users"
                    link="show"
                    record={item}
                  >
                    <TextField source="u_name" />
                  </ReferenceField>
                </TableCell>
                <TableCell align="right">{item.cc_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TotalAmount title="Total Collection" amount={count} />
    </>
  );
};

export default Collections;

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});
