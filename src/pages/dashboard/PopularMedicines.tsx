import LoaderOrButton from "@/components/common/LoaderOrButton";
import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC } from "react";

type PopularMedicinesProps = {
  table: "quantity" | "revenue";
  cardTitle: string;
  isLoading: boolean;
  refetch: () => void;
  data: any;
};

const PopularMedicines: FC<PopularMedicinesProps> = ({
  table,
  cardTitle,
  isLoading,
  refetch,
  data,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">{cardTitle}</Typography>
          {!data && (
            <LoaderOrButton
              label="Load"
              isLoading={isLoading}
              onClick={refetch}
            />
          )}
        </Box>
      </CardContent>
      {!!data?.length && (
        <TableContainer component={Paper} className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">
                  {table === "quantity" ? "Qty" : "Revenue"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!data?.length &&
                data.map((item) => (
                  <TableRow key={item.m_id}>
                    <TableCell component="th" scope="row">
                      {item.m_name} - {item.m_strength}
                    </TableCell>
                    <TableCell align="right">
                      <span
                        style={{
                          fontFamily: "Arial",
                        }}
                      >
                        ৳
                      </span>{" "}
                      {item.m_d_price}
                    </TableCell>
                    <TableCell align="right">{item.m_unit}</TableCell>
                    <TableCell align="right">
                      {table === "quantity"
                        ? item.total_qty
                        : item.total_revenue}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
};

const useStyles = makeStyles({
  table: {
    width: "100%",
    maxHeight: 300,
    display: "inline-block",
  },
});

export default PopularMedicines;
