import BellowList from "@/components/common/BellowList";
import { FC } from "react";
import { Pagination, PaginationProps } from "react-admin";

const LedgerPagination: FC<PaginationProps> = (props) => (
  <>
    <Pagination {...props} />
    <BellowList {...props} context="Ledger" />
  </>
);

export default LedgerPagination;
