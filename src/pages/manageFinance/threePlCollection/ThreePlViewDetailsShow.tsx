import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { FC, SetStateAction, useEffect, useState } from "react";
import { ShowProps, useNotify, useRedirect } from "react-admin";
import { Link, useParams } from "react-router-dom";

import ZonePagination from "@/components/manageDelivery/zones/ZonePagination";
import DetailsResolveModal from "@/components/manageFinance/threePlCollection/DetailsResolveModal";
import ViewDetailsFilter from "@/components/manageFinance/threePlCollection/ViewDetailsFilter";
import ViewDetailsTableHeader from "@/components/manageFinance/threePlCollection/ViewDetailsTableHeader";
import { useDocumentTitle } from "@/hooks";
import { getFormattedDateString } from "@/utils/helpers";
import { httpClient } from "@/utils/http";
import AroggaBackdrop from "@/components/common/AroggaBackdrop";

const ThreePlViewDetailsShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | 3PL View Details");
  const { id }: any = useParams();
  const notify = useNotify();
  const redirect = useRedirect();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(null);

  const fetchData = () => {
    setLoading(true);
    const queryParams = [
      `_page=${currentPage}`,
      `_perPage=${rowsPerPage}`,
      `_tc_id=${id}`,
      filterValue ? `_settlement_status=${filterValue}` : "",
    ]
      .filter(Boolean)
      .join("&");

    httpClient(`/v1/tplCollectionDetail?${queryParams}`, {})
      .then(({ json }: any) => {
        if (json?.status === "success") {
          setData(json?.data);
          setTotal(json?.total);
        }
        if (json?.status !== "success") {
          setData(json?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [filterValue, currentPage, rowsPerPage, id]);

  const renderSettlementRemark = (value: string) => {
    if (value === "paid_later") {
      return <span>Paid Later</span>;
    }
    if (value === "lost_damaged") {
      return <span>Lost & Damaged</span>;
    }
    if (value === "collection_not_found") {
      return <span>Collection not found</span>;
    }

    if (value === "product_returned") {
      return <span>Delivered in system, but product returned</span>;
    }
  };
  const renderSettlementStatus = (value: string) => {
    if (value === "settled") {
      return <span>Settled</span>;
    }
    if (value === "partially_settled") {
      return <span>Partially Settled</span>;
    }
  };
  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <ViewDetailsFilter
        onChange={(e) => setFilterValue(e.target.value)}
        settlement_status={filterValue}
      />
      <Paper>
        {data && data?.length === 0 && (
          <div style={{ padding: "14px 12px" }}>No results found</div>
        )}
        {data && data?.length > 0 && (
          <TableContainer>
            <Table
              stickyHeader
              aria-label="simple table"
              size="small"
              style={{ border: "none" }}
            >
              <ViewDetailsTableHeader />
              <AroggaBackdrop isLoading={loading} />
              <TableBody>
                {data?.map((row: any, idx: any) => (
                  <TableRow
                    key={row.refid}
                    style={{
                      backgroundColor:
                        row?.tcd_settlement_status === "partially_settled"
                          ? "#ffe6e4"
                          : "#fff",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {idx + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_ref_id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_invoice_no}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_product_price}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_shipping_price}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_payable_amount}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_collected_amount_cod}
                    </TableCell>
                    {/* <TableCell component="th" scope="row">
                                            {row?.tcd_new_collected_amount_cod}
                                        </TableCell> */}
                    <TableCell component="th" scope="row">
                      {getFormattedDateString(row?.tcd_payment_date)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_new_collected_amount_cod > 0 && (
                        <span>
                          {row?.tcd_collected_amount_cod +
                            row?.tcd_new_collected_amount_cod}
                        </span>
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {renderSettlementRemark(row?.tcd_settlement_remark)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {renderSettlementStatus(row?.tcd_settlement_status)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_comment}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_link_tc_id !== 0 && (
                        <Link
                          to={`/v1/tplCollection/${row?.tcd_link_tc_id}/show`}
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          {row?.tcd_link_tc_id}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.attachedFiles_tcd_reference_doc?.map((d: any) => (
                        <div>
                          <a href={d?.src} target="_blank">
                            {d?.title}
                          </a>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.tcd_settlement_status === "partially_settled" && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => {
                            setOpenDialog(true);
                            setSelectedRow(row);
                          }}
                        >
                          Resolve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <ZonePagination
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              total={total}
              currentPage={currentPage}
              handleChangePage={handleChangePage}
            />
          </TableContainer>
        )}
      </Paper>

      {openDialog && (
        <DetailsResolveModal
          open={openDialog}
          data={selectedRow}
          onClose={() => setOpenDialog(false)}
          onSuccess={fetchData}
        />
      )}
    </>
  );
};

export default ThreePlViewDetailsShow;
