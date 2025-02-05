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
import { FileField } from "react-admin";

import { getFormattedDateString } from "@/utils/helpers";
import TotalAmount from "../TotalAmount";
import UploadFile from "../UploadFile";
import AroggaProgress from "@/components/common/AroggaProgress";
import NoDataFound from "@/components/common/NoDataFound";

const Purchases = ({ isLoading, count, data, refresh }) => {
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
              <TableCell>Paid At</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Related Files</TableCell>
              <TableCell>Upload</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  {getFormattedDateString(item.pp_created_at)}
                </TableCell>
                <TableCell>{getFormattedDateString(item.pp_paid_at)}</TableCell>
                <TableCell>{item.pp_id}</TableCell>
                <TableCell align="right">{item.pp_inv_price}</TableCell>
                <TableCell>
                  <FileField
                    source="attachedFiles_pp_files"
                    src="src"
                    title="title"
                    target="_blank"
                    record={item}
                    // @ts-ignore
                    multiple
                  />
                </TableCell>
                <TableCell>
                  <UploadFile
                    id={item.id}
                    endpointKey="productPurchase"
                    refresh={refresh}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TotalAmount title="Total Purchase" amount={count} />
    </>
  );
};

export default Purchases;

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});
