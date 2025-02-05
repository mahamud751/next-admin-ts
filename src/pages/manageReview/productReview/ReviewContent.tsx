import { SetStateAction, useEffect, useState } from "react";
import { Title } from "react-admin";

import ZonePagination from "@/components/manageDelivery/zones/ZonePagination";
import ReviewCard from "@/components/manageReview/reviewCard";
import { useRequest } from "@/hooks";
import Filter from "./Filter";
import AroggaBackdrop from "@/components/common/AroggaBackdrop";
import NoDataFound from "@/components/common/NoDataFound";
type Props = {
  reviewStatus: string;
  setPendingCount: (e: SetStateAction<any>) => void;
};

export default function ReviewContent({
  reviewStatus,
  setPendingCount,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState<any>(null);
  const [filterValue, setFilterValue] = useState("");
  const queryParams = [
    `_orderBy=pr_modified_at`,
    `_perPage=${rowsPerPage}`,
    `_page=${currentPage}`,
    `${reviewStatus !== "all" && `_status=${reviewStatus}`}`,
    searchValue ? `_variant_id=${searchValue}` : "",
    filterValue ? `_order=${filterValue}` : "_order=DESC",
  ]
    .filter(Boolean)
    .join("&");

  const { isLoading, data, total, refetch } = useRequest(
    `/v1/productReview?${queryParams}`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      isWarningNotify: false,
      refreshDeps: [
        currentPage,
        rowsPerPage,
        reviewStatus,
        filterValue,
        searchValue,
      ],
      onSuccess: (json) => {
        if (reviewStatus === "pending") setPendingCount(json?.total);
      },
    }
  );

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Reset the page when the review status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [reviewStatus]);

  return (
    <div>
      {/* Loader */}
      <AroggaBackdrop isLoading={isLoading} />

      <Title title="Product Review" />
      {/* Filter */}
      <Filter
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        setFilterValue={setFilterValue}
      />

      {/* No data found page */}
      {data?.length === 0 && <NoDataFound message={"No review found!"} />}

      {data?.length !== 0 && (
        <>
          {/* Review Card */}
          {data?.map((d: any) => (
            <ReviewCard data={d} refresh={refetch} />
          ))}

          {/* Pagination */}
          <ZonePagination
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            total={total}
            currentPage={currentPage}
            handleChangePage={handleChangePage}
          />
        </>
      )}
    </div>
  );
}
