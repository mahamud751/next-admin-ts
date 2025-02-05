import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC } from "react";
import { FileField, ReferenceField, TextField } from "react-admin";
import { useWatch } from "react-hook-form";

import Footer from "./Footer";
import UploadFile from "./UploadFile";

type CollectionsPurchasesProps = {
  tab: "collections" | "purchases";
  data?: any[];
  collectionDataByCCIDS?: any[];
  purchaseDataByPPIDS?: any[];
  refresh?: () => void;
};

const CollectionsPurchases: FC<CollectionsPurchasesProps> = ({
  tab,
  data,
  collectionDataByCCIDS,
  purchaseDataByPPIDS,
  refresh,
}) => {
  const classes = useStyles();
  const { values } = useWatch();
  return (
    <TableContainer>
      <Table size="small" className={classes.table}>
        {!!data?.length && (
          <TableHead>
            <TableRow>
              <TableCell>Sl No</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Related Files</TableCell>
              <TableCell>Upload</TableCell>
            </TableRow>
          </TableHead>
        )}
        {!data?.length && collectionDataByCCIDS?.length && (
          <TableHead>
            <TableRow>
              <TableCell>Sl No</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Confirmed At</TableCell>
              <TableCell>From Name</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
        )}
        {!data?.length && purchaseDataByPPIDS?.length && (
          <TableHead>
            <TableRow>
              <TableCell>Sl No</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Paid At</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Related Files</TableCell>
              <TableCell>Upload</TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {!!data?.length &&
            data.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.l_reason}</TableCell>
                <TableCell>{Math.abs(item.l_amount)}</TableCell>
                <TableCell>
                  <FileField
                    source="attachedFiles"
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
                    endpointKey="ledger"
                    refresh={refresh}
                  />
                </TableCell>
              </TableRow>
            ))}
          {!data?.length &&
            collectionDataByCCIDS?.length &&
            collectionDataByCCIDS.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.cc_created}</TableCell>
                <TableCell>{item.cc_confirmed_at}</TableCell>
                <TableCell>
                  <ReferenceField
                    source="cc_from_id"
                    label="From Name"
                    reference="v1/users"
                    link="show"
                    record={item}
                  >
                    <TextField source="u_name" />
                  </ReferenceField>
                </TableCell>
                <TableCell>{item.cc_amount}</TableCell>
              </TableRow>
            ))}
          {!data?.length &&
            purchaseDataByPPIDS?.length &&
            purchaseDataByPPIDS.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.pp_created_at}</TableCell>
                <TableCell>{item.pp_paid_at}</TableCell>
                <TableCell>{item.pp_id}</TableCell>
                <TableCell>{item.pp_inv_price}</TableCell>
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
                    // endpointKey="purchaseInvoice"
                    endpointKey="productPurchase"
                    refresh={refresh}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Footer
        title={tab === "collections" ? "Total Collection" : "Total Purchase"}
        amount={
          tab === "collections"
            ? values.total_collections
            : values.total_purchases
        }
      />
    </TableContainer>
  );
};

const useStyles = makeStyles({
  table: {
    width: "60%",
    margin: "auto",
  },
});

export default CollectionsPurchases;
